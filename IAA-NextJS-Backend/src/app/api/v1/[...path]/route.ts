import { ApiError, handle } from "@/lib/http";
/** Uniform JSON fallback only. Implemented endpoints live in their own route modules. */
const notFound = () =>
  handle(async () => {
    throw new ApiError(404, "NOT_FOUND", "API route not found");
  });
export {
  notFound as GET,
  notFound as POST,
  notFound as PUT,
  notFound as PATCH,
  notFound as DELETE,
};
