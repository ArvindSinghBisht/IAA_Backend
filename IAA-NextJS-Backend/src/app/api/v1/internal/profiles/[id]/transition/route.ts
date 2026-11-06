import { route, options } from "@/http/handler";
import * as projects from "@/controllers/projects.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const POST = route(
  { access: "authenticated", status: 200, body: "json" },
  projects.transition,
);
