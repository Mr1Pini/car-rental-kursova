import { useMemo } from "react";
import { useTheme } from "../context/ThemeContext";

export function useChartTheme() {
  const { isDark } = useTheme();

  return useMemo(
    () => ({
      grid: isDark ? "#374151" : "#e2e8f0",
      axis: isDark ? "#9ca3af" : "#64748b",
      primary: isDark ? "#34d399" : "#059669",
      primaryFill: isDark ? "rgba(52, 211, 153, 0.25)" : "rgba(5, 150, 105, 0.2)",
      bar: isDark ? "#10b981" : "#047857",
      tooltipBg: isDark ? "#1f2937" : "#ffffff",
      tooltipBorder: isDark ? "#4b5563" : "#e2e8f0",
      tooltipText: isDark ? "#f3f4f6" : "#0f172a",
    }),
    [isDark],
  );
}
