"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Logo } from "@/components/shared/logo";
import { isNavGroup, primaryNav, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { label: "Home", href: "/" as const },
    ...primaryNav.flatMap((item) => (isNavGroup(item) ? item.items : [item])),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="inline-flex size-10 items-center justify-center border-l border-border text-foreground transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="right" className="w-[88vw] gap-0 bg-background p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-border px-5 py-4">
          <SheetTitle asChild>
            <div>
              <Logo />
            </div>
          </SheetTitle>
          <SheetDescription className="mt-1 label-mono text-muted-foreground">
            {siteConfig.institution.shortName}
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="flex flex-col overflow-y-auto py-2">
          {links.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center justify-between border-b border-border/60 px-5 py-3.5 text-base font-semibold transition-colors",
                  active ? "text-primary" : "text-foreground hover:bg-muted",
                )}
              >
                {item.label}
                <span className="label-mono text-muted-foreground">{active ? "●" : "→"}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
