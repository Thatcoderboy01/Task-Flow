import React from 'react';
import { cn } from '@/utils/helpers';

/* ============================================================
 * SkeletonLoader — animated shimmer placeholder
 * ============================================================ */

interface SkeletonProps {
  className?: string;
}

/** Base skeleton bar */
export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'rounded-xl bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-shimmer bg-[length:200%_100%]',
      className
    )}
  />
);

/** Skeleton for a single task card */
export const SkeletonCard: React.FC = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-5 w-16" />
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

/** Skeleton for the full page (3 cards + header) */
export const SkeletonPage: React.FC = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    <Skeleton className="h-8 w-60" />
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
    <div className="space-y-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

export default Skeleton;
