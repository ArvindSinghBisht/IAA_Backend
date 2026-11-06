import { referencePack } from "@/repositories/reference-pack.repository";
import { ApiError } from "@/lib/http";
export async function readReferencePack(kind: "layer" | "index") {
  try {
    return new Response(JSON.stringify(await referencePack(kind)), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
        "X-Content-Type-Options": "nosniff",
        "X-IAA-Data-Mode": "reference-pack",
      },
    });
  } catch {
    throw new ApiError(
      503,
      "REFERENCE_PACK_UNAVAILABLE",
      "Reference data pack is not available on this server",
    );
  }
}
