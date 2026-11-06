import { openApiDocument } from "@/repositories/documentation.repository";
export function apiIndex() {
  return {
    service: "IAA portal backend",
    version: "0.3.0",
    modules: [
      "wp1",
      "wp2",
      "wp3",
      "internal",
      "admin",
      "manage",
      "files",
      "queries",
      "notifications",
    ],
    openapi: "/api/v1/openapi",
    health: "/api/v1/health",
    readiness: "/api/v1/ready",
  };
}
export const specification = () => openApiDocument();
