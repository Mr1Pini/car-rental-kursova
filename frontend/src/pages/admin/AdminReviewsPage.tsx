import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteReviewAdmin, fetchAllReviewsAdmin } from "../../api/reviews";
import Alert from "../../components/Alert";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { AdminReview } from "../../types/review";
import { getErrorMessage } from "../../utils/errors";
import { formatDate } from "../../utils/format";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = () => {
    setLoading(true);
    setError("");
    fetchAllReviewsAdmin()
      .then(setReviews)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цей відгук?")) return;
    setError("");
    try {
      await deleteReviewAdmin(id);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Відгуки
      </h1>
      <p className="mt-2 text-slate-600 dark:text-gray-300">
        Усі відгуки на сайті. Видаляйте недоречні коментарі.
      </p>

      <Alert message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : reviews.length === 0 ? (
        <p className="panel mt-8 p-8 text-center text-slate-500 dark:text-gray-400">
          Відгуків поки немає.
        </p>
      ) : (
        <div className="mt-8 space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="panel p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {review.user.name}
                    </span>
                    <span className="text-amber-500">
                      {"★".repeat(review.rating)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-gray-500">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
                    Авто:{" "}
                    <Link
                      to={`/car/${review.car.id}`}
                      className="font-medium text-slate-900 underline dark:text-white"
                    >
                      {review.car.brand} {review.car.model}
                    </Link>
                  </p>
                  <p className="mt-3 leading-relaxed text-slate-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(review.id)}
                  className="shrink-0 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
