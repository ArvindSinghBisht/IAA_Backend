import { route, options } from "@/http/handler";
import * as system from "@/controllers/system.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const GET = route({ access: "public", status: 200 }, system.ready);
