"use client";

import * as React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

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
import { EditTransactionModal } from "./edit-transaction-modal";

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
  const [editingTransaction, setEditingTransaction] =
    React.useState<Transaction | null>(null);

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

  const handleEditSuccess = (updated: Transaction) => {
    // Optimistically update the list
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
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
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead className="whitespace-nowrap pr-8">Type</TableHead>
            <TableHead className="whitespace-nowrap pr-12">Amount</TableHead>
            <TableHead className="w-full">Notes</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t) => {
            const typeConfig = transactionTypes[t.type as TransactionTypeKey];
            const isExpense = typeConfig?.category === "expense";

            return (
              <TableRow key={t.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {format(new Date(t.date), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="whitespace-nowrap pr-8">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                    style={{
                      backgroundColor: typeConfig?.color ?? "#6b7280",
                    }}
                  >
                    {typeConfig?.label ?? t.type}
                  </span>
                </TableCell>
                <TableCell className="text-left font-mono whitespace-nowrap pr-12">
                  <span
                    className={isExpense ? "text-red-500" : "text-green-500"}
                  >
                    {isExpense ? "-" : "+"}₱{Number(t.amount).toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="max-w-[400px] truncate text-muted-foreground">
                  {t.notes || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {/* Edit Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTransaction(t)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete Button with Confirmation */}
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
                            transaction of ₱{Number(t.amount).toLocaleString()}.
                            This action cannot be undone.
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

      {/* Edit Modal */}
      <EditTransactionModal
        transaction={editingTransaction}
        open={editingTransaction !== null}
        onClose={() => setEditingTransaction(null)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
