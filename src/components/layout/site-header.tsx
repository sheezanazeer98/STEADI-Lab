import { Logo } from "@/components/shared/logo";
import { DesktopNav } from "./desktop-nav";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex h-14 items-stretch justify-between rounded-md border border-border bg-card/92 shadow-(--shadow-card) backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
          <div className="flex items-center pr-5 pl-4 sm:pl-5">
            <Logo />
          </div>
          <div className="flex items-stretch">
            <DesktopNav />
            <ThemeToggle className="h-full w-12 border-l border-border" />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
