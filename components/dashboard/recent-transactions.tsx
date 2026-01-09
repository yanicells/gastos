"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { transactionTypes, type TransactionTypeKey } from "@/lib/data/types";
import type { Transaction } from "@/lib/types/transaction";
import { softDeleteTransaction } from "@/lib/actions/transactions";

interface RecentTransactionsProps {
  /** Initial transactions from server */
  initialTransactions: Transaction[];
}

/**
 * Recent transactions table for dashboard.
 */
export function RecentTransactions({
  initialTransactions,
}: RecentTransactionsProps) {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  // Update when props change (after revalidation)
  React.useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await softDeleteTransaction(id);
    setDeletingId(null);

    if (result.success) {
      // Optimistically remove from list
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No transactions yet.</p>
        <p className="text-sm text-muted-foreground">
          Add your first transaction above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const typeConfig = transactionTypes[t.type as TransactionTypeKey];
            const isExpense = typeConfig?.category === "expense";

            return (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.date}</TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: typeConfig?.color ?? "#6b7280" }}
                  >
                    {typeConfig?.label ?? t.type}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span
                    className={isExpense ? "text-red-500" : "text-green-500"}
                  >
                    {isExpense ? "-" : "+"}₱{Number(t.amount).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {t.notes || "—"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(t.id)}
                    disabled={deletingId === t.id}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
