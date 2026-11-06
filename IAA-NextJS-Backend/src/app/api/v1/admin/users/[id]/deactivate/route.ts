import { route, options } from "@/http/handler";
import * as admin from "@/controllers/admin.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const POST = route(
  { access: "authenticated", status: 200 },
  admin.deactivate,
);
