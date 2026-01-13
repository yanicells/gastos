import { Suspense } from "react";
import { getTransactions } from "@/lib/queries/transactions";
import { TransactionList } from "@/components/transactions/transaction-list";
import { loadMoreTransactions } from "@/lib/actions/load-more";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/shared/navbar";
import { TransactionTableSkeleton } from "@/components/transactions/skeletons";
import { AuthCheck } from "@/components/shared/auth-check";

/**
 * Async component for transaction list.
 */
async function TransactionListSection() {
  const { data: transactions } = await getTransactions({ limit: 20 });

  return (
    <TransactionList
      initialTransactions={transactions}
      loadMore={loadMoreTransactions}
      pageSize={20}
    />
  );
}

/**
 * Transactions page - full list with infinite scroll.
 */
export default function TransactionsPage() {
  return (
    <div className="min-h-svh bg-background">
      <Suspense fallback={null}>
        <AuthCheck />
      </Suspense>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TransactionTableSkeleton rows={15} />}>
              <TransactionListSection />
            </Suspense>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
