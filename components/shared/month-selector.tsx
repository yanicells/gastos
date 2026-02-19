"use client";

import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MONTHS = [
  { value: 1, label: "Jan" },
  { value: 2, label: "Feb" },
  { value: 3, label: "Mar" },
  { value: 4, label: "Apr" },
  { value: 5, label: "May" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 8, label: "Aug" },
  { value: 9, label: "Sep" },
  { value: 10, label: "Oct" },
  { value: 11, label: "Nov" },
  { value: 12, label: "Dec" },
];

interface MonthSelectorProps {
  value: number | null;
  onChange: (month: number | null) => void;
  disabled?: boolean;
  allowClear?: boolean;
}

/**
 * Month dropdown selector component.
 * Shows months in a 4x3 grid with an option to clear selection.
 */
export function MonthSelector({
  value,
  onChange,
  disabled,
  allowClear = true,
}: MonthSelectorProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = value
    ? MONTHS.find((m) => m.value === value)?.label
    : "Month";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-[100px] justify-between",
            !value && "text-muted-foreground"
          )}
        >
          {selectedLabel}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-3" align="end">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Select Month
          </span>
          {allowClear && value && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-1">
          {MONTHS.map((month) => (
            <Button
              key={month.value}
              variant={value === month.value ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-8 text-xs font-normal",
                value === month.value
                  ? "hover:bg-primary/90"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                onChange(month.value);
                setOpen(false);
              }}
            >
              {month.label}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
