import { Navbar } from "@/components/shared/navbar";
import { TotalsSkeleton } from "@/components/totals/skeletons";

export default function Loading() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <TotalsSkeleton />
    </div>
  );
}
