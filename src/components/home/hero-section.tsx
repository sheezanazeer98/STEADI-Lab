import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Backdrop, TargetMarker } from "@/components/shared/backdrop";
import { HeroNetwork } from "@/components/home/hero-network";
import { buttonLinkStyles } from "@/components/shared/button-link";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

const primaryButton = cn(buttonLinkStyles.base, buttonLinkStyles.variant.primary, buttonLinkStyles.size.lg);
const secondaryButton = cn(
  buttonLinkStyles.base,
  buttonLinkStyles.variant.secondary,
  buttonLinkStyles.size.lg,
);

export function HeroSection() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      <Backdrop />
      <HeroNetwork className="absolute inset-0 size-full opacity-70 dark:opacity-50" />
      <div className="relative container-wide flex flex-col items-center pt-16 pb-14 text-center sm:pt-24 sm:pb-20">
        <p className="mb-6 flex items-center gap-3 label-mono text-primary">
          <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
          {siteConfig.institution.name} · {siteConfig.institution.city}, {siteConfig.institution.region}
          <span className="inline-block h-px w-6 bg-primary" aria-hidden="true" />
        </p>
        <div className="relative">
          <TargetMarker pulse className="absolute -top-4 left-1/2 hidden -translate-x-1/2 sm:inline-flex" />
          <h1 id="hero-heading" className="display-text text-[2.6rem] sm:text-6xl lg:text-[5.4rem]">
            Advancing Research in
            <br />
            <span className="text-primary">Artificial Intelligence</span>
            <br />
            and Blockchain.
          </h1>
        </div>
        <p className="mt-7 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg">
          Exploring trustworthy AI, decentralized systems, intelligent agents, and secure computing through
          research and applied innovation.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/research" className={primaryButton}>
            Explore Research
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/publications" className={secondaryButton}>
            View Publications
          </Link>
          <Link href="/projects" className={secondaryButton}>
            Discover Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
