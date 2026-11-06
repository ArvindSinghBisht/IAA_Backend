import { test } from "node:test";
import assert from "node:assert/strict";
import { factSchemas } from "../src/services/monitoring-records";
import { scenarioInput } from "../src/services/planning";
import { profileInput, sectionCodes } from "../src/services/project-editor";
test("Energy records reject impossible balances and time order", () => {
  const base = {
    segment_code: "A",
    start_at: "2026-01-01T00:00:00Z",
    end_at: "2026-01-02T00:00:00Z",
    generation_mwh: 10,
    capacity_dc_mwp: 1,
    reference_hours: 24,
    meter_reference: "Meter A",
  };
  assert.ok(factSchemas.energy.safeParse(base).success);
  assert.equal(
    factSchemas.energy.safeParse({ ...base, export_mwh: 11 }).success,
    false,
  );
  assert.equal(
    factSchemas.energy.safeParse({ ...base, operational_hours: 25 }).success,
    false,
  );
  assert.equal(
    factSchemas.energy.safeParse({ ...base, end_at: base.start_at }).success,
    false,
  );
});
test("Land and inclusion denominators constrain component counts", () => {
  assert.equal(
    factSchemas.land.safeParse({
      plot_code: "A",
      site_area_ha: 2,
      cultivated_area_ha: 3,
    }).success,
    false,
  );
  assert.equal(
    factSchemas.inclusion.safeParse({
      population_code: "all",
      women: 2,
      men: 1,
      other_gender: 0,
      gender_unknown: 0,
      youth: 4,
      count_basis: "unique participants",
    }).success,
    false,
  );
});
test("Scenario rejects hidden parameters and missing yield", () => {
  assert.equal(
    scenarioInput.safeParse({ name: "A", parameters: { capacityDcMwp: 2 } })
      .success,
    false,
  );
  assert.equal(
    scenarioInput.safeParse({
      name: "A",
      parameters: {
        capacityDcMwp: 2,
        specificYieldKwhPerKwpYear: 1500,
        approved: true,
      },
    }).success,
    false,
  );
});
test("Profile requires valid date, geography and six stable UI sections", () => {
  assert.equal(sectionCodes.length, 6);
  assert.equal(
    profileInput.safeParse({
      name: "A",
      areaId: "bad",
      status: "operational",
      effectiveFrom: "tomorrow",
    }).success,
    false,
  );
});
