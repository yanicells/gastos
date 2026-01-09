import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getRecentTransactions } from "@/lib/queries/transactions";
import { QuickAddForm } from "@/components/dashboard/quick-add-form";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { MonthlySummary } from "@/components/dashboard/monthly-summary";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Dashboard page - split view layout.
 * Left: Quick Add Form
 * Right: Monthly Summary (placeholder)
 * Bottom: Recent Transactions
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  // Fetch recent transactions
  const { data: transactions } = await getRecentTransactions(10);

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Gastos</h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/transactions"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              All Transactions
            </Link>
            <span className="text-sm text-muted-foreground">
              {authData.claims.email}
            </span>
            <LogoutButton />
          </nav>
        </div>
      </header>

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

          {/* Right: Monthly Summary (placeholder) */}
          <MonthlySummary />
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
