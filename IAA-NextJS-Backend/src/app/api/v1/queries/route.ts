import { route, options } from "@/http/handler";
import * as learning from "@/controllers/learning.controller";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const OPTIONS = options;
export const GET = route(
  { access: "authenticated", status: 200 },
  learning.queries,
);
export const POST = route(
  { access: "authenticated", status: 201, body: "json" },
  learning.ask,
);
