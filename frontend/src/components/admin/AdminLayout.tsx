import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle";

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-slate-900 text-white dark:bg-emerald-600 dark:text-white"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
  }`;

const adminNav: {
  to: string;
  end?: boolean;
  label: string;
  icon: string;
}[] = [
  { to: "/admin", end: true, label: "Дашборд", icon: "📊" },
  { to: "/admin/cars", label: "Автомобілі", icon: "🚗" },
  { to: "/admin/rentals", label: "Оренди", icon: "📋" },
  { to: "/admin/users", label: "Користувачі", icon: "👥" },
  { to: "/admin/reviews", label: "Відгуки", icon: "💬" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-gray-900">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white print:hidden dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-slate-200 p-5 dark:border-gray-700">
          <Link to="/admin" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white dark:bg-emerald-600">
              CR
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Car Rental</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Панель адміна
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {adminNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={sidebarLinkClass}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-gray-700">
          <Link
            to="/"
            className="mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            ← На сайт (каталог)
          </Link>

          {user && (
            <div className="mb-3 rounded-lg bg-slate-50 px-3 py-2 dark:bg-gray-900/50">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                Адміністратор
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={logout}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Вийти
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-64 flex min-h-screen min-w-0 flex-1 flex-col">
        <main className="flex-1 p-6 lg:p-8 print:ml-0 print:p-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
