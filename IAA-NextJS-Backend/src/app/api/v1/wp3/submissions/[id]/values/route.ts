import { route, options } from "@/http/handler";
import * as monitoring from "@/controllers/monitoring.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const PUT = route(
  { access: "authenticated", status: 200, body: "json" },
  monitoring.saveValue,
);
