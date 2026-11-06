import { route, options } from "@/http/handler";
import { specification } from "@/controllers/documentation.controller";
export const runtime = "nodejs";
export const GET = route({ access: "public" }, specification);
export const OPTIONS = options;
