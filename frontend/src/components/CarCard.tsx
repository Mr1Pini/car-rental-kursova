import { Link } from "react-router-dom";
import type { Car } from "../types/car";
import { formatPrice } from "../utils/format";
import { getCarImageUrl, handleImageError } from "../utils/carImage";

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <Link
      to={`/car/${car.id}`}
      className="panel group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-900/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-gray-700">
        <img
          src={getCarImageUrl(car.imageName)}
          alt={`${car.brand} ${car.model}`}
          onError={handleImageError}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        {!car.isAvailable && (
          <span className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
            Зайнято
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-gray-400">
          {car.brand} · {car.year}
        </p>
        <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
          {car.model}
        </h3>
        <p className="mt-2 text-xl font-semibold text-emerald-600 dark:text-emerald-400">
          {formatPrice(car.pricePerDay)}
          <span className="text-sm font-normal text-slate-500 dark:text-gray-400">
            {" "}
            / доба
          </span>
        </p>
      </div>
    </Link>
  );
}
