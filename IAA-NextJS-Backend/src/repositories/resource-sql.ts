import definitions from "@/generated/resources.json";
export function identifier(name: string) {
  if (!/^[a-z_][a-z0-9_]*$/.test(name))
    throw new Error("Invalid internal SQL identifier");
  return '"' + name + '"';
}
export function selectColumns(key: string, alias = "t") {
  if (!Object.hasOwn(definitions, key))
    throw new Error("Unknown internal resource");
  identifier(alias);
  const def = definitions[key as keyof typeof definitions];
  return Object.entries(def.columns)
    .map(([name, column]) =>
      column.type.startsWith("geometry")
        ? `ST_AsGeoJSON(${alias}.${identifier(name)})::jsonb AS ${identifier(name)}`
        : `${alias}.${identifier(name)}`,
    )
    .join(",");
}
export function insertExpressions(key: string, columns: string[]) {
  const def = definitions[key as keyof typeof definitions];
  if (!def) throw new Error("Unknown internal resource");
  return columns.map((name, index) => {
    const column = (def.columns as Record<string, { type: string }>)[name];
    if (!column) throw new Error("Unknown internal column");
    return column.type.startsWith("geometry")
      ? `ST_SetSRID(ST_GeomFromGeoJSON($${index + 1}),4326)`
      : `$${index + 1}`;
  });
}
export function updateAssignments(key: string, names: string[]) {
  const expressions = insertExpressions(key, names);
  return names.map(
    (name, i) =>
      `${identifier(name)}=${expressions[i].replace(/\$(\d+)/g, (_, n) => "$" + (Number(n) + 1))}`,
  );
}
