import * as repository from "@/repositories/rate-limit.repository";
import { createHash } from "node:crypto";

import { ApiError } from "./http";
export async function publicPlanningLimit(req: Request) {
  if (
    req.method !== "POST" ||
    !new URL(req.url).pathname.includes("/wp2/assessments")
  )
    return;
  const header = process.env.TRUSTED_CLIENT_IP_HEADER;
  const identity = header ? req.headers.get(header) || "shared" : "shared";
  const bucket =
    "planning:" +
    createHash("sha256").update(identity.slice(0, 200)).digest("hex");
  const r = (await repository.insertOpsApiRateLimits([bucket], undefined))
    .rows[0];
  if (
    r.requests > Number(process.env.PUBLIC_PLANNING_REQUESTS_PER_MINUTE || 60)
  )
    throw new ApiError(
      429,
      "RATE_LIMIT",
      "Too many planning requests; retry in one minute",
    );
}
