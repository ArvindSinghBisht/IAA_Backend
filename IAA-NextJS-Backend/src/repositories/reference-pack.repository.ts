import { readFile } from "node:fs/promises";
import { join } from "node:path";
/** Read-only source pack, kept outside public/. It is not an approved live-data publication. */
const filenames = {
  layer: "information-layer.json",
  index: "information-layer-index.json",
} as const;
export async function referencePack(kind: keyof typeof filenames) {
  return JSON.parse(
    await readFile(join(process.cwd(), "data", filenames[kind]), "utf8"),
  );
}
