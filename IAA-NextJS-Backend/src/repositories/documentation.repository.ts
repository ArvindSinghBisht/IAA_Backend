import { readFile } from "node:fs/promises";
import { join } from "node:path";
export async function openApiDocument() {
  return JSON.parse(
    await readFile(join(process.cwd(), "docs", "openapi.json"), "utf8"),
  );
}
