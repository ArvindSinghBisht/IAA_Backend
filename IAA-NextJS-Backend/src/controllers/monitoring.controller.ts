import type { RequestContext } from "@/http/handler";
import * as facts from "@/services/monitoring-records";
import * as monitor from "@/services/monitoring";
import * as reporting from "@/services/reporting";
import * as system from "@/services/system";
export async function obligations(c: RequestContext) {
  return { data: await facts.obligations(c.actor!, c.params.id) };
}
export async function form(c: RequestContext) {
  return { data: await facts.form(c.actor!, c.params.id) };
}
export async function dashboard(c: RequestContext) {
  return reporting.monitoringDashboard(c.actor!, c.params.id);
}
export async function create(c: RequestContext) {
  return { data: await monitor.createDraft(c.actor!, c.input) };
}
export async function submission(c: RequestContext) {
  return system.submission(c.actor!, c.params.id);
}
export async function saveValue(c: RequestContext) {
  return { data: await monitor.saveValue(c.actor!, c.params.id, c.input) };
}
export async function transition(c: RequestContext) {
  return { data: await monitor.transition(c.actor!, c.params.id, c.input) };
}
export async function validate(c: RequestContext) {
  return { data: await monitor.validateRevision(c.actor!, c.params.id) };
}
export async function correct(c: RequestContext) {
  return { data: await monitor.correction(c.actor!, c.params.id, c.input) };
}
export async function release(c: RequestContext) {
  return { data: await reporting.release(c.actor!, c.params.id, c.input) };
}
export async function history(c: RequestContext) {
  return reporting.history(c.actor!, c.params.id);
}
export async function records(c: RequestContext) {
  return { data: await facts.records(c.actor!, c.params.id, c.params.kind) };
}
export async function addRecord(c: RequestContext) {
  return {
    data: await facts.addRecord(c.actor!, c.params.id, c.params.kind, c.input),
  };
}
export async function deleteRecord(c: RequestContext) {
  return {
    data: await facts.deleteRecord(
      c.actor!,
      c.params.id,
      c.params.kind,
      c.params.recordId,
    ),
  };
}
