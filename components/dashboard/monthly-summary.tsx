import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Placeholder for monthly summary cards and mini chart.
 * Will be implemented in Phase 3.
 */
export function MonthlySummary() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Monthly Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">Coming soon</p>
          <p className="text-sm text-muted-foreground">
            Summary cards and charts will appear here
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
