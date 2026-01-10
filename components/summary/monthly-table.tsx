"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { expenseGroups, incomeGroups } from "@/lib/data/types";
import type {
  MonthlySummaryRow,
  YearlySummaryTotals,
} from "@/lib/types/analytics";

interface MonthlyTableProps {
  data: MonthlySummaryRow[];
  totals: YearlySummaryTotals;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Group labels for display */
const GROUP_LABELS: Record<string, string> = {
  school: "School",
  groceries: "Groceries",
  personal: "Personal",
  general: "General",
  other: "Other",
  allowance: "Allowance",
  scholarships: "Scholarships",
};

/**
 * Format amount as Philippine Peso.
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Excel-style monthly summary table.
 * Shows expense groups, income groups, and savings by month.
 */
export function MonthlyTable({ data, totals }: MonthlyTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          {/* Group headers row */}
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-background" />
            <TableHead
              colSpan={expenseGroups.length + 1}
              className="bg-red-500/10 text-center text-red-400 font-semibold border-x"
            >
              Expenses
            </TableHead>
            <TableHead
              colSpan={incomeGroups.length + 1}
              className="bg-blue-500/10 text-center text-blue-400 font-semibold border-x"
            >
              Revenue
            </TableHead>
            <TableHead className="bg-green-500/10 text-center text-green-400 font-semibold">
              Savings
            </TableHead>
          </TableRow>
          {/* Column headers row */}
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-background font-semibold min-w-[100px]">
              Month
            </TableHead>
            {/* Expense group columns */}
            {expenseGroups.map((group) => (
              <TableHead
                key={group}
                className="bg-red-500/5 text-red-400/80 text-center min-w-[100px]"
              >
                {GROUP_LABELS[group] ?? group}
              </TableHead>
            ))}
            <TableHead className="bg-red-500/10 text-red-400 font-semibold text-center min-w-[110px]">
              TOTAL
            </TableHead>
            {/* Income group columns */}
            {incomeGroups.map((group) => (
              <TableHead
                key={group}
                className="bg-blue-500/5 text-blue-400/80 text-center min-w-[100px]"
              >
                {GROUP_LABELS[group] ?? group}
              </TableHead>
            ))}
            <TableHead className="bg-blue-500/10 text-blue-400 font-semibold text-center min-w-[110px]">
              TOTAL
            </TableHead>
            {/* Savings column */}
            <TableHead className="bg-green-500/10 text-green-400 font-semibold text-center min-w-[110px]">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Monthly rows */}
          {data.map((row) => (
            <TableRow key={row.month}>
              <TableCell className="sticky left-0 z-10 bg-background font-medium">
                {MONTH_NAMES[row.month - 1]}
              </TableCell>
              {/* Expense values */}
              {expenseGroups.map((group) => (
                <TableCell key={group} className="text-center tabular-nums">
                  {formatCurrency(row.expenses[group] ?? 0)}
                </TableCell>
              ))}
              <TableCell className="text-center font-semibold text-red-400 tabular-nums">
                {formatCurrency(row.totalExpenses)}
              </TableCell>
              {/* Income values */}
              {incomeGroups.map((group) => (
                <TableCell key={group} className="text-center tabular-nums">
                  {formatCurrency(row.income[group] ?? 0)}
                </TableCell>
              ))}
              <TableCell className="text-center font-semibold text-blue-400 tabular-nums">
                {formatCurrency(row.totalIncome)}
              </TableCell>
              {/* Savings */}
              <TableCell
                className={`text-center font-semibold tabular-nums ${
                  row.savings >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {formatCurrency(row.savings)}
              </TableCell>
            </TableRow>
          ))}
          {/* Totals row */}
          <TableRow className="border-t-2 font-bold">
            <TableCell className="sticky left-0 z-10 bg-background">
              TOTAL
            </TableCell>
            {/* Expense totals */}
            {expenseGroups.map((group) => (
              <TableCell
                key={group}
                className="text-center text-red-400/80 tabular-nums"
              >
                {formatCurrency(totals.expenses[group] ?? 0)}
              </TableCell>
            ))}
            <TableCell className="text-center text-red-400 tabular-nums">
              {formatCurrency(totals.totalExpenses)}
            </TableCell>
            {/* Income totals */}
            {incomeGroups.map((group) => (
              <TableCell
                key={group}
                className="text-center text-blue-400/80 tabular-nums"
              >
                {formatCurrency(totals.income[group] ?? 0)}
              </TableCell>
            ))}
            <TableCell className="text-center text-blue-400 tabular-nums">
              {formatCurrency(totals.totalIncome)}
            </TableCell>
            {/* Savings total */}
            <TableCell
              className={`text-center tabular-nums ${
                totals.savings >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {formatCurrency(totals.savings)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
