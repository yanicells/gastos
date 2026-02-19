"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { YearSelector } from "@/components/shared/year-selector";
import { MonthSelector } from "@/components/shared/month-selector";

export function MonthlySkeleton() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            <Skeleton className="h-8 w-64" />
          </h1>

          <div className="flex items-center gap-2 pointer-events-none opacity-80">
            <YearSelector value={currentYear} onChange={() => {}} />
            <MonthSelector
              value={currentMonth}
              onChange={() => {}}
              allowClear={false}
            />
            <Button variant="outline" size="icon" disabled>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <section className="space-y-4">
          <Skeleton className="h-6 w-40" />

          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2].map((item) => (
              <Card key={item}>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Skeleton className="h-6 w-36" />

          {[1, 2, 3, 4].map((item) => (
            <Card key={item}>
              <CardHeader>
                <Skeleton className="h-5 w-56" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[1, 2, 3].map((metric) => (
                    <div key={metric} className="rounded-md border p-3 space-y-2">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2].map((col) => (
                    <div key={col} className="space-y-4">
                      <Skeleton className="h-5 w-32" />
                      {[1, 2].map((row) => (
                        <div key={row} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-8 w-8 rounded-full" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                          </div>
                          <Skeleton className="h-2 w-full" />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
