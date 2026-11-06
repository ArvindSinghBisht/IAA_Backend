import type { RequestContext } from "@/http/handler";
import { readReferencePack } from "@/services/reference-pack";
import * as gis from "@/services/gis";
import * as publicData from "@/services/public-data";
import * as catalogue from "@/services/catalogue";
import * as files from "@/services/files";
import { ApiError } from "@/lib/http";
async function getDemoProject() {
  if (process.env.NODE_ENV !== "development")
    throw new ApiError(404, "NOT_FOUND", "API route not found");
  return publicData.demoProject();
}
export async function wp1_home(c: RequestContext) {
  return gis.home();
}
export async function wp1_search(c: RequestContext) {
  return gis.search(c.query);
}
export async function wp1_areas(c: RequestContext) {
  return publicData.areas(c.query);
}
export async function wp1_features(c: RequestContext) {
  return publicData.features(c.query);
}
export async function wp1_nearby(c: RequestContext) {
  return publicData.nearby(c.query);
}
export async function wp1_projects(c: RequestContext) {
  return publicData.projects(c.query);
}
export async function wp1_projects_id(c: RequestContext) {
  return gis.publicProfile(c.params.id);
}
export async function wp1_datasets(c: RequestContext) {
  return publicData.datasets();
}
export async function wp1_datasets_id(c: RequestContext) {
  return catalogue.datasetDetail(c.params.id);
}
export async function wp1_districts_id(c: RequestContext) {
  return catalogue.district(c.params.id, c.query);
}
export async function wp1_districts_id_domain(c: RequestContext) {
  return gis.districtDomain(c.params.id, c.params.domain, c.query);
}
export async function wp1_layers(c: RequestContext) {
  return gis.layers();
}
export async function wp1_layers_id_features(c: RequestContext) {
  return gis.layerFeatures(c.params.id, c.query);
}
export async function wp1_areas_id_boundary(c: RequestContext) {
  return gis.boundary(c.params.id);
}
export async function wp1_files_id(c: RequestContext) {
  return files.publicDownload(c.params.id);
}
export async function wp1_exports_id_resource(c: RequestContext) {
  return gis.exportDataset(c.params.id, c.params.resource, c.query);
}
export async function reference_kind(c: RequestContext) {
  return catalogue.masters(c.params.kind);
}
export async function resources(c: RequestContext) {
  return catalogue.catalogue("resources", c.query);
}
export async function policies(c: RequestContext) {
  return catalogue.catalogue("policies", c.query);
}
export async function demoProject(c: RequestContext) {
  return getDemoProject();
}
export async function referenceLayer(c: RequestContext) {
  return readReferencePack("layer");
}
export async function referenceIndex(c: RequestContext) {
  return readReferencePack("index");
}
export async function compare(c: RequestContext) {
  return gis.compare(c.input);
}
