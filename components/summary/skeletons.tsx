"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { expenseGroups, incomeGroups } from "@/lib/data/types";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { YearSelector } from "@/components/shared/year-selector";

/**
 * Summary table skeleton - matches the complex layout of MonthlyTable.
 */
export function SummaryTableSkeleton() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Yearly Summary</CardTitle>
          <div className="flex items-center gap-2 pointer-events-none opacity-80">
            <YearSelector value={currentYear} onChange={() => {}} />
            <Button variant="outline" size="icon" disabled>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                {/* Group headers row */}
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-background" />
                  <TableHead
                    colSpan={expenseGroups.length + 1}
                    className="bg-red-500/10 text-center border-x"
                  >
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableHead>
                  <TableHead
                    colSpan={incomeGroups.length + 1}
                    className="bg-blue-500/10 text-center border-x"
                  >
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableHead>
                  <TableHead className="bg-green-500/10 text-center">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableHead>
                </TableRow>
                {/* Column headers row */}
                <TableRow>
                  <TableHead className="sticky left-0 z-10 bg-background min-w-[100px]">
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                  {/* Expense group columns */}
                  {expenseGroups.map((group) => (
                    <TableHead
                      key={group}
                      className="bg-red-500/5 text-center min-w-[100px]"
                    >
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableHead>
                  ))}
                  <TableHead className="bg-red-500/10 text-center min-w-[110px]">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableHead>
                  {/* Income group columns */}
                  {incomeGroups.map((group) => (
                    <TableHead
                      key={group}
                      className="bg-blue-500/5 text-center min-w-[100px]"
                    >
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableHead>
                  ))}
                  <TableHead className="bg-blue-500/10 text-center min-w-[110px]">
                    <Skeleton className="h-4 w-12 mx-auto" />
                  </TableHead>
                  {/* Savings column */}
                  <TableHead className="bg-green-500/10 text-center min-w-[110px]">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Monthly rows */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="sticky left-0 z-10 bg-background">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    {/* Expense values */}
                    {expenseGroups.map((group) => (
                      <TableCell key={group} className="text-center">
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </TableCell>
                    ))}
                    <TableCell className="text-center bg-red-500/5">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    {/* Income values */}
                    {incomeGroups.map((group) => (
                      <TableCell key={group} className="text-center">
                        <Skeleton className="h-4 w-16 mx-auto" />
                      </TableCell>
                    ))}
                    <TableCell className="text-center bg-blue-500/5">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                    {/* Savings */}
                    <TableCell className="text-center bg-green-500/5">
                      <Skeleton className="h-4 w-16 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Total Row */}
                <TableRow className="border-t-2">
                  <TableCell className="sticky left-0 z-10 bg-background font-bold">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  {/* Expense totals */}
                  {expenseGroups.map((group) => (
                    <TableCell key={group} className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto opacity-50" />
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                  {/* Income totals */}
                  {incomeGroups.map((group) => (
                    <TableCell key={group} className="text-center">
                      <Skeleton className="h-4 w-16 mx-auto opacity-50" />
                    </TableCell>
                  ))}
                  <TableCell className="text-center font-bold">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                  {/* Savings total */}
                  <TableCell className="text-center font-bold">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
