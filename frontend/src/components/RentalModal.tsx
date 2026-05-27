import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRental } from "../api/rentals";
import type { Car } from "../types/car";
import { getErrorMessage } from "../utils/errors";
import { formatPrice } from "../utils/format";
import { calculateRentalDays, calculateTotalPrice } from "../utils/rentalPrice";
import Alert from "./Alert";
import Modal from "./Modal";

interface RentalModalProps {
  car: Car;
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalModal({ car, isOpen, onClose }: RentalModalProps) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const days = calculateRentalDays(startDate, endDate);
  const totalPrice = calculateTotalPrice(car.pricePerDay, startDate, endDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!startDate || !endDate || totalPrice === null) {
      setError("Оберіть коректний діапазон дат");
      return;
    }

    setLoading(true);
    try {
      await createRental(car.id, startDate, endDate);
      setSuccess("Замовлення створено! Перенаправляємо до профілю...");
      setTimeout(() => {
        onClose();
        navigate("/profile");
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStartDate("");
    setEndDate("");
    setError("");
    setSuccess("");
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <Modal
      title={`Оренда: ${car.brand} ${car.model}`}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Alert message={error} />
        <Alert type="success" message={success} />

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Дата початку
          </label>
          <input
            type="date"
            min={today}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Дата закінчення
          </label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            required
          />
        </div>

        <div className="rounded-lg bg-slate-50 p-4 text-sm">
          <p className="text-slate-600">
            Ціна за добу:{" "}
            <span className="font-semibold text-slate-900">
              {formatPrice(car.pricePerDay)}
            </span>
          </p>
          {days !== null && totalPrice !== null && (
            <>
              <p className="mt-1 text-slate-600">
                Кількість днів:{" "}
                <span className="font-semibold text-slate-900">{days}</span>
              </p>
              <p className="mt-2 text-lg font-bold text-emerald-600">
                Разом: {formatPrice(totalPrice)}
              </p>
            </>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !car.isAvailable}
          className="w-full rounded-lg bg-slate-900 py-2.5 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Оформлення..." : "Підтвердити замовлення"}
        </button>
      </form>
    </Modal>
  );
}
