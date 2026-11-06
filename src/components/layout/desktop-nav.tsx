"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isNavGroup, primaryNav, type NavGroup, type NavItem } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const cellClass =
  "label-mono relative flex h-full items-center gap-1.5 border-l border-border px-3 xl:px-4 text-foreground/85 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:bg-muted data-[active=true]:text-primary";

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const active = isActivePath(pathname, item.href);
  return (
    <Link
      href={item.href}
      data-active={active}
      aria-current={active ? "page" : undefined}
      className={cellClass}
    >
      {item.label}
      {active ? (
        <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 bg-primary xl:inset-x-4" />
      ) : null}
    </Link>
  );
}

function NavDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const active = group.items.some((item) => isActivePath(pathname, item.href));
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-active={active}
        className={cn(cellClass, "cursor-pointer data-[state=open]:bg-muted")}
      >
        {group.label}
        <ChevronDown className="size-3.5" aria-hidden="true" />
        {active ? (
          <span aria-hidden="true" className="absolute inset-x-3 bottom-0 h-0.5 bg-primary xl:inset-x-4" />
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 rounded-md border border-border bg-popover p-1.5 shadow-(--shadow-card)"
      >
        {group.items.map((item) => {
          const itemActive = isActivePath(pathname, item.href);
          return (
            <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-sm px-3 py-2.5">
              <Link href={item.href} aria-current={itemActive ? "page" : undefined}>
                <span className="flex flex-col gap-0.5">
                  <span
                    className={cn("text-sm font-semibold", itemActive ? "text-primary" : "text-foreground")}
                  >
                    {item.label}
                  </span>
                  {item.description ? (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  ) : null}
                </span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DesktopNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden h-full lg:flex">
      {primaryNav.map((item) =>
        isNavGroup(item) ? (
          <NavDropdown key={item.label} group={item} pathname={pathname} />
        ) : (
          <NavLink key={item.href} item={item} pathname={pathname} />
        ),
      )}
    </nav>
  );
}
