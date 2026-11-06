import { route, options } from "@/http/handler";
import * as projects from "@/controllers/projects.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const GET = route(
  { access: "authenticated", status: 200 },
  projects.projects,
);
export const POST = route(
  { access: "authenticated", status: 201, body: "json" },
  projects.createProject,
);
