import type { RequestContext } from "@/http/handler";
import * as files from "@/services/files";
export async function upload(c: RequestContext) {
  return { data: await files.upload(c.actor!, c.request) };
}
export async function download(c: RequestContext) {
  return files.download(c.actor!, c.params.id);
}
export async function reviewFile(c: RequestContext) {
  return { data: await files.reviewFile(c.actor!, c.params.id, c.input) };
}
