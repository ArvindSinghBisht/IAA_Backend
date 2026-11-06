import type { RequestContext } from "@/http/handler";
import * as system from "@/services/system";
export async function health(c: RequestContext) {
  return system.health();
}
export async function ready(c: RequestContext) {
  return system.readiness();
}
