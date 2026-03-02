import React from 'react';
import { cn } from '@/utils/helpers';

/* ============================================================
 * Badge — small coloured label for priority / status / tags
 * ============================================================ */

interface BadgeProps {
  children: React.ReactNode;
  colorClasses?: string;
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-700/40 dark:text-slate-300',
  className,
  dot = false,
  dotColor = 'bg-slate-500',
}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
      colorClasses,
      className
    )}
  >
    {dot && <span className={cn('w-1.5 h-1.5 rounded-full', dotColor)} />}
    {children}
  </span>
);

export default Badge;
