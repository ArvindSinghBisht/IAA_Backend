import { route, options } from "@/http/handler";
import * as admin from "@/controllers/admin.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const PATCH = route(
  { access: "authenticated", status: 200, body: "json" },
  admin.updateResource,
);
export const DELETE = route(
  { access: "authenticated", status: 200 },
  admin.deleteResource,
);
