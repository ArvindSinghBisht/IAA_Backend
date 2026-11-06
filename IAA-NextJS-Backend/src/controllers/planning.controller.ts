import type { RequestContext } from "@/http/handler";
import * as planning from "@/services/planning";
import * as calculations from "@/services/calculations";
import * as reporting from "@/services/reporting";
import {
  implementations,
  implementationDigest,
} from "@/services/planning-engines";
export async function estimateEnergy(c: RequestContext) {
  return { data: calculations.estimateEnergy(c.input) };
}
export async function engines(c: RequestContext) {
  return {
    data: implementations.map((implementation) => ({
      implementation,
      codeDigest: implementationDigest(implementation),
    })),
  };
}
export async function createAssessment(c: RequestContext) {
  return { data: await planning.createAssessment(c.input) };
}
export async function assessment(c: RequestContext) {
  return { data: await planning.getAssessment(c.params.id, c.planningToken) };
}
export async function saveScenario(c: RequestContext) {
  return {
    data: await planning.saveScenario(c.params.id, c.planningToken, c.input),
  };
}
export async function runScenario(c: RequestContext) {
  return {
    data: await planning.runScenario(c.params.id, c.planningToken, c.input),
  };
}
export async function runs(c: RequestContext) {
  return { data: await planning.getRuns(c.params.id, c.planningToken) };
}
export async function report(c: RequestContext) {
  return { data: await reporting.planningReport(c.params.id, c.planningToken) };
}
