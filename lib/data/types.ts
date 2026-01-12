/**
 * Transaction type definitions for the personal finance tracker.
 * These are static config - adding new types requires a code change.
 */

export const transactionTypes = {
  // =====================
  // Expenses
  // =====================
  school: {
    label: "School",
    category: "expense",
    group: "school",
    icon: "GraduationCap",
    color: "#ef4444",
  },
  groceries: {
    label: "Groceries & Food",
    category: "expense",
    group: "groceries and food",
    icon: "ShoppingCart",
    color: "#f97316",
  },

  personal: {
    label: "Personal",
    category: "expense",
    group: "personal",
    icon: "User",
    color: "#8b5cf6",
  },
  general: {
    label: "General",
    category: "expense",
    group: "general",
    icon: "Package",
    color: "#6b7280",
  },
  other_expense: {
    label: "Other",
    category: "expense",
    group: "other",
    icon: "MoreHorizontal",
    color: "#6b7280",
  },

  // =====================
  // Income
  // =====================
  allowance: {
    label: "Allowance",
    category: "income",
    group: "allowance",
    icon: "Wallet",
    color: "#22c55e",
  },
  scholarship: {
    label: "Scholarship",
    category: "income",
    group: "scholarships",
    icon: "Award",
    color: "#3b82f6",
  },
  other_income: {
    label: "Other Income",
    category: "income",
    group: "other",
    icon: "Plus",
    color: "#22c55e",
  },
} as const;

/** All transaction type keys */
export type TransactionTypeKey = keyof typeof transactionTypes;

/** Transaction category */
export type TransactionCategory = "expense" | "income";

/** Expense groups for summary view */
export const expenseGroups = [
  "school",
  "groceries",
  "personal",
  "general",
  "other",
] as const;

/** Income groups for summary view */
export const incomeGroups = ["allowance", "scholarships", "other"] as const;

/** Get all types by category */
export function getTypesByCategory(category: TransactionCategory) {
  return Object.entries(transactionTypes)
    .filter(([, config]) => config.category === category)
    .map(([key, config]) => ({ key: key as TransactionTypeKey, ...config }));
}

/** Get expense types */
export const expenseTypes = getTypesByCategory("expense");

/** Get income types */
export const incomeTypes = getTypesByCategory("income");
