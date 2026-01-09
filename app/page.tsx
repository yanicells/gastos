import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { transactionTypes, type TransactionTypeKey } from "@/lib/data/types";

/**
 * Simple test page to verify Supabase connection and transactions table
 */
export default async function HomePage() {
  const supabase = await createClient();

  // Check auth
  const { data: authData, error: authError } = await supabase.auth.getClaims();
  if (authError || !authData?.claims) {
    redirect("/auth/login");
  }

  // Fetch transactions
  const { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .is("deleted_at", null)
    .order("date", { ascending: false })
    .limit(10);

  return (
    <div className="min-h-svh p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Database Connection Test</h1>
          <p className="text-muted-foreground">
            Logged in as: {authData.claims.email}
          </p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-4 font-semibold">Recent Transactions</h2>

          {error ? (
            <div className="rounded bg-destructive/10 p-4 text-destructive">
              <p className="font-medium">Error fetching transactions:</p>
              <pre className="mt-2 text-sm">
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-2">
              {transactions.map((t) => {
                const typeConfig =
                  transactionTypes[t.type as TransactionTypeKey];
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded border p-3"
                  >
                    <div>
                      <span
                        className="mr-2 inline-block rounded px-2 py-0.5 text-xs font-medium text-white"
                        style={{
                          backgroundColor: typeConfig?.color ?? "#6b7280",
                        }}
                      >
                        {typeConfig?.label ?? t.type}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t.date}
                      </span>
                    </div>
                    <span className="font-mono font-medium">
                      ₱{Number(t.amount).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No transactions yet. The table is empty but connection works! ✓
            </p>
          )}
        </div>

        <div className="rounded-lg border bg-muted/50 p-4">
          <h2 className="mb-2 font-semibold">Debug Info</h2>
          <pre className="overflow-auto text-xs">
            {JSON.stringify(
              { transactionCount: transactions?.length ?? 0, error },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
}
