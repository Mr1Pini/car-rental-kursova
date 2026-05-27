export function parseRouteId(value: string, label = "id"): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid ${label}`);
  }
  return id;
}
