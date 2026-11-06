import { test } from "node:test";
import assert from "node:assert/strict";
import { resourceInput, definition } from "../src/services/resources";
import {
  canonical,
  digest,
  validateForm,
  validateValue,
  calculateMonitoring,
  type Field,
} from "../src/services/monitoring-validation";
import { runEngine } from "../src/services/planning-engines";
import { parseCsv } from "../src/services/imports";
import { csvCell } from "../src/services/gis";
const field: Field = {
  id: "i1",
  field_code: "count",
  required: true,
  repeat_group: null,
  value_type: "number",
  validation: { min: 0, max: 10 },
};
test("Static resource allowlist rejects arbitrary SQL and reserved approval fields", () => {
  assert.throws(() => definition("core.users;DROP TABLE x"));
  assert.throws(() => definition("constructor"));
  assert.throws(() =>
    resourceInput("data.dataset_versions", {
      dataset_id: "00000000-0000-4000-8000-000000000001",
      version_label: "1",
      status: "approved",
    }),
  );
  assert.throws(() => resourceInput("project.designs", { approved_by: "x" }));
  assert.ok(definition("data.datasets").columns.domain_no);
});
test("Required numbers include zero; booleans include false; numeric bounds enforced", () => {
  assert.deepEqual(
    validateValue(field, {
      indicator_version_id: "i1",
      repeat_key: "site",
      value_number: 0,
    }),
    [],
  );
  assert.ok(
    validateValue(field, {
      indicator_version_id: "i1",
      repeat_key: "site",
      value_number: 11,
    }).length,
  );
  assert.deepEqual(
    validateValue(
      { ...field, value_type: "boolean", validation: {} },
      { indicator_version_id: "i1", repeat_key: "site", value_boolean: false },
    ),
    [],
  );
});
test("Repeat groups require every required field for each row", () => {
  const fs = [
    { ...field, repeat_group: "plot" },
    { ...field, id: "i2", field_code: "area", repeat_group: "plot" },
  ];
  assert.ok(
    validateForm(
      fs,
      [{ indicator_version_id: "i1", repeat_key: "plot1", value_number: 1 }],
      [],
    ).some((x) => x.field === "area:plot1"),
  );
});
test("Date snapshots change hashes and object key order does not", () => {
  assert.equal(digest({ a: 1, b: 2 }), digest({ b: 2, a: 1 }));
  assert.notEqual(
    digest(new Date("2026-01-01")),
    digest(new Date("2026-02-01")),
  );
  assert.equal(canonical(new Date("2026-01-01")), '"2026-01-01T00:00:00.000Z"');
});
test("Monitoring ratios use capacity-hours and preserve distinct income grains", () => {
  const m = calculateMonitoring({
    energy_records: [
      { generation_mwh: "24", capacity_dc_mwp: "2", reference_hours: "24" },
    ],
    income_records: [
      {
        scope_kind: "project",
        scope_key: "all",
        component: "energy",
        accounting_basis: "gross_receipt",
        amount_inr: "100",
      },
    ],
  });
  assert.equal(m.capacityFactorDcPct, 50);
  assert.equal(m.income.length, 1);
});
test("CSV handles quoted commas, quotes, embedded newlines and rejects unclosed input", () => {
  assert.deepEqual(parseCsv('a,b\r\n"a,b","c""d"\n"line\nb",x'), [
    ["a", "b"],
    ["a,b", 'c"d'],
    ["line\nb", "x"],
  ]);
  assert.throws(() => parseCsv('"broken'));
  assert.ok(csvCell('=WEBSERVICE("x")').startsWith("\"'"));
});
test("MCDA missing criteria are withheld, weights must sum to one", () => {
  const c = {
    implementation: "weighted-score-v1",
    criteria: [
      { field: "sun", weight: 1, min: 0, max: 10, direction: "higher" },
    ],
  };
  assert.equal(runEngine(c, { sun: 5 }).score, 50);
  assert.equal(runEngine(c, {}).status, "cannot_assess");
  assert.equal(
    runEngine(
      { ...c, criteria: [{ ...c.criteria[0], weight: 0.5 }] },
      { sun: 5 },
    ).status,
    "cannot_assess",
  );
});
test("Shading uses supplied sun angle; below-horizon and weather heat are not fabricated", () => {
  const p = {
    clearanceM: 2,
    panelChordM: 2,
    tiltDeg: 0,
    rowPitchM: 5,
    sunElevationDeg: 45,
    sunAzimuthDeg: 90,
    rowNormalAzimuthDeg: 90,
  };
  const r = runEngine({ implementation: "row-shadow-v1" }, p);
  assert.ok(Math.abs(Number(r.result.shadowLengthM) - 2) < 1e-9);
  assert.equal(r.result.groundTemperature, null);
  assert.equal(
    runEngine(
      { implementation: "row-shadow-v1" },
      { ...p, sunElevationDeg: -1 },
    ).status,
    "cannot_assess",
  );
});
test("Cashflow arithmetic includes time-zero investment", () => {
  const r = runEngine(
    { implementation: "discounted-cashflow-v1" },
    { capexInr: 100, discountRate: 0, annualNetCashflowsInr: [60, 60] },
  );
  assert.equal(r.result.npvInr, 20);
  assert.ok(
    Math.abs(Number(r.result.simplePaybackYears) - 1.6666666667) < 1e-8,
  );
});
test("GIS input rejects out-of-range longitude/latitude rather than clamping", () => {
  const id = "00000000-0000-4000-8000-000000000001";
  assert.throws(() =>
    resourceInput("wp1.substation_versions", {
      dataset_version_id: id,
      substation_id: id,
      area_id: id,
      point: { type: "Point", coordinates: [77, 999] },
    }),
  );
});
