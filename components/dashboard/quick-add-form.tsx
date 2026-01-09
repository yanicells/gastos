"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/shared/date-picker";
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
  transactionTypes,
  expenseTypes,
  incomeTypes,
  type TransactionTypeKey,
} from "@/lib/data/types";
import { createTransaction } from "@/lib/actions/transactions";

/**
 * Quick add transaction form for dashboard.
 */
export function QuickAddForm() {
  const [isPending, setIsPending] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [type, setType] = React.useState<TransactionTypeKey | "">("");
  const [amount, setAmount] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!type) {
      setError("Please select a type");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setIsPending(true);

    const result = await createTransaction({
      date: format(date, "yyyy-MM-dd"),
      type: type as TransactionTypeKey,
      amount: parsedAmount,
      notes: notes.trim() || null,
    });

    setIsPending(false);

    if (result.error) {
      setError(result.error);
    } else {
      // Reset form
      setAmount("");
      setNotes("");
      setType("");
      setDate(new Date());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Date */}
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <DatePicker value={date} onChange={(d) => d && setDate(d)} />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
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
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      {/* Error */}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Submit */}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
}
