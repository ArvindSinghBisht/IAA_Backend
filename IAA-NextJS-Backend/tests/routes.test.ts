import { test } from "node:test";
import assert from "node:assert/strict";
import { GET as health } from "../src/app/api/v1/health/route";
import { POST as energy } from "../src/app/api/v1/wp2/estimate-energy/route";
import { GET as me } from "../src/app/api/v1/auth/me/route";
import { GET as unknown } from "../src/app/api/v1/[...path]/route";
import { GET as profile } from "../src/app/api/v1/wp1/projects/[id]/route";
const context = (params: Record<string, string> = {}) => ({
  params: Promise.resolve(params),
});
test("Health does not require a database", async () => {
  const r = await health(
    new Request("http://localhost/api/v1/health"),
    context(),
  );
  assert.equal(r.status, 200);
  assert.equal((await r.json()).status, "ok");
});
test("Energy endpoint validates input and calculates units", async () => {
  const r = await energy(
    new Request("http://localhost/api/v1/wp2/estimate-energy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        capacityDcMwp: 2,
        specificYieldKwhPerKwpYear: 1500,
      }),
    }),
    context(),
  );
  assert.equal(r.status, 200);
  assert.equal((await r.json()).data.generationMwh, 3000);
  const bad = await energy(
    new Request("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: '{"capacityDcMwp":-1}',
    }),
    context(),
  );
  assert.equal(bad.status, 400);
});
test("Unconfigured auth fails closed rather than granting access", async () => {
  const before = process.env.OIDC_JWKS_URL;
  delete process.env.OIDC_JWKS_URL;
  try {
    assert.equal(
      (await me(new Request("http://localhost/api/v1/auth/me"), context()))
        .status,
      503,
    );
  } finally {
    if (before) process.env.OIDC_JWKS_URL = before;
  }
});
test("Unknown route returns uniform JSON 404", async () =>
  assert.equal((await unknown()).status, 404));
test("Invalid route UUID fails before querying PostgreSQL", async () =>
  assert.equal(
    (
      await profile(
        new Request("http://localhost/api/v1/wp1/projects/bad"),
        context({ id: "bad" }),
      )
    ).status,
    400,
  ));
test("JSON media type and untrusted origins are rejected", async () => {
  assert.equal(
    (
      await energy(
        new Request("http://localhost/api/v1/wp2/estimate-energy", {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: "{}",
        }),
        context(),
      )
    ).status,
    415,
  );
  assert.equal(
    (
      await health(
        new Request("http://localhost/api/v1/health", {
          headers: { Origin: "https://untrusted.example" },
        }),
        context(),
      )
    ).status,
    403,
  );
});
test("Static production handlers do not require Next dynamic route params", async () => {
  const r = await health(new Request("http://localhost/api/v1/health"));
  assert.equal(r.status, 200);
  assert.equal(
    (await health(new Request("http://localhost/api/v1/health"), {})).status,
    200,
  );
});
