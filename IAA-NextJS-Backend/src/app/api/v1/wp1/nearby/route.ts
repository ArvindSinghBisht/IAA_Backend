import { route, options } from "@/http/handler";
import * as explorer from "@/controllers/explorer.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const GET = route(
  { access: "public", status: 200 },
  explorer.wp1_nearby,
);
