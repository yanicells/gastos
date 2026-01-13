import { Navbar } from "@/components/shared/navbar";
import { SummaryTableSkeleton } from "@/components/shared/skeletons";

/**
 * Loading state for summary route.
 */
export default function SummaryLoading() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <SummaryTableSkeleton />
    </div>
  );
}
