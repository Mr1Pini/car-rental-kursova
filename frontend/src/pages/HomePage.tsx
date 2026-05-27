import { useCallback, useEffect, useState } from "react";
import { fetchCars } from "../api/cars";
import CarCard from "../components/CarCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";
import { CAR_SORT_OPTIONS, type Car, type CarSortBy } from "../types/car";
import { getErrorMessage } from "../utils/errors";

export default function HomePage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<CarSortBy>("price_asc");

  const loadCars = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCars({
        brand: brand || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        isAvailable: onlyAvailable ? true : undefined,
        sortBy,
      });
      setCars(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [brand, minPrice, maxPrice, onlyAvailable, sortBy]);

  useEffect(() => {
    const timer = setTimeout(loadCars, 300);
    return () => clearTimeout(timer);
  }, [loadCars]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Каталог автомобілів
        </h1>
        <p className="mt-2 text-slate-600 dark:text-gray-300">
          Оберіть авто для оренди. Використовуйте фільтри для пошуку.
        </p>
      </div>

      <div className="panel mb-8 grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">
            Марка
          </label>
          <input
            type="text"
            placeholder="Toyota, BMW..."
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">
            Ціна від ($)
          </label>
          <input
            type="number"
            min={0}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">
            Ціна до ($)
          </label>
          <input
            type="number"
            min={0}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="input-field text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600 dark:text-gray-400">
            Сортування
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as CarSortBy)}
            className="input-field text-sm"
          >
            {CAR_SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded border-slate-300 dark:border-gray-600"
            />
            Тільки доступні
          </label>
        </div>
      </div>

      <Alert message={error} />

      {loading ? (
        <LoadingSpinner />
      ) : cars.length === 0 ? (
        <p className="py-16 text-center text-slate-500 dark:text-gray-400">
          Автомобілів не знайдено. Спробуйте змінити фільтри.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
