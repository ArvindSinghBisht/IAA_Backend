import { route, options } from "@/http/handler";
import * as explorer from "@/controllers/explorer.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const POST = route(
  { access: "public", status: 200, body: "json" },
  explorer.compare,
);
