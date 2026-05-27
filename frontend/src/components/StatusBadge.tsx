import type { RentalStatus } from "../types/rental";
import { getRentalStatusLabel } from "../utils/rentalStatus";

const config: Record<RentalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-slate-100 text-slate-600",
};

export default function StatusBadge({ status }: { status: RentalStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${config[status]}`}
    >
      {getRentalStatusLabel(status)}
    </span>
  );
}
