"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSelectorProps {
  value: number;
  onChange: (year: number) => void;
  /** Years to show in dropdown. Defaults to last 5 years including current. */
  years?: number[];
}

/**
 * Year dropdown selector component.
 * Used in summary and charts pages.
 */
export function YearSelector({ value, onChange, years }: YearSelectorProps) {
  const currentYear = new Date().getFullYear();
  const yearOptions = years ?? [
    currentYear,
    currentYear - 1,
    currentYear - 2,
    currentYear - 3,
    currentYear - 4,
  ];

  return (
    <Select
      value={String(value)}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        {yearOptions.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
