import { route, options } from "@/http/handler";
import * as files from "@/controllers/files.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const POST = route(
  { access: "authenticated", status: 201 },
  files.upload,
);
