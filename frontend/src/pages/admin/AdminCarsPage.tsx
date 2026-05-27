import { useEffect, useState } from "react";
import {
  createCar,
  deleteCar,
  fetchCars,
  updateCar,
} from "../../api/cars";
import Alert from "../../components/Alert";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { Car, CarInput } from "../../types/car";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";

const emptyForm: CarInput = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  pricePerDay: 50,
  isAvailable: true,
  imageName: "car1.jpg",
  description: "",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState<CarInput>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadCars = () => {
    setLoading(true);
    fetchCars()
      .then(setCars)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCars();
  }, []);

  const handleEdit = (car: Car) => {
    setEditingId(car.id);
    setForm({
      brand: car.brand,
      model: car.model,
      year: car.year,
      pricePerDay: car.pricePerDay,
      isAvailable: car.isAvailable,
      imageName: car.imageName,
      description: car.description,
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingId) {
        await updateCar(editingId, form);
      } else {
        await createCar(form);
      }
      handleCancel();
      loadCars();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити це авто?")) return;
    try {
      await deleteCar(id);
      loadCars();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Керування авто</h1>
          <p className="mt-2 text-slate-600">Додавання, редагування та видалення.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setForm(emptyForm);
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Додати авто
        </button>
      </div>

      <Alert message={error} />

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-2"
        >
          <h2 className="sm:col-span-2 text-lg font-bold">
            {editingId ? "Редагувати авто" : "Нове авто"}
          </h2>
          {(
            [
              ["brand", "Марка", "text"],
              ["model", "Модель", "text"],
              ["year", "Рік", "number"],
              ["pricePerDay", "Ціна/доба", "number"],
              ["imageName", "Файл зображення", "text"],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key}>
              <label className="mb-1 block text-sm font-medium">{label}</label>
              <input
                type={type}
                value={form[key] as string | number}
                onChange={(e) =>
                  setForm({
                    ...form,
                    [key]:
                      type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2"
                required
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Опис</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2"
              required
            />
          </div>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
            />
            Доступний для оренди
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Збереження..." : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Авто</th>
                <th className="px-4 py-3 font-semibold">Ціна</th>
                <th className="px-4 py-3 font-semibold">Статус</th>
                <th className="px-4 py-3 font-semibold">Фото</th>
                <th className="px-4 py-3 font-semibold">Дії</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">{car.id}</td>
                  <td className="px-4 py-3 font-medium">
                    {car.brand} {car.model} ({car.year})
                  </td>
                  <td className="px-4 py-3">{formatPrice(car.pricePerDay)}</td>
                  <td className="px-4 py-3">
                    {car.isAvailable ? "✓ Так" : "✗ Ні"}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{car.imageName}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(car)}
                      className="mr-2 text-blue-600 hover:underline"
                    >
                      Редагувати
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(car.id)}
                      className="text-red-600 hover:underline"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
