import type { RentalStatus } from "../types/rental";

export const RENTAL_STATUS_LABELS: Record<RentalStatus, string> = {
  PENDING: "Очікує",
  ACTIVE: "Активна",
  COMPLETED: "Завершена",
  CANCELLED: "Скасована",
};

export function getRentalStatusLabel(status: RentalStatus): string {
  return RENTAL_STATUS_LABELS[status];
}

export function isRentalStatus(value: string): value is RentalStatus {
  return value in RENTAL_STATUS_LABELS;
}
