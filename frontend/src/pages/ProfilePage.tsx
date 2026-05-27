import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyRentals } from "../api/rentals";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";
import type { Rental } from "../types/rental";
import { getCarImageUrl, handleImageError } from "../utils/carImage";
import { getErrorMessage } from "../utils/errors";
import { formatDate, formatPrice } from "../utils/format";

export default function ProfilePage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyRentals()
      .then(setRentals)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">Мій профіль</h1>
      <p className="mt-2 text-slate-600">Історія ваших оренд та їхні статуси.</p>

      <Alert message={error} />

      {rentals.length === 0 && !error ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-600">У вас ще немає оренд.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Переглянути каталог
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
            >
              <img
                src={getCarImageUrl(rental.car.imageName)}
                alt=""
                onError={handleImageError}
                className="h-24 w-36 rounded-lg object-cover"
              />
              <div className="flex-1">
                <Link
                  to={`/car/${rental.car.id}`}
                  className="text-lg font-bold text-slate-900 hover:underline"
                >
                  {rental.car.brand} {rental.car.model}
                </Link>
                <p className="mt-1 text-sm text-slate-600">
                  {formatDate(rental.startDate)} — {formatDate(rental.endDate)}
                </p>
                <p className="mt-1 font-semibold text-emerald-600">
                  {formatPrice(rental.totalPrice)}
                </p>
              </div>
              <StatusBadge status={rental.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
