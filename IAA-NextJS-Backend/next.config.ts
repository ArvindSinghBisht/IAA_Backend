import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
const config: NextConfig = { output: "standalone", poweredByHeader: false, outputFileTracingRoot: root, turbopack: { root } };
export default config;
