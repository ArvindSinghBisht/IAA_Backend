import type { RequestContext } from "@/http/handler";
import * as inquiries from "@/services/queries";
import * as users from "@/services/administration";
export async function queries(c: RequestContext) {
  return inquiries.listQueries(c.actor!);
}
export async function ask(c: RequestContext) {
  return { data: await inquiries.ask(c.actor!, c.input) };
}
export async function answer(c: RequestContext) {
  return { data: await inquiries.answer(c.actor!, c.params.id, c.input) };
}
export async function notifications(c: RequestContext) {
  return users.notifications(c.actor!);
}
export async function read(c: RequestContext) {
  return { data: await users.acknowledge(c.actor!, c.params.id) };
}
