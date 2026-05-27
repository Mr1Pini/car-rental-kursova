import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/auth";
import Alert from "../components/Alert";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/errors";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token, user } = await registerRequest(name, email, password);
      login(token, user);
      navigate("/");
    } catch (err) {
      setError(getErrorMessage(err, "Не вдалося зареєструватися"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="panel p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Реєстрація
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-gray-300">
          Створіть акаунт клієнта для оренди автомобілів.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Alert message={error} />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Ім&apos;я
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

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
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-300">
              Пароль (мін. 6 символів)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="input-field"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? "Реєстрація..." : "Зареєструватися"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600 dark:text-gray-400">
          Вже є акаунт?{" "}
          <Link
            to="/login"
            className="font-medium text-slate-900 underline dark:text-white"
          >
            Увійти
          </Link>
        </p>
      </div>
    </div>
  );
}
