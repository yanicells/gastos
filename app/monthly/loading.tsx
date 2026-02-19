import { Navbar } from "@/components/shared/navbar";
import { MonthlySkeleton } from "@/components/monthly/skeletons";

export default function MonthlyLoading() {
  return (
    <div className="min-h-svh bg-background">
      <Navbar />
      <MonthlySkeleton />
    </div>
  );
}
