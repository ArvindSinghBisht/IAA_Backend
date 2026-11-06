import { test } from "node:test";
import assert from "node:assert/strict";

import { randomUUID } from "node:crypto";
import { resourceWrite } from "../../src/services/resources";
import { createProject } from "../../src/services/project-editor";
import { profileTransition } from "../../src/services/project-workflow";
import {
  approveDefinition,
  datasetTransition,
} from "../../src/services/admin-workflow";
import {
  createDraft,
  saveValue,
  transition,
  correction,
} from "../../src/services/monitoring";
import { release, monitoringDashboard } from "../../src/services/reporting";
import {
  createAssessment,
  saveScenario,
  runScenario,
} from "../../src/services/planning";
import { pool } from "../../src/lib/db";
import type { Actor } from "../../src/lib/auth";
import { embeddedDatabase } from "./database";
import { additionalCoverage } from "./coverage";
test(
  "All migrations and complete data/project/reporting/planning lifecycle execute against embedded PostGIS",
  { timeout: 120000 },
  async (t) => {
    const fixture = await embeddedDatabase();
    try {
      const db = pool();
      const org = (
        await db.query(
          "INSERT INTO core.organisations(code,name,organisation_type) VALUES('IT','Integration','test') RETURNING id",
        )
      ).rows[0];
      const actors: Actor[] = [];
      for (let i = 0; i < 2; i++) {
        const user = (
          await db.query(
            "INSERT INTO iaa_auth.users(identity_subject,email,display_name,organisation_id) VALUES($1,$2,$3,$4) RETURNING id",
            ["it-" + i, "it" + i + "@example.invalid", "Tester " + i, org.id],
          )
        ).rows[0];
        actors.push({
          id: user.id,
          organisationId: org.id,
          roles: [{ code: "system_admin", organisation_id: null }],
        });
      }
      const [a, b] = actors;
      const area = await resourceWrite(a, "geo.areas", {
        code_system: "IT",
        code: "A",
        name: "Test district",
        level: "district",
      });
      const source = await resourceWrite(a, "data.sources", {
        name: "Test source",
      });
      const dataset = await resourceWrite(a, "data.datasets", {
        source_id: source.id,
        code: "IT",
        title: "Test dataset",
        domain_no: 1,
      });
      const dv = await resourceWrite(a, "data.dataset_versions", {
        dataset_id: dataset.id,
        version_label: "1",
      });
      await datasetTransition(a, dv.id, { action: "submit", reason: "Ready" });
      await assert.rejects(() =>
        datasetTransition(a, dv.id, {
          action: "approve",
          reason: "Self review",
        }),
      );
      await datasetTransition(b, dv.id, {
        action: "approve",
        reason: "Verified",
      });
      await datasetTransition(b, dv.id, {
        action: "publish",
        reason: "Permitted",
        publicAllowed: true,
        planningAllowed: true,
        exportAllowed: false,
      });
      const p = await createProject(a, {
        code: "IT-P",
        organisationId: org.id,
        profile: {
          name: "Integration project",
          areaId: area.id,
          status: "operational",
          effectiveFrom: "2026-01-01",
          capacityDcMwp: 1,
          siteAreaHa: 2,
        },
      });
      const v = p.version.id;
      await resourceWrite(a, "project.designs", {
        project_version_id: v,
        array_code: "A",
        tilt_degrees: 20,
      });
      await profileTransition(a, v, { action: "submit", reason: "Ready" });
      await assert.rejects(() =>
        resourceWrite(a, "project.designs", {
          project_version_id: v,
          array_code: "B",
        }),
      );
      await profileTransition(b, v, { action: "approve", reason: "Checked" });
      await profileTransition(b, v, {
        action: "publish",
        reason: "Approved public profile",
        fields: [
          "project_id",
          "code",
          "name",
          "area_id",
          "model_id",
          "typology_id",
          "status",
          "capacity_dc_mwp",
        ],
      });
      const indicator = await resourceWrite(a, "mon.indicators", {
        code: "IT-N",
        name: "Test number",
        domain: "energy",
        aggregation: "sum",
      });
      const iv = await resourceWrite(a, "mon.indicator_versions", {
        indicator_id: indicator.id,
        version: 1,
        value_type: "number",
        validation: { min: 0 },
        frequency: "monthly",
      });
      await approveDefinition(a, "indicators", iv.id, {
        action: "approve",
        reason: "Definition verified",
      });
      const form = await resourceWrite(a, "mon.form_versions", {
        code: "IT-F",
        version: 1,
        name: "Test form",
      });
      await resourceWrite(a, "mon.form_fields", {
        form_version_id: form.id,
        indicator_version_id: iv.id,
        section_code: "energy",
        field_code: "generation",
        sort_order: 1,
        required: true,
        label_key: "generation",
      });
      await approveDefinition(a, "forms", form.id, {
        action: "approve",
        reason: "Form checked",
      });
      const period = await resourceWrite(a, "mon.periods", {
        code: "IT-PER",
        kind: "monthly",
        start_date: "2026-01-01",
        end_date: "2026-01-31",
        calendar_basis: "calendar",
      });
      const obligation = await resourceWrite(a, "mon.obligations", {
        project_id: p.id,
        period_id: period.id,
        form_version_id: form.id,
        assigned_to: a.id,
        reporting_stream: "monthly",
        due_at: "2026-02-15T00:00:00Z",
      });
      const ret = await createDraft(a, {
        obligationId: obligation.id,
        projectVersionId: v,
      });
      await saveValue(a, ret.id, { indicatorVersionId: iv.id, valueNumber: 0 });
      await resourceWrite(a, "mon.energy_records", {
        submission_version_id: ret.id,
        segment_code: "A",
        start_at: "2026-01-01T00:00:00Z",
        end_at: "2026-01-02T00:00:00Z",
        generation_mwh: 12,
        capacity_dc_mwp: 1,
        reference_hours: 24,
        meter_reference: "Test meter",
      });
      await transition(a, ret.id, { action: "submit" });
      await assert.rejects(() => transition(a, ret.id, { action: "approve" }));
      await transition(b, ret.id, { action: "approve" });
      await release(b, ret.id, { action: "release", reason: "Checked" });
      assert.equal((await monitoringDashboard(a, p.id)).data.length, 1);
      const corr = await correction(a, ret.id, {
        reason: "Correction requested",
      });
      assert.equal(corr.revision, 2);
      await transition(a, corr.id, { action: "submit" });
      await transition(b, corr.id, { action: "approve" });
      assert.equal(
        (
          await db.query(
            "SELECT status FROM mon.submission_versions WHERE id=$1",
            [ret.id],
          )
        ).rows[0].status,
        "superseded",
      );
      const assessment = await createAssessment({
        name: "Test",
        areaId: area.id,
        lat: 28,
        lon: 77,
      });
      const scenario = await saveScenario(
        assessment.id,
        assessment.accessToken,
        {
          name: "Initial",
          parameters: { capacityDcMwp: 1, specificYieldKwhPerKwpYear: 1500 },
        },
      );
      const run = await runScenario(assessment.id, assessment.accessToken, {
        scenarioId: scenario.id,
        idempotencyKey: "run-test-001",
      });
      assert.equal(run.output.energy.generationMwh, 1500);
      const replay = await runScenario(assessment.id, assessment.accessToken, {
        scenarioId: scenario.id,
        idempotencyKey: "run-test-001",
      });
      assert.equal(run.id, replay.id);

      await additionalCoverage(
        t,
        a,
        b,
        org.id,
        area.id,
        dataset.id,
        form.id,
        p.id,
      );
    } finally {
      await fixture.close();
    }
  },
);
