import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type CardGridSkeletonProps = {
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
};

export function CardGridSkeleton({ count = 6, columns = 3, className }: CardGridSkeletonProps) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns];
  return (
    <div className={cn("grid gap-5", cols, className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4 rounded-md border border-border bg-card p-6">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container-wide py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-3 w-40" />
      <Skeleton className="mt-6 h-12 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-5 w-3/4 max-w-xl" />
      <CardGridSkeleton className="mt-14" />
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="container-narrow py-16" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-3 w-48" />
      <Skeleton className="mt-6 h-12 w-full" />
      <Skeleton className="mt-3 h-12 w-4/5" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className={cn("h-4", index % 3 === 2 ? "w-2/3" : "w-full")} />
        ))}
      </div>
    </div>
  );
}
