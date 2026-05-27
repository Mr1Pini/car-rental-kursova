import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchCarById } from "../api/cars";
import { fetchReviewsByCar, createReview } from "../api/reviews";
import Alert from "../components/Alert";
import LoadingSpinner from "../components/LoadingSpinner";
import RentalModal from "../components/RentalModal";
import { useAuth } from "../context/AuthContext";
import type { Car } from "../types/car";
import type { Review } from "../types/review";
import { getCarImageUrl, handleImageError } from "../utils/carImage";
import { getErrorMessage } from "../utils/errors";
import { formatPrice, formatDate } from "../utils/format";
import { parseRouteId } from "../utils/parseId";

export default function CarDetailPage() {
  const { id: idParam } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);

  useEffect(() => {
    if (!idParam) {
      setError("Невірний ідентифікатор автомобіля");
      setLoading(false);
      return;
    }

    let carId: number;
    try {
      carId = parseRouteId(idParam);
    } catch {
      setError("Невірний ідентифікатор автомобіля");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    Promise.all([fetchCarById(carId), fetchReviewsByCar(carId)])
      .then(([carData, reviewsData]) => {
        setCar(carData);
        setReviews(reviewsData);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [idParam]);

  const handleRent = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setModalOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!car || !isAuthenticated) return;
    setReviewError("");
    setReviewLoading(true);
    try {
      const newReview = await createReview(car.id, rating, comment);
      setReviews((prev) => [newReview, ...prev]);
      setComment("");
      setRating(5);
    } catch (err) {
      setReviewError(getErrorMessage(err));
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error || !car) {
    return (
      <div className="text-center">
        <Alert message={error || "Автомобіль не знайдено"} />
        <Link to="/" className="mt-4 inline-block text-slate-900 underline">
          ← Назад до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
        ← Каталог
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <img
            src={getCarImageUrl(car.imageName)}
            alt={`${car.brand} ${car.model}`}
            onError={handleImageError}
            className="aspect-[16/10] w-full object-cover"
          />
        </div>

        <div>
          <p className="text-sm font-medium uppercase text-slate-500">
            {car.brand} · {car.year}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{car.model}</h1>
          <p className="mt-4 text-3xl font-bold text-emerald-600">
            {formatPrice(car.pricePerDay)}
            <span className="text-lg font-normal text-slate-500"> / доба</span>
          </p>
          <p
            className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
              car.isAvailable
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {car.isAvailable ? "Доступний" : "Недоступний"}
          </p>
          <p className="mt-6 leading-relaxed text-slate-700">{car.description}</p>
          <button
            type="button"
            onClick={handleRent}
            disabled={!car.isAvailable}
            className="mt-8 rounded-xl bg-slate-900 px-8 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Орендувати
          </button>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-slate-900">Відгуки ({reviews.length})</h2>

        {isAuthenticated ? (
          <form
            onSubmit={handleReviewSubmit}
            className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <Alert message={reviewError} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Оцінка</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n} ★
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium">Коментар</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={reviewLoading}
              className="mt-3 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {reviewLoading ? "Надсилання..." : "Залишити відгук"}
            </button>
          </form>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            <Link to="/login" className="font-medium underline">
              Увійдіть
            </Link>
            , щоб залишити відгук.
          </p>
        )}

        <div className="mt-6 space-y-4">
          {reviews.length === 0 ? (
            <p className="text-slate-500">Поки немає відгуків.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-900">{review.user.name}</p>
                  <span className="text-amber-500">{"★".repeat(review.rating)}</span>
                </div>
                <p className="mt-2 text-slate-700">{review.comment}</p>
                <p className="mt-2 text-xs text-slate-400">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      <RentalModal car={car} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
