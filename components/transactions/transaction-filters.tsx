"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/shared/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  transactionTypes,
  expenseTypes,
  incomeTypes,
  type TransactionTypeKey,
} from "@/lib/data/types";

export interface FilterState {
  category: "all" | "expense" | "income";
  type: TransactionTypeKey | "all";
  startDate: Date | undefined;
  endDate: Date | undefined;
  search: string;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

/**
 * Reddit-style filter bar for transactions.
 * Horizontal layout with pill-style category toggles and dropdowns.
 */
export function TransactionFilters({
  filters,
  onChange,
}: TransactionFiltersProps) {
  const [searchInput, setSearchInput] = React.useState(filters.search);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onChange({ ...filters, search: searchInput });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters, onChange]);

  const handleCategoryChange = (category: "all" | "expense" | "income") => {
    onChange({ ...filters, category, type: "all" });
  };

  const handleTypeChange = (type: string) => {
    onChange({ ...filters, type: type as TransactionTypeKey | "all" });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    onChange({
      category: "all",
      type: "all",
      startDate: undefined,
      endDate: undefined,
      search: "",
    });
  };

  const hasActiveFilters =
    filters.category !== "all" ||
    filters.type !== "all" ||
    filters.startDate ||
    filters.endDate ||
    filters.search;

  // Get types based on selected category
  const availableTypes =
    filters.category === "expense"
      ? expenseTypes
      : filters.category === "income"
      ? incomeTypes
      : [...expenseTypes, ...incomeTypes];

  return (
    <div className="space-y-4">
      {/* Category Pills (Reddit-style) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-lg border p-1">
          {(["all", "expense", "income"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.category === cat
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "all"
                ? "All"
                : cat === "expense"
                ? "Expenses"
                : "Income"}
            </button>
          ))}
        </div>

        {/* Type Dropdown */}
        <Select value={filters.type} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent position="popper" side="bottom" align="start">
            <SelectItem value="all">All Types</SelectItem>
            {availableTypes.map((t) => (
              <SelectItem key={t.key} value={t.key}>
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: t.color }}
                />
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <DatePicker
            value={filters.startDate}
            onChange={(d) => onChange({ ...filters, startDate: d })}
            placeholder="From"
            className="w-32"
          />
          <span className="text-muted-foreground">–</span>
          <DatePicker
            value={filters.endDate}
            onChange={(d) => onChange({ ...filters, endDate: d })}
            placeholder="To"
            className="w-32"
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
