"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  X as XIcon,
  LayoutDashboard,
  Receipt,
  BarChart3,
  PieChart,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transactions", label: "Transactions", icon: Receipt },
    { href: "/summary", label: "Summary", icon: BarChart3 },
    { href: "/charts", label: "Charts", icon: PieChart },
  ];

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo - Always on the left */}
        <Link href="/" className="font-bold text-xl tracking-tight">
          Gastos
        </Link>

        {/* Desktop Nav - Centered/Right */}
        <nav className="hidden md:flex items-center gap-1 mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                pathname === item.href
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Desktop Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Logout"
            className="hidden md:flex text-muted-foreground hover:text-foreground hover:bg-muted rounded-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-muted"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 border-l w-[85vw] max-w-[400px]"
                showCloseButton={false}
              >
                <div className="flex flex-col h-full bg-background">
                  <div className="flex items-center justify-between p-6 border-b">
                    <SheetTitle className="text-2xl font-bold">
                      Gastos
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 p-0 hover:bg-muted rounded-full"
                      >
                        <XIcon className="h-8 w-8" />
                        <span className="sr-only">Close</span>
                      </Button>
                    </SheetClose>
                  </div>

                  <div className="flex-1 px-3 py-4">
                    <nav className="flex flex-col gap-1.5">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:bg-muted active:scale-[0.98]"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5",
                                isActive
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                            <span className="text-lg font-medium">
                              {item.label}
                            </span>
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="p-4 mt-auto border-t bg-muted/30">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-3 px-4 py-6 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="text-lg font-medium">Logout</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
