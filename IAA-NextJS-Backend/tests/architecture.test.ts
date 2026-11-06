import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
async function files(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((e) =>
        e.isDirectory()
          ? files(path.join(dir, e.name))
          : Promise.resolve([path.join(dir, e.name)]),
      ),
    )
  ).flat();
}
test("Routes, controllers and services cannot open direct database connections", async () => {
  for (const root of ["src/app", "src/controllers", "src/services"])
    for (const file of await files(root)) {
      if (!/\.tsx?$/.test(file)) continue;
      const source = await readFile(file, "utf8");
      assert.doesNotMatch(
        source.replace(/^import type .*$/gm, ""),
        /from\s+['"](?:pg|@\/lib\/db|.*database\/connection)['"](?!.*type)/,
        file,
      );
      assert.doesNotMatch(source, /\.query\s*\(/, file);
      assert.doesNotMatch(
        source,
        /\b(?:SELECT\s+.+\s+FROM|INSERT\s+INTO|DELETE\s+FROM)\b/i,
        file,
      );
    }
});
test("Every explicit route manifest operation has a native route module", async () => {
  const manifest = JSON.parse(
    await readFile("src/generated/route-manifest.json", "utf8"),
  );
  for (const row of manifest) {
    const source = await readFile(
      "src/app/api/v1/" + row.path + "/route.ts",
      "utf8",
    );
    assert.match(source, new RegExp("export const " + row.method + "\\s*="));
    assert.doesNotMatch(
      source,
      /services\/|repositories\//,
      "Native routes must delegate through controllers",
    );
  }
  assert.ok(new Set(manifest.map((r: { path: string }) => r.path)).size >= 70);
});
test("Browser files use API endpoints, without database clients or exposed source-pack paths", async () => {
  for (const file of await files("public/portal")) {
    if (!/\.(?:html|js)$/.test(file)) continue;
    const source = await readFile(file, "utf8");
    assert.doesNotMatch(source, /postgres(?:ql)?:\/\//i, file);
    assert.doesNotMatch(source, /fetch\(['"]data\/information-layer/, file);
    assert.doesNotMatch(source, /require\(['"]pg['"]|from ['"]pg['"]/, file);
  }
});
