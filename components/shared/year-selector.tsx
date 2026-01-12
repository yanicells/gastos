"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  /** Years to show in dropdown. Defaults to last 5 years including current. */
  years?: number[];
}

/**
 * Year dropdown selector component.
 * Used in summary and charts pages.
 * Displays years in a grid for better usability with many years.
 */
export function YearSelector({ value, onChange, years }: YearSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const currentYear = new Date().getFullYear();

  // Default to last 5 years if not provided, but sorted descending
  const yearOptions = years ?? [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4,
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[120px] justify-between"
        >
          {value}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3" align="end">
        <div className="text-sm font-medium text-muted-foreground px-1">
          Select Year
        </div>
        <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {yearOptions.map((year) => (
            <Button
              key={year}
              variant={value === year ? "default" : "outline"}
              className={cn(
                "h-9 px-2 text-sm font-normal",
                value === year
                  ? "hover:bg-primary/90"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                onChange(year);
                setOpen(false);
              }}
            >
              {year}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
