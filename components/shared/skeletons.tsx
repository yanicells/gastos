import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Dashboard page skeleton - matches layout of dashboard.
 */
export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Add Form Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>

        {/* Summary Stats Card */}
        <Card className="h-full">
          <CardContent className="space-y-6 pt-6">
            {/* Stats cards row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-2 p-4 rounded-xl border bg-card/50"
                >
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-md" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-8 w-28" />
                </div>
              ))}
            </div>
            {/* Averages table */}
            <div className="rounded-lg border overflow-hidden p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Card */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-20" />
        </CardHeader>
        <CardContent>
          <TransactionTableSkeleton rows={5} />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Transaction table skeleton - shows actual table structure with placeholder text.
 * Columns: Date | Type | Amount | Notes | Actions
 */
export function TransactionTableSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap">Date</TableHead>
          <TableHead className="whitespace-nowrap pr-8">Type</TableHead>
          <TableHead className="whitespace-nowrap pr-12">Amount</TableHead>
          <TableHead className="w-full">Notes</TableHead>
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium whitespace-nowrap text-muted-foreground">
              —
            </TableCell>
            <TableCell className="whitespace-nowrap pr-8">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground">
                —
              </span>
            </TableCell>
            <TableCell className="text-left font-mono whitespace-nowrap pr-12 text-muted-foreground">
              —
            </TableCell>
            <TableCell className="max-w-[400px] text-muted-foreground">
              —
            </TableCell>
            <TableCell>
              <div className="flex gap-1">
                <div className="h-8 w-8" />
                <div className="h-8 w-8" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/**
 * Transactions page skeleton - full page with filters.
 */
export function TransactionsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters row */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 flex-1 min-w-48" />
          </div>
          <TransactionTableSkeleton rows={12} />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Summary table skeleton - shows actual table structure with placeholder text.
 */
export function SummaryTableSkeleton() {
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

  const expenseGroups = [
    "School",
    "Groceries & Food",
    "Personal",
    "General",
    "Other",
  ];
  const incomeGroups = ["Allowance", "Scholarships", "Other"];

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-10" />
          </div>
        </CardHeader>
        <CardContent>
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
                  <TableHead className="sticky left-0 z-10 bg-background font-semibold min-w-24">
                    Month
                  </TableHead>
                  {expenseGroups.map((group) => (
                    <TableHead
                      key={group}
                      className="bg-red-500/5 text-red-400/80 text-center min-w-24"
                    >
                      {group}
                    </TableHead>
                  ))}
                  <TableHead className="bg-red-500/10 text-red-400 font-semibold text-center min-w-28">
                    TOTAL
                  </TableHead>
                  {incomeGroups.map((group) => (
                    <TableHead
                      key={group}
                      className="bg-blue-500/5 text-blue-400/80 text-center min-w-24"
                    >
                      {group}
                    </TableHead>
                  ))}
                  <TableHead className="bg-blue-500/10 text-blue-400 font-semibold text-center min-w-28">
                    TOTAL
                  </TableHead>
                  <TableHead className="bg-green-500/10 text-green-400 font-semibold text-center min-w-28">
                    Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Monthly rows with placeholder */}
                {MONTH_NAMES.map((month) => (
                  <TableRow key={month}>
                    <TableCell className="sticky left-0 z-10 bg-background font-medium">
                      {month}
                    </TableCell>
                    {/* Expense values */}
                    {expenseGroups.map((group) => (
                      <TableCell
                        key={group}
                        className="text-center tabular-nums text-muted-foreground"
                      >
                        —
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold text-muted-foreground tabular-nums">
                      —
                    </TableCell>
                    {/* Income values */}
                    {incomeGroups.map((group) => (
                      <TableCell
                        key={group}
                        className="text-center tabular-nums text-muted-foreground"
                      >
                        —
                      </TableCell>
                    ))}
                    <TableCell className="text-center font-semibold text-muted-foreground tabular-nums">
                      —
                    </TableCell>
                    {/* Savings */}
                    <TableCell className="text-center font-semibold text-muted-foreground tabular-nums">
                      —
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
                      className="text-center text-muted-foreground tabular-nums"
                    >
                      —
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-muted-foreground tabular-nums">
                    —
                  </TableCell>
                  {/* Income totals */}
                  {incomeGroups.map((group) => (
                    <TableCell
                      key={group}
                      className="text-center text-muted-foreground tabular-nums"
                    >
                      —
                    </TableCell>
                  ))}
                  <TableCell className="text-center text-muted-foreground tabular-nums">
                    —
                  </TableCell>
                  {/* Savings total */}
                  <TableCell className="text-center text-muted-foreground tabular-nums">
                    —
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Charts page skeleton - matches analytics layout.
 */
export function ChartsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>

      {/* Comparison Cards - 4 columns on lg */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24 mb-2" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Averages Summary - 3 columns */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between pt-1 border-t">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly Bar Chart */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-72 w-full" />
        </CardContent>
      </Card>

      {/* Pie + Top Categories Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-44" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trend Line Chart */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}
