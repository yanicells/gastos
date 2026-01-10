import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTransactions } from "@/lib/queries/transactions";
import { TransactionList } from "@/components/transactions/transaction-list";
import { loadMoreTransactions } from "@/lib/actions/load-more";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";

/**
 * Transactions page - full list with infinite scroll.
 */
export default async function TransactionsPage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  // Fetch initial transactions
  const { data: transactions } = await getTransactions({ limit: 20 });

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionList
              initialTransactions={transactions}
              loadMore={loadMoreTransactions}
              pageSize={20}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
