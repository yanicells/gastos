"use server";

import {
  getYearlySummary,
  getMonthlyTrend,
  getCategoryBreakdown,
  getTopCategories,
  getComparisonData,
  getCurrentMonthStats,
  getRollingAverages,
} from "@/lib/queries/analytics";

/**
 * Server action to fetch yearly summary data.
 */
export async function fetchYearlySummary(year: number) {
  return getYearlySummary(year);
}

/**
 * Server action to fetch monthly trend data.
 */
export async function fetchMonthlyTrend(year: number) {
  return getMonthlyTrend(year);
}

/**
 * Server action to fetch category breakdown.
 */
export async function fetchCategoryBreakdown(
  startDate?: string,
  endDate?: string,
  category?: "expense" | "income"
) {
  return getCategoryBreakdown(startDate, endDate, category);
}

/**
 * Server action to fetch top categories.
 */
export async function fetchTopCategories(
  limit?: number,
  startDate?: string,
  endDate?: string
) {
  return getTopCategories(limit, startDate, endDate);
}

/**
 * Server action to fetch comparison data.
 */
export async function fetchComparisonData(year: number, month: number) {
  return getComparisonData(year, month);
}

/**
 * Server action to fetch current month stats.
 */
export async function fetchCurrentMonthStats() {
  return getCurrentMonthStats();
}

/**
 * Server action to fetch rolling averages.
 */
export async function fetchRollingAverages(year?: number) {
  return getRollingAverages(year);
}
