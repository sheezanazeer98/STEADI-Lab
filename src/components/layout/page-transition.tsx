"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { navigationStore } from "@/lib/navigation-store";

/**
 * Returns the pathname an internal link click will navigate to, or `null` when
 * the click should be left alone (external links, downloads, modifier keys,
 * same-page anchors and query changes).
 */
function internalNavigationTarget(event: MouseEvent): string | null {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  if (!(event.target instanceof Element)) return null;
  const anchor = event.target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) return null;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return null;

  let url: URL;
  try {
    url = new URL(anchor.href, window.location.href);
  } catch {
    return null;
  }
  if (url.origin !== window.location.origin) return null;
  if (url.pathname === window.location.pathname) return null;
  return url.pathname;
}

/**
 * Blurs the current page while the next route loads and blurs the new route
 * in once it commits. The initial server-rendered view is never animated, and
 * users who prefer reduced motion get an instant swap with a subtle dim.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { target, navigations } = useSyncExternalStore(
    navigationStore.subscribe,
    navigationStore.getSnapshot,
    navigationStore.getServerSnapshot,
  );
  const navigating = target !== null && target !== pathname;
  const animateIn = navigations > 0 && !reduceMotion;

  // Any committed route change ends the pending state.
  useEffect(() => {
    navigationStore.finish();
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const next = internalNavigationTarget(event);
      if (next !== null) navigationStore.start(next);
    };
    const onPopState = () => navigationStore.mark();
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return (
    <div
      className="page-shell"
      data-navigating={navigating ? "" : undefined}
      aria-busy={navigating || undefined}
    >
      <motion.div
        key={pathname}
        initial={animateIn ? { opacity: 0, filter: "blur(12px)", y: 8 } : false}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0, transitionEnd: { filter: "none" } }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
