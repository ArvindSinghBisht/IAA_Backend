import { route, options } from "@/http/handler";
import * as monitoring from "@/controllers/monitoring.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const DELETE = route(
  { access: "authenticated", status: 200 },
  monitoring.deleteRecord,
);
