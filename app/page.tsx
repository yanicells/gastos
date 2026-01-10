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
import Link from "next/link";

/**
 * Dashboard page - split view layout.
 * Left: Quick Add Form
 * Right: Summary Stats
 * Bottom: Recent Transactions
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  // Fetch data in parallel
  const [
    { data: transactions },
    { data: currentMonthStats },
    { data: averages },
  ] = await Promise.all([
    getRecentTransactions(10),
    getCurrentMonthStats(),
    getRollingAverages(),
  ]);

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: Quick Add Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickAddForm />
            </CardContent>
          </Card>

          {/* Right: Summary Stats */}
          <SummaryStats currentMonth={currentMonthStats} averages={averages} />
        </div>

        {/* Bottom: Recent Transactions */}
        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/transactions">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentTransactions initialTransactions={transactions} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
