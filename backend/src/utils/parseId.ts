import { AppError } from "../middleware/errorHandler";

export function parseId(value: string, label = "id"): number {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, `Invalid ${label}`);
  }
  return id;
}
