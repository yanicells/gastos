import { Navbar } from "@/components/shared/navbar";
import { ChartsSkeleton } from "@/components/charts/skeletons";

/**
 * Loading state for charts route.
 */
export default function ChartsLoading() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <ChartsSkeleton />
    </div>
  );
}
