"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/shared/date-picker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  expenseTypes,
  incomeTypes,
  type TransactionTypeKey,
} from "@/lib/data/types";
import { updateTransaction } from "@/lib/actions/transactions";
import { parseAmount } from "@/lib/utils/calculate";
import type { Transaction } from "@/lib/types/transaction";

interface EditTransactionModalProps {
  /** Transaction to edit */
  transaction: Transaction | null;
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal closes */
  onClose: () => void;
  /** Called after successful update */
  onSuccess?: (updated: Transaction) => void;
}

/**
 * Modal dialog for editing a transaction.
 */
export function EditTransactionModal({
  transaction,
  open,
  onClose,
  onSuccess,
}: EditTransactionModalProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [type, setType] = React.useState<TransactionTypeKey | "">("");
  const [amount, setAmount] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // Populate form when transaction changes
  React.useEffect(() => {
    if (transaction) {
      setDate(new Date(transaction.date));
      setType(transaction.type);
      setAmount(String(transaction.amount));
      setNotes(transaction.notes ?? "");
      setError(null);
    }
  }, [transaction]);

  const parsedAmount = parseAmount(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction) return;
    setError(null);

    if (!type) {
      setError("Please select a type");
      return;
    }

    if (parsedAmount === null || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsPending(true);

    const result = await updateTransaction(transaction.id, {
      date: format(date, "yyyy-MM-dd"),
      type: type as TransactionTypeKey,
      amount: parsedAmount,
      notes: notes.trim() || null,
    });

    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else if (result.data) {
      onSuccess?.(result.data);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <DatePicker value={date} onChange={(d) => d && setDate(d)} />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="edit-type">Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as TransactionTypeKey)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" align="start">
                  <SelectGroup>
                    <SelectLabel>Expenses</SelectLabel>
                    {expenseTypes.map((t) => (
                      <SelectItem key={t.key} value={t.key}>
                        <span
                          className="mr-2 inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Income</SelectLabel>
                    {incomeTypes.map((t) => (
                      <SelectItem key={t.key} value={t.key}>
                        <span
                          className="mr-2 inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount</Label>
            <Input
              id="edit-amount"
              type="text"
              inputMode="decimal"
              placeholder="e.g. 100+50 or 500*0.8"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              required
            />
            {amount && parsedAmount !== null && amount.match(/[+\-*/]/) && (
              <p className="text-sm text-muted-foreground">
                = ₱{parsedAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes (optional)</Label>
            <Textarea
              id="edit-notes"
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Error */}
          {error && <p className="text-sm text-destructive">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
