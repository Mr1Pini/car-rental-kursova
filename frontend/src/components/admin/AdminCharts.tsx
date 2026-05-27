import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartTheme } from "../../hooks/useChartTheme";
import type { AdminAnalytics } from "../../types/admin";

interface AdminChartsProps {
  analytics: AdminAnalytics;
}

function ChartTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  formatter: (v: number) => string;
}) {
  const theme = useChartTheme();
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg border px-3 py-2 text-sm shadow-lg"
      style={{
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        color: theme.tooltipText,
      }}
    >
      <p className="font-medium">{label}</p>
      <p className="mt-1 text-emerald-600 dark:text-emerald-400">
        {formatter(payload[0].value)}
      </p>
    </div>
  );
}

export default function AdminCharts({ analytics }: AdminChartsProps) {
  const theme = useChartTheme();

  const formatMoney = (v: number) =>
    new Intl.NumberFormat("uk-UA", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(v);

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="panel p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Доходи за останні місяці
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Сума завершених оренд (COMPLETED)
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
              <XAxis
                dataKey="label"
                tick={{ fill: theme.axis, fontSize: 11 }}
                tickLine={{ stroke: theme.grid }}
                axisLine={{ stroke: theme.grid }}
              />
              <YAxis
                tick={{ fill: theme.axis, fontSize: 11 }}
                tickLine={{ stroke: theme.grid }}
                axisLine={{ stroke: theme.grid }}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={formatMoney}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={theme.primary}
                strokeWidth={2}
                dot={{ fill: theme.primary, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Найпопулярніші автомобілі
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
          Топ-5 за кількістю оренд
        </p>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.topCars} layout="vertical" margin={{ left: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fill: theme.axis, fontSize: 11 }}
                tickLine={{ stroke: theme.grid }}
                axisLine={{ stroke: theme.grid }}
              />
              <YAxis
                type="category"
                dataKey="label"
                width={110}
                tick={{ fill: theme.axis, fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: theme.grid }}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(v) => `${v} оренд`}
                  />
                }
              />
              <Bar
                dataKey="rentalCount"
                fill={theme.bar}
                radius={[0, 6, 6, 0]}
                name="Оренди"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
