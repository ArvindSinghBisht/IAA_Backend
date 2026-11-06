import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL(".", import.meta.url));
const config: NextConfig = { output: "standalone", poweredByHeader: false, outputFileTracingRoot: root, outputFileTracingIncludes: {"/api/v1/wp1/information-layer/**/*": ["./data/*.json"], "/api/v1/wp1/information-layer": ["./data/*.json"], "/api/v1/openapi": ["./docs/openapi.json"]}, turbopack: { root } };
export default config;
