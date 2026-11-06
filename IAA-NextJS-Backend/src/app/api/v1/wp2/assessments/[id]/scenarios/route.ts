import { route, options } from "@/http/handler";
import * as planning from "@/controllers/planning.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const POST = route(
  { access: "planning", status: 201, body: "json", planningLimit: true },
  planning.saveScenario,
);
