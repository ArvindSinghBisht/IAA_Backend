import type { RequestContext } from "@/http/handler";
import * as resources from "@/services/resources";
import * as adminUsers from "@/services/administration";
import * as governance from "@/services/admin-workflow";
import * as imports from "@/services/imports";
import { admin } from "@/lib/governance";
function getResourceDefinitions(c: RequestContext) {
  admin(c.actor!);
  return { data: resources.resources };
}
export async function me(c: RequestContext) {
  return { data: c.actor };
}
export async function resourceDefinitions(c: RequestContext) {
  return getResourceDefinitions(c);
}
export async function listResources(c: RequestContext) {
  return resources.resourceList(c.actor!, c.params.resource, c.query);
}
export async function createResource(c: RequestContext) {
  return {
    data: await resources.resourceWrite(c.actor!, c.params.resource, c.input),
  };
}
export async function updateResource(c: RequestContext) {
  return {
    data: await resources.resourceWrite(
      c.actor!,
      c.params.resource,
      c.input,
      c.params.id,
    ),
  };
}
export async function deleteResource(c: RequestContext) {
  return {
    data: await resources.resourceWrite(
      c.actor!,
      c.params.resource,
      {},
      c.params.id,
      true,
    ),
  };
}
export async function users(c: RequestContext) {
  return adminUsers.users(c.actor!);
}
export async function provision(c: RequestContext) {
  return { data: await adminUsers.provision(c.actor!, c.input) };
}
export async function deactivate(c: RequestContext) {
  return { data: await adminUsers.deactivate(c.actor!, c.params.id) };
}
export async function membership(c: RequestContext) {
  return { data: await adminUsers.membership(c.actor!, c.params.id, c.input) };
}
export async function audit(c: RequestContext) {
  return governance.auditLog(c.actor!);
}
export async function reminders(c: RequestContext) {
  return { data: await adminUsers.reminders(c.actor!) };
}
export async function datasetTransition(c: RequestContext) {
  return {
    data: await governance.datasetTransition(c.actor!, c.params.id, c.input),
  };
}
export async function definitionApproval(c: RequestContext) {
  return {
    data: await governance.approveDefinition(
      c.actor!,
      c.params.kind,
      c.params.id,
      c.input,
    ),
  };
}
export async function importFile(c: RequestContext) {
  return { data: await imports.runImport(c.actor!, c.input) };
}
export async function importRows(c: RequestContext) {
  return imports.importRows(c.actor!, c.params.id, c.query);
}
export async function resolveIssue(c: RequestContext) {
  return { data: await imports.resolveIssue(c.actor!, c.params.id, c.input) };
}
