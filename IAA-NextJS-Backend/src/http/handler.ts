import { authenticate, type Actor } from "@/lib/auth";
import { ApiError, body, handle, response, uuid } from "@/lib/http";
import { publicPlanningLimit } from "@/lib/rate-limit";
export type RequestContext = {
  request: Request;
  params: Record<string, string>;
  query: Record<string, string>;
  actor?: Actor;
  input?: unknown;
  planningToken: string | null;
};
export type Action = (context: RequestContext) => Promise<unknown> | unknown;
export type RouteOptions = {
  access?: "public" | "authenticated" | "planning";
  body?: "json";
  status?: number;
  planningLimit?: boolean;
};
type NextContext = { params?: Promise<Record<string, string>> };
function originHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("origin");
  const allowed = (process.env.CORS_ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!origin || origin === new URL(req.url).origin) return {};
  if (!allowed.includes(origin))
    throw new ApiError(
      403,
      "ORIGIN_NOT_ALLOWED",
      "This origin is not allowed by the API",
    );
  return { "Access-Control-Allow-Origin": origin, Vary: "Origin" };
}
export function route(options: RouteOptions, action: Action) {
  return async (request: Request, context: NextContext = {}) => {
    const output = await handle(async () => {
      const headers = originHeaders(request);
      const actor =
        options.access === "authenticated"
          ? await authenticate(request)
          : undefined;
      const params = (await context.params) ?? {};
      for (const [key, value] of Object.entries(params))
        if (key === "id" || key === "recordId") uuid.parse(value);
      if (options.planningLimit) await publicPlanningLimit(request);
      let input: unknown;
      if (options.body === "json") {
        const media = request.headers.get("content-type");
        if (media && !media.split(";")[0].includes("json"))
          throw new ApiError(415, "CONTENT_TYPE", "Use application/json");
        input = await body(request);
      }
      const result = await action({
        request,
        params,
        query: Object.fromEntries(new URL(request.url).searchParams),
        actor,
        input,
        planningToken: request.headers.get("x-planning-token"),
      });
      const out =
        result instanceof Response
          ? result
          : response(result, options.status ?? 200);
      for (const [key, value] of Object.entries(headers))
        out.headers.set(key, value);
      return out;
    });
    try {
      for (const [key, value] of Object.entries(originHeaders(request)))
        output.headers.set(key, value);
    } catch {
      /* Rejected origins never get access headers. */
    }
    return output;
  };
}
export function options(request: Request) {
  return handle(async () => {
    const headers = originHeaders(request);
    return new Response(null, {
      status: 204,
      headers: {
        ...headers,
        "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "Access-Control-Allow-Headers":
          "Authorization,Content-Type,X-Planning-Token,X-File-Name",
        "Access-Control-Max-Age": "600",
      },
    });
  });
}
