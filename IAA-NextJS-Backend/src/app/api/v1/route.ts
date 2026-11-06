import { route, options } from "@/http/handler";
import { index } from "@/controllers/documentation.controller";
export const GET = route({ access: "public" }, index);
export const OPTIONS = options;
