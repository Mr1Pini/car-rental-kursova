import { Link, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-slate-900 text-white dark:bg-white dark:text-gray-900"
      : "text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
  }`;

const footerLinkClass =
  "text-slate-500 transition hover:text-slate-900 dark:text-gray-400 dark:hover:text-white";

const roleLabels = {
  USER: "Клієнт",
  ADMIN: "Адміністратор",
} as const;

export default function Layout() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col dark:bg-gray-900">
      <header className="border-b border-slate-200 bg-white shadow-sm print:hidden dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white dark:bg-emerald-600">
              CR
            </span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              Car Rental
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Каталог
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              Про нас
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  Профіль
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className={navLinkClass}>
                    Адмін-панель
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Увійти
                </NavLink>
                <NavLink
                  to="/register"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  Реєстрація
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isAuthenticated && user && (
              <>
                <div className="hidden text-right text-sm sm:block">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-slate-500 dark:text-gray-400">
                    {roleLabels[user.role]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Вийти
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 print:hidden dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <p className="text-sm text-slate-500 dark:text-gray-400">
            © {new Date().getFullYear()} Car Rental — система прокату
            автомобілів
          </p>
          <nav className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/about" className={footerLinkClass}>
              Про нас
            </Link>
            <Link to="/terms" className={footerLinkClass}>
              Умови оренди
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
