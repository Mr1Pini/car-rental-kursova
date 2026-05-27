import { useEffect, useState } from "react";
import { fetchAllRentals, updateRentalStatus } from "../../api/rentals";
import Alert from "../../components/Alert";
import LoadingSpinner from "../../components/LoadingSpinner";
import StatusBadge from "../../components/StatusBadge";
import type { Rental, RentalStatus } from "../../types/rental";
import { getErrorMessage } from "../../utils/errors";
import { formatDate, formatPrice } from "../../utils/format";
import {
  getRentalStatusLabel,
  isRentalStatus,
  RENTAL_STATUS_LABELS,
} from "../../utils/rentalStatus";

const statuses: RentalStatus[] = [
  "PENDING",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminRentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRentals = () => {
    setLoading(true);
    setError("");
    fetchAllRentals()
      .then(setRentals)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const handleStatusChange = async (id: number, value: string) => {
    if (!isRentalStatus(value)) {
      setError("Невірний статус оренди");
      return;
    }
    setError("");
    try {
      const updated = await updateRentalStatus(id, value);
      setRentals((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handlePrint = () => {
    if (rentals.length === 0) {
      setError("Немає даних для формування звіту");
      return;
    }
    window.print();
  };

  const totalRevenue = rentals.reduce((sum, r) => sum + r.totalPrice, 0);
  const reportDate = new Date().toLocaleString("uk-UA", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div>
      {/* Заголовок звіту — лише при друку */}
      <div className="mb-6 hidden print:block">
        <h1 className="text-center text-2xl font-bold text-slate-900">
          Звіт про оренду автомобілів
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600">
          Дата формування: {reportDate}
        </p>
        <p className="mt-1 text-center text-sm text-slate-600">
          Усього записів: {rentals.length}
        </p>
      </div>

      <div className="print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Керування орендами
            </h1>
            <p className="mt-2 text-slate-600">
              Список усіх замовлень. Змінюйте статус за потреби.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            disabled={loading || rentals.length === 0}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Сформувати та роздрукувати звіт
          </button>
        </div>

        <Alert message={error} />
      </div>

      {loading ? (
        <div className="print:hidden">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm print:mt-0 print:overflow-visible print:rounded-none print:border print:border-slate-400 print:shadow-none">
            <table className="w-full min-w-[800px] text-left text-sm print:min-w-0">
              <thead className="border-b border-slate-200 bg-slate-50 print:bg-white">
                <tr>
                  <th className="px-4 py-3 font-semibold">#</th>
                  <th className="px-4 py-3 font-semibold">Клієнт</th>
                  <th className="px-4 py-3 font-semibold">Авто</th>
                  <th className="px-4 py-3 font-semibold">Період</th>
                  <th className="px-4 py-3 font-semibold">Сума</th>
                  <th className="px-4 py-3 font-semibold">Статус</th>
                  <th className="px-4 py-3 font-semibold print:hidden">
                    Змінити
                  </th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-b border-slate-100 print:break-inside-avoid"
                  >
                    <td className="px-4 py-3">{rental.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{rental.user.name}</p>
                      <p className="text-xs text-slate-500 print:text-slate-700">
                        {rental.user.email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {rental.car.brand} {rental.car.model}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(rental.startDate)} —{" "}
                      {formatDate(rental.endDate)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-emerald-600 print:text-slate-900">
                      {formatPrice(rental.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="hidden print:inline">
                        {getRentalStatusLabel(rental.status)}
                      </span>
                      <span className="print:hidden">
                        <StatusBadge status={rental.status} />
                      </span>
                    </td>
                    <td className="px-4 py-3 print:hidden">
                      <select
                        value={rental.status}
                        onChange={(e) =>
                          handleStatusChange(rental.id, e.target.value)
                        }
                        className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                        aria-label={`Статус оренди #${rental.id}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {RENTAL_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
              {rentals.length > 0 && (
                <tfoot className="hidden border-t-2 border-slate-300 print:table-footer-group">
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-3 text-right font-semibold"
                    >
                      Загальна сума:
                    </td>
                    <td className="px-4 py-3 font-bold">
                      {formatPrice(totalRevenue)}
                    </td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              )}
            </table>
            {rentals.length === 0 && (
              <p className="p-8 text-center text-slate-500 print:hidden">
                Оренд поки немає.
              </p>
            )}
          </div>

        </>
      )}
    </div>
  );
}
