export const VALID_DASHBOARD_RANGES = [
  "7d",
  "14d",
  "30d",
  "60d",
  "120d",
  "180d",
  "1yr",
] as const;

export type DashboardRange = (typeof VALID_DASHBOARD_RANGES)[number];

export function normalizeDashboardRange(rawRange?: string | null): DashboardRange {
  if (!rawRange) return "30d";
  if (rawRange === "daily" || rawRange === "weekly") return "7d";
  if (rawRange === "monthly") return "30d";
  if (rawRange === "yearly") return "1yr";
  if (VALID_DASHBOARD_RANGES.includes(rawRange as DashboardRange)) {
    return rawRange as DashboardRange;
  }
  return "30d";
}

export function formatRangeLabel(range?: string | null): string {
  const normalized = normalizeDashboardRange(range);
  switch (normalized) {
    case "7d":
      return "7 Days";
    case "14d":
      return "14 Days";
    case "30d":
      return "30 Days";
    case "60d":
      return "60 Days";
    case "120d":
      return "120 Days";
    case "180d":
      return "180 Days";
    case "1yr":
      return "12 Months";
    default:
      return "30 Days";
  }
}
