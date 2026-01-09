"use client";

import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <ShieldX className="h-16 w-16 text-destructive" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You are not authorized to access this application.
        </p>
      </div>
      <Button variant="outline" asChild>
        <a href="/auth/login">Try a different account</a>
      </Button>
    </div>
  );
}
