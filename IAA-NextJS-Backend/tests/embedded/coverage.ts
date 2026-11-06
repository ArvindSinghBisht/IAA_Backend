import assert from "node:assert/strict";
import type { TestContext } from "node:test";
import { createServer } from "node:http";
import { generateKeyPair, exportJWK, SignJWT } from "jose";
import { resourceWrite, resourceList } from "../../src/services/resources";
import {
  upload,
  reviewFile,
  download,
  publicDownload,
} from "../../src/services/files";
import { runImport, resolveIssue } from "../../src/services/imports";
import { datasetTransition } from "../../src/services/admin-workflow";
import * as gis from "../../src/services/gis";
import { nearby } from "../../src/services/public-data";
import { pool } from "../../src/lib/db";
import type { Actor } from "../../src/lib/auth";
export async function additionalCoverage(
  t: TestContext,
  a: Actor,
  b: Actor,
  orgId: string,
  areaId: string,
  datasetId: string,
  formId: string,
  projectId: string,
) {
  const db = pool();
  await t.test(
    "Imports preserve original rows, quarantine invalid data, respect file and publication permissions",
    async () => {
      const version = await resourceWrite(a, "data.dataset_versions", {
        dataset_id: datasetId,
        version_label: "2",
      });
      const unit = await resourceWrite(a, "core.units", {
        code: "mm",
        name: "Millimetres",
        dimension: "length",
      });
      const csv =
        "metric,start,end,value\nannual_rainfall,2026-01-01,2026-01-31,120\nannual_rainfall,2026-02-01,2026-02-28,not-a-number\n";
      const file = await upload(
        a,
        new Request("http://localhost/api/v1/files", {
          method: "POST",
          headers: {
            "Content-Type": "text/csv",
            "X-File-Name": "rainfall.csv",
          },
          body: csv,
        }),
      );
      await assert.rejects(
        () =>
          download(
            { ...a, roles: [{ code: "project_user", organisation_id: orgId }] },
            file.id,
          ),
        /not passed review/,
      );
      await reviewFile(b, file.id, {
        status: "clean",
        reason: "Test fixture reviewed",
      });
      assert.equal(await (await download(a, file.id)).text(), csv);
      const input = {
        datasetVersionId: version.id,
        fileId: file.id,
        sheet: "Sheet1",
        target: "wp1.environment_observations",
        headerRows: 1,
        mapping: { metric_code: 0, period_start: 1, period_end: 2, value: 3 },
        constants: {
          area_id: areaId,
          unit_id: unit.id,
          resolution: "district",
        },
        idempotencyKey: "rainfall-import-001",
      };
      const job = await runImport(a, input);
      assert.equal(job.row_counts.accepted, 1);
      assert.equal(job.row_counts.quarantined, 1);
      assert.equal((await runImport(a, input)).id, job.id);
      await assert.rejects(
        () =>
          runImport(a, {
            ...input,
            constants: { ...input.constants, resolution: "state" },
          }),
        /key was used/,
      );
      const issue = (
        await db.query(
          "SELECT id FROM data.quality_issues WHERE resolved_at IS NULL",
        )
      ).rows[0];
      const station = await resourceWrite(a, "wp1.substations", {
        code: "TEST-ST",
        name: "Test substation",
      });
      await resourceWrite(a, "wp1.substation_versions", {
        dataset_version_id: version.id,
        substation_id: station.id,
        area_id: areaId,
        point: { type: "Point", coordinates: [77, 28] },
        capacity_mva: 10,
      });
      const layer = await resourceWrite(a, "geo.layers", {
        dataset_version_id: version.id,
        code: "TEST-LAYER",
        name: "Test geometry",
        layer_type: "vector",
      });
      await resourceWrite(a, "geo.features", {
        layer_id: layer.id,
        source_feature_key: "P1",
        geom: { type: "Point", coordinates: [77, 28] },
        attributes: { name: "Test point" },
      });
      await datasetTransition(a, version.id, {
        action: "submit",
        reason: "Ready for review",
      });
      await assert.rejects(
        () =>
          datasetTransition(b, version.id, {
            action: "approve",
            reason: "Cannot ignore errors",
          }),
        /Resolve error/,
      );
      await resolveIssue(b, issue.id, {
        resolution:
          "Invalid source value excluded pending corrected partner data",
      });
      await datasetTransition(b, version.id, {
        action: "approve",
        reason: "Accepted rows checked; excluded row documented",
      });
      await datasetTransition(b, version.id, {
        action: "publish",
        reason: "Approved release",
        publicAllowed: true,
        planningAllowed: true,
        exportAllowed: false,
      });
      assert.equal(
        (await gis.districtDomain(areaId, "environment", {})).data.length,
        1,
      );
      assert.ok(
        (await nearby({ lat: "28", lon: "77" })).data.some(
          (x) => x.kind === "substation",
        ),
      );
      const features = await gis.layerFeatures(layer.id, {
        west: "76",
        south: "27",
        east: "78",
        north: "29",
      });
      assert.equal(features.features.length, 1);
      await assert.rejects(
        () => gis.exportDataset(version.id, "wp1.environment_observations", {}),
        /does not permit/,
      );
      await assert.rejects(
        async () =>
          resourceWrite(
            a,
            "geo.features",
            { attributes: { changed: true } },
            (await db.query("SELECT id FROM geo.features LIMIT 1")).rows[0].id,
          ),
        /draft dataset/,
      );
      assert.equal((await gis.search({ q: "substation" })).data.length, 1);
      await assert.rejects(() => publicDownload(file.id), /No published file/);
    },
  );
  await t.test(
    "Approved reporting fields cannot be moved into another draft form",
    async () => {
      const field = (
        await db.query(
          "SELECT id FROM mon.form_fields WHERE form_version_id=$1 LIMIT 1",
          [formId],
        )
      ).rows[0];
      const other = await resourceWrite(a, "mon.form_versions", {
        code: "OTHER",
        version: 1,
        name: "Other form",
      });
      await assert.rejects(
        () =>
          resourceWrite(
            a,
            "mon.form_fields",
            { form_version_id: other.id },
            field.id,
          ),
        /Parent cannot change/,
      );
      const outsider: Actor = { id: a.id, organisationId: null, roles: [] };
      await assert.rejects(
        async () =>
          resourceList(outsider, "project.designs", {
            parentId: (
              await db.query(
                "SELECT id FROM project.versions WHERE project_id=$1",
                [projectId],
              )
            ).rows[0].id,
          }),
        /permission/,
      );
    },
  );
  await t.test(
    "Real JWT signature, subject lookup, role lookup and API authentication work together",
    async () => {
      const { privateKey, publicKey } = await generateKeyPair("RS256", {
        extractable: true,
      });
      const jwk = await exportJWK(publicKey);
      jwk.kid = "test-key";
      jwk.alg = "RS256";
      const server = createServer((req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ keys: [jwk] }));
      });
      await new Promise<void>((resolve) =>
        server.listen(0, "127.0.0.1", resolve),
      );
      const port = (server.address() as { port: number }).port;
      const previous = {
        url: process.env.OIDC_JWKS_URL,
        issuer: process.env.OIDC_ISSUER,
        audience: process.env.OIDC_AUDIENCE,
      };
      process.env.OIDC_JWKS_URL = `http://127.0.0.1:${port}/jwks`;
      process.env.OIDC_ISSUER = "https://issuer.test";
      process.env.OIDC_AUDIENCE = "iaa-api";
      try {
        await db.query(
          "INSERT INTO iaa_auth.user_roles(user_id,role_id) SELECT $1,id FROM iaa_auth.roles WHERE code='system_admin' ON CONFLICT DO NOTHING",
          [a.id],
        );
        const token = await new SignJWT({})
          .setProtectedHeader({ alg: "RS256", kid: "test-key" })
          .setSubject("it-0")
          .setIssuer("https://issuer.test")
          .setAudience("iaa-api")
          .setIssuedAt()
          .setExpirationTime("5m")
          .sign(privateKey);
        const { GET } = await import("../../src/app/api/v1/auth/me/route");
        const ctx = { params: Promise.resolve({}) };
        const response = await GET(
          new Request("http://localhost/api/v1/auth/me", {
            headers: { Authorization: "Bearer " + token },
          }),
          ctx,
        );
        assert.equal(response.status, 200);
        assert.equal((await response.json()).data.id, a.id);
        const bad = await GET(
          new Request("http://localhost/api/v1/auth/me", {
            headers: { Authorization: "Bearer invalid" },
          }),
          ctx,
        );
        assert.equal(bad.status, 401);
      } finally {
        for (const [key, value] of [
          ["OIDC_JWKS_URL", previous.url],
          ["OIDC_ISSUER", previous.issuer],
          ["OIDC_AUDIENCE", previous.audience],
        ]) {
          if (value) process.env[key!] = value;
          else delete process.env[key!];
        }
        await new Promise<void>((resolve, reject) =>
          server.close((e) => (e ? reject(e) : resolve())),
        );
      }
    },
  );
}
