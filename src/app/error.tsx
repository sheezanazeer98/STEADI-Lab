"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Backdrop } from "@/components/shared/backdrop";
import { ActionButton, ButtonLink } from "@/components/shared/button-link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Surface the error in the console; hook an error reporter here if one is added.
    console.error(error);
  }, [error]);

  return (
    <section className="relative overflow-hidden">
      <Backdrop density="low" />
      <div className="relative container-wide py-24 sm:py-32">
        <p className="label-mono text-primary">Something went wrong</p>
        <h1 className="mt-4 display-text text-4xl sm:text-5xl lg:text-6xl">
          The page could not be <span className="text-primary">rendered</span>.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          An unexpected error occurred while building this page. You can retry, or go back to the homepage. If
          the problem persists, please let us know through the contact page.
        </p>
        {error.digest ? (
          <p className="mt-4 label-mono text-muted-foreground">
            Reference: <code className="text-foreground">{error.digest}</code>
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-3">
          <ActionButton size="lg" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Try again
          </ActionButton>
          <ButtonLink href="/" size="lg" variant="secondary">
            Back to home
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="ghost">
            Report the problem
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
