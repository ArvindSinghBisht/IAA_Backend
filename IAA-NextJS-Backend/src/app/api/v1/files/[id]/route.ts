import { route, options } from "@/http/handler";
import * as files from "@/controllers/files.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const GET = route(
  { access: "authenticated", status: 200 },
  files.download,
);
