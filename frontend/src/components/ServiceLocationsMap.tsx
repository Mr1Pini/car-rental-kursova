const locations = [
  {
    id: "lviv-main",
    city: "Львів",
    name: "Головний офіс",
    address: "вул. Свободи, 15",
    lat: 49.8397,
    lng: 24.0297,
  },
  {
    id: "lviv-airport",
    city: "Львів",
    name: "Пункт видачі — аеропорт",
    address: "м. Львів, аеропорт ім. Данила Галицького",
    lat: 49.8125,
    lng: 23.9561,
  },
  {
    id: "kyiv",
    city: "Київ",
    name: "Офіс Київ",
    address: "вул. Хрещатик, 22",
    lat: 50.4501,
    lng: 30.5234,
  },
  {
    id: "iv-fr",
    city: "Івано-Франківськ",
    name: "Офіс Івано-Франківськ",
    address: "вул. Незалежності, 8",
    lat: 48.9226,
    lng: 24.7111,
  },
];

/** Карта України (західний регіон) — OpenStreetMap embed */
const MAP_EMBED =
  "https://www.openstreetmap.org/export/embed.html?bbox=22.5%2C48.5%2C31.5%2C51.0&layer=mapnik&marker=49.8397%2C24.0297&marker=49.8125%2C23.9561&marker=50.4501%2C30.5234&marker=48.9226%2C24.7111";

export default function ServiceLocationsMap() {
  return (
    <section className="panel overflow-hidden p-0">
      <div className="border-b border-slate-200 p-6 dark:border-gray-700">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Наші локації
        </h2>
        <p className="mt-2 text-slate-600 dark:text-gray-300">
          Офіси та пункти видачі автомобілів Car Rental на карті.
        </p>
      </div>

      <iframe
        title="Карта офісів Car Rental"
        src={MAP_EMBED}
        className="h-[380px] w-full border-0 grayscale-[20%] dark:grayscale-0 dark:opacity-90"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <ul className="grid gap-3 p-6 sm:grid-cols-2">
        {locations.map((loc) => (
          <li
            key={loc.id}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-gray-600 dark:bg-gray-900/40"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
              {loc.city}
            </p>
            <p className="mt-1 font-medium text-slate-900 dark:text-white">
              {loc.name}
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
              {loc.address}
            </p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${loc.lat}&mlon=${loc.lng}#map=15/${loc.lat}/${loc.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-slate-500 underline hover:text-slate-800 dark:text-gray-500 dark:hover:text-gray-300"
            >
              Відкрити на карті →
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
