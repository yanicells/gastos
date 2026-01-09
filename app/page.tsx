import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRecentTransactions } from "@/lib/queries/transactions";
import { QuickAddForm } from "@/components/dashboard/quick-add-form";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { LogoutButton } from "@/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Dashboard page - quick add form and recent transactions.
 */
export default async function DashboardPage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  // Fetch recent transactions
  const { data: transactions } = await getRecentTransactions(15);

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Gastos</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {authData.claims.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Add Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickAddForm />
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentTransactions initialTransactions={transactions} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
