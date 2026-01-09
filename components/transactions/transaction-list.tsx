"use client";

import * as React from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { EditTransactionModal } from "@/components/dashboard/edit-transaction-modal";

interface TransactionListProps {
  /** Initial transactions from server */
  initialTransactions: Transaction[];
  /** Function to load more transactions */
  loadMore: (offset: number) => Promise<Transaction[]>;
  /** Page size for infinite scroll */
  pageSize?: number;
}

/**
 * Full transactions list with infinite scroll.
 */
export function TransactionList({
  initialTransactions,
  loadMore,
  pageSize = 20,
}: TransactionListProps) {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(
    initialTransactions.length >= pageSize
  );
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);

  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          const newTransactions = await loadMore(transactions.length);

          if (newTransactions.length < pageSize) {
            setHasMore(false);
          }

          setTransactions((prev) => [...prev, ...newTransactions]);
          setIsLoading(false);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, transactions.length, loadMore, pageSize]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await softDeleteTransaction(id);
    setDeletingId(null);

    if (result.success) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleEditSuccess = (updated: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No transactions yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-20"></TableHead>
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
                      style={{
                        backgroundColor: typeConfig?.color ?? "#6b7280",
                      }}
                    >
                      {typeConfig?.label ?? t.type}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    <span
                      className={isExpense ? "text-red-500" : "text-green-500"}
                    >
                      {isExpense ? "-" : "+"}₱
                      {Number(t.amount).toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-48 truncate text-muted-foreground">
                    {t.notes || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingTransaction(t)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === t.id}
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete transaction?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove the {typeConfig?.label ?? t.type}{" "}
                              transaction of ₱
                              {Number(t.amount).toLocaleString()}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(t.id)}
                              className="bg-destructive text-white hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-4">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
        {!hasMore && transactions.length > 0 && (
          <p className="text-sm text-muted-foreground">No more transactions</p>
        )}
      </div>

      <EditTransactionModal
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onClose={() => setEditingTransaction(null)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
