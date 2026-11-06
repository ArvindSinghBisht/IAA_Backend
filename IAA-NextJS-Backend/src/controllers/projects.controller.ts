import type { RequestContext } from "@/http/handler";
import * as profiles from "@/services/project-editor";
import * as project from "@/services/project-workflow";
import * as system from "@/services/system";
export async function projects(c: RequestContext) {
  return profiles.myProjects(c.actor!);
}
export async function createProject(c: RequestContext) {
  return { data: await profiles.createProject(c.actor!, c.input) };
}
export async function versions(c: RequestContext) {
  return system.projectVersions(c.actor!, c.params.id);
}
export async function profile(c: RequestContext) {
  return { data: await profiles.getProfile(c.actor!, c.params.id) };
}
export async function updateProfile(c: RequestContext) {
  return { data: await project.updateProfile(c.actor!, c.params.id, c.input) };
}
export async function note(c: RequestContext) {
  return { data: await profiles.saveNote(c.actor!, c.params.id, c.input) };
}
export async function transition(c: RequestContext) {
  return {
    data: await project.profileTransition(c.actor!, c.params.id, c.input),
  };
}
export async function revise(c: RequestContext) {
  return { data: await project.reviseProfile(c.actor!, c.params.id, c.input) };
}
