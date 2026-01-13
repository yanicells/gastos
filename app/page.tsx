import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

/**
 * Skeleton for SummaryStats - matches the card layout.
 */
function SummaryStatsSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="space-y-6 pt-6">
        {/* Stats cards */}
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
        <div className="rounded-lg border overflow-hidden">
          <div className="p-4 space-y-3">
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton for recent transactions table.
 */
function TransactionsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

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
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check auth - this is fast and required before any data
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-svh bg-background">
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
            <Suspense fallback={<TransactionsSkeleton />}>
              <RecentTransactionsSection />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
