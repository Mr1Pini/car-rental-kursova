import { useEffect, useState } from "react";
import { deleteUser, fetchAllUsers, updateUser } from "../../api/users";
import Alert from "../../components/Alert";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { AdminUser, UserUpdateInput } from "../../types/user";
import type { UserRole } from "../../types/auth";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errors";

const roleLabels: Record<UserRole, string> = {
  USER: "Клієнт",
  ADMIN: "Адміністратор",
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [form, setForm] = useState<UserUpdateInput>({});
  const [saving, setSaving] = useState(false);

  const loadUsers = () => {
    setLoading(true);
    setError("");
    fetchAllUsers()
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user: AdminUser) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setForm({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setSaving(true);
    setError("");
    try {
      const payload: UserUpdateInput = {
        name: form.name,
        email: form.email,
        role: form.role,
      };
      if (form.password?.trim()) {
        payload.password = form.password;
      }
      await updateUser(editingUser.id, payload);
      closeEdit();
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Видалити цього користувача? Усі його оренди та відгуки також будуть видалені.")) {
      return;
    }
    setError("");
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        Користувачі
      </h1>
      <p className="mt-2 text-slate-600 dark:text-gray-300">
        Перегляд, редагування та видалення облікових записів.
      </p>

      <Alert message={error} />

      {editingUser && (
        <form
          onSubmit={handleSave}
          className="panel mt-6 grid gap-4 p-6 sm:grid-cols-2"
        >
          <h2 className="sm:col-span-2 text-lg font-bold text-slate-900 dark:text-white">
            Редагувати: {editingUser.name}
          </h2>
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
              Ім&apos;я
            </label>
            <input
              type="text"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
              Роль
            </label>
            <select
              value={form.role ?? "USER"}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value as UserRole })
              }
              className="input-field"
            >
              <option value="USER">Клієнт</option>
              <option value="ADMIN">Адміністратор</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-300">
              Новий пароль (необов&apos;язково)
            </label>
            <input
              type="password"
              value={form.password ?? ""}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="input-field"
              minLength={6}
              placeholder="Залиште порожнім, щоб не змінювати"
            />
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={saving} className="btn-primary px-4">
              {saving ? "Збереження..." : "Зберегти"}
            </button>
            <button
              type="button"
              onClick={closeEdit}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-gray-600 dark:text-gray-200"
            >
              Скасувати
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="panel mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 dark:border-gray-700 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 font-semibold dark:text-gray-200">ID</th>
                <th className="px-4 py-3 font-semibold dark:text-gray-200">Ім&apos;я</th>
                <th className="px-4 py-3 font-semibold dark:text-gray-200">Email</th>
                <th className="px-4 py-3 font-semibold dark:text-gray-200">Роль</th>
                <th className="px-4 py-3 font-semibold dark:text-gray-200">Дії</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 dark:border-gray-700"
                >
                  <td className="px-4 py-3 dark:text-gray-300">{user.id}</td>
                  <td className="px-4 py-3 font-medium dark:text-white">
                    {user.name}
                    {user.id === currentUser?.id && (
                      <span className="ml-2 text-xs text-slate-500">(ви)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 dark:text-gray-300">{user.email}</td>
                  <td className="px-4 py-3 dark:text-gray-300">
                    {roleLabels[user.role]}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openEdit(user)}
                      className="mr-3 text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Редагувати дані
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(user.id)}
                      disabled={user.id === currentUser?.id}
                      className="text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400"
                      title={
                        user.id === currentUser?.id
                          ? "Не можна видалити власний акаунт"
                          : undefined
                      }
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="p-8 text-center text-slate-500 dark:text-gray-400">
              Користувачів не знайдено.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
