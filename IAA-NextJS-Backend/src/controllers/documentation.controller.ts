import type { RequestContext } from "@/http/handler";
import * as documentation from "@/services/documentation";
export const index = (_context: RequestContext) => documentation.apiIndex();
export const specification = (_context: RequestContext) =>
  documentation.specification();
