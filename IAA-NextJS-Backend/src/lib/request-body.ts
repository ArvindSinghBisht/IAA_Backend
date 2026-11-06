import { ApiError } from "./errors";
export async function readBytes(req: Request, max: number) {
  if (Number(req.headers.get("content-length") ?? 0) > max)
    throw new ApiError(413, "BODY_TOO_LARGE", "File exceeds upload limit");
  const reader = req.body?.getReader();
  if (!reader) throw new ApiError(400, "EMPTY_BODY", "Supply a file");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > max) {
        await reader.cancel();
        throw new ApiError(
          413,
          "BODY_TOO_LARGE",
          "Upload exceeds allowed size",
        );
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
