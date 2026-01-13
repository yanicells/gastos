import { Suspense } from "react";
import { getRecentTransactions } from "@/lib/queries/transactions";
import {
  getCurrentMonthStats,
  getRollingAverages,
} from "@/lib/queries/analytics";
import { Navbar } from "@/components/shared/navbar";
import { QuickAddForm } from "@/components/dashboard/quick-add-form";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { SummaryStats } from "@/components/dashboard/monthly-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  SummaryStatsSkeleton,
  RecentTransactionsSkeleton,
} from "@/components/dashboard/skeletons";
import Link from "next/link";

// ... imports ...
import { AuthCheck } from "@/components/shared/auth-check";

/**
 * Async component for Summary Stats.
 */
async function SummaryStatsSection() {
  const [{ data: currentMonthStats }, { data: averages }] = await Promise.all([
    getCurrentMonthStats(),
    getRollingAverages(),
  ]);

  return <SummaryStats currentMonth={currentMonthStats} averages={averages} />;
}

/**
 * Async component for Recent Transactions.
 */
async function RecentTransactionsSection() {
  const { data: transactions } = await getRecentTransactions(10);

  return <RecentTransactions initialTransactions={transactions} />;
}

/**
 * Dashboard page - split view layout with streaming.
 * Left: Quick Add Form (renders immediately)
 * Right: Summary Stats (streams)
 * Bottom: Recent Transactions (streams)
 */
export default function DashboardPage() {
  return (
    <div className="min-h-svh bg-background">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Quick Add Form - renders immediately, no data needed */}
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickAddForm />
            </CardContent>
          </Card>

          {/* Right: Summary Stats - streams */}
          <Suspense fallback={<SummaryStatsSkeleton />}>
            <SummaryStatsSection />
          </Suspense>
        </div>

        {/* Bottom: Recent Transactions - streams */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RecentTransactionsSkeleton />}>
              <RecentTransactionsSection />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
