import { Navbar } from "@/components/shared/navbar";
import { TransactionsPageSkeleton } from "@/components/shared/skeletons";

/**
 * Loading state for transactions route.
 */
export default function TransactionsLoading() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <TransactionsPageSkeleton />
    </div>
  );
}
