import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "../api/auth";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await loginRequest(email, password);
      login(token, user);
      navigate(user.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося увійти"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="panel p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Вхід
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
          Увійдіть, щоб орендувати авто та переглядати історію замовлень.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Alert message={error} />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Вхід..." : "Увійти"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
          Немає акаунта?{" "}
          <Link
            to="/register"
            className="font-medium text-slate-900 underline dark:text-white"
          >
            Зареєструватися
          </Link>
        </p>
      </div>
    </div>
  );
}
