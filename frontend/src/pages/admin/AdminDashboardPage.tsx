import { useEffect, useState } from "react";
import { fetchAdminAnalytics, fetchAdminStats } from "../../api/admin";
import AdminCharts from "../../components/admin/AdminCharts";
import Alert from "../../components/Alert";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { AdminAnalytics, AdminStats } from "../../types/admin";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    Promise.all([fetchAdminStats(), fetchAdminAnalytics()])
      .then(([statsData, analyticsData]) => {
        setStats(statsData);
        setAnalytics(analyticsData);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Завантаження аналітики..." />;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Панель адміністратора
      </h1>
      <p className="mt-2 text-slate-600 dark:text-gray-300">
        Основні показники та візуалізація даних системи прокату.
      </p>

      <Alert message={error} />

      {stats && (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="panel p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
              Клієнтів
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
              {stats.totalClients}
            </p>
          </div>
          <div className="panel p-6">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
              Автомобілів
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">
              {stats.totalCars}
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white shadow-sm dark:border-emerald-800">
            <p className="text-sm font-medium text-emerald-100">Загальний дохід</p>
            <p className="mt-2 text-4xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </p>
            <p className="mt-1 text-xs text-emerald-100">
              Активні та завершені оренди
            </p>
          </div>
        </div>
      )}

      {analytics && <AdminCharts analytics={analytics} />}
    </div>
  );
}
