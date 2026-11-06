import { test } from "node:test";
import assert from "node:assert/strict";
import { estimateEnergy, cuf } from "../src/services/calculations";
test("MWp × kWh/kWp gives MWh without another factor of 1000", () => {
  const r = estimateEnergy({
    capacityDcMwp: 1,
    specificYieldKwhPerKwpYear: 1500,
  });
  assert.equal(r.generationMwh, 1500);
  assert(Math.abs(r.capacityFactorPct - 17.12328767) < 1e-6);
});
test("Reference hours support leap years", () =>
  assert.equal(
    cuf({ generationMwh: 8784, capacityMwp: 1, referenceHours: 8784 })
      .capacityFactorPct,
    100,
  ));
test("Invalid capacity and yield rejected", () => {
  assert.throws(() =>
    estimateEnergy({ capacityDcMwp: 0, specificYieldKwhPerKwpYear: 1500 }),
  );
  assert.throws(() =>
    estimateEnergy({ capacityDcMwp: 1, specificYieldKwhPerKwpYear: -4 }),
  );
  assert.throws(() =>
    cuf({ generationMwh: 1, capacityMwp: 0, referenceHours: 1 }),
  );
});
