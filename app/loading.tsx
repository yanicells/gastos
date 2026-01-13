import { Navbar } from "@/components/shared/navbar";
import { DashboardSkeleton } from "@/components/shared/skeletons";

/**
 * Loading state for dashboard route.
 */
export default function DashboardLoading() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <DashboardSkeleton />
    </div>
  );
}
