import { Link } from "react-router-dom";
import ServiceLocationsMap from "../components/ServiceLocationsMap";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="panel p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Про нас
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-gray-300">
          <strong className="text-slate-900 dark:text-white">Car Rental</strong> —
          сучасний сервіс прокату автомобілів у місті. Ми допомагаємо
          мандрівникам, бізнес-клієнтам та родинам швидко знайти надійне авто
          на будь-який термін — від одного дня до кількох тижнів.
        </p>
        <p className="mt-4 leading-relaxed text-slate-600 dark:text-gray-300">
          Наш автопарк регулярно оновлюється: економ-клас для міста, кросовери
          для подорожей та преміум-седани для ділових поїздок. Усі автомобілі
          проходять технічний огляд, мають страховку та підтримуються в ідеальному
          стані.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Прозорі ціни",
            text: "Вартість оренди розраховується автоматично за кількістю днів — без прихованих платежів.",
          },
          {
            title: "Швидке оформлення",
            text: "Забронюйте авто онлайн за кілька хвилин і отримайте підтвердження в особистому кабінеті.",
          },
          {
            title: "Підтримка 24/7",
            text: "Наша команда завжди на зв'язку, якщо виникнуть питання під час оренди.",
          },
        ].map((item) => (
          <div key={item.title} className="panel p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {item.title}
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-gray-400">
              {item.text}
            </p>
          </div>
        ))}
      </section>

      <ServiceLocationsMap />

      <section className="panel p-8">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Контакти
        </h2>
        <ul className="mt-4 space-y-3 text-slate-600 dark:text-gray-300">
          <li>
            <span className="font-medium text-slate-900 dark:text-white">
              Адреса:
            </span>{" "}
            м. Львів, вул. Свободи, 15
          </li>
          <li>
            <span className="font-medium text-slate-900 dark:text-white">
              Телефон:
            </span>{" "}
            <a
              href="tel:+380671234567"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              +38 (067) 123-45-67
            </a>
          </li>
          <li>
            <span className="font-medium text-slate-900 dark:text-white">
              Email:
            </span>{" "}
            <a
              href="mailto:info@carrental.ua"
              className="text-emerald-600 hover:underline dark:text-emerald-400"
            >
              info@carrental.ua
            </a>
          </li>
          <li>
            <span className="font-medium text-slate-900 dark:text-white">
              Графік:
            </span>{" "}
            Пн–Нд, 08:00 – 22:00
          </li>
        </ul>
        <p className="mt-6 text-sm text-slate-500 dark:text-gray-500">
          Детальні правила оренди дивіться на сторінці{" "}
          <Link
            to="/terms"
            className="font-medium text-slate-900 underline dark:text-white"
          >
            Умови оренди
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
