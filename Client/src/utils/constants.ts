import { Priority, Status } from '@/types';

/* ============================================================
 * UI configuration maps for priorities, statuses, and tags
 * ============================================================ */

export const PRIORITY_CONFIG: Record<
  Priority,
  { label: string; color: string; bgColor: string; darkBgColor: string; dotColor: string }
> = {
  low: {
    label: 'Low',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100',
    darkBgColor: 'dark:bg-emerald-900/30',
    dotColor: 'bg-emerald-500',
  },
  medium: {
    label: 'Medium',
    color: 'text-amber-700 dark:text-amber-400',
    bgColor: 'bg-amber-100',
    darkBgColor: 'dark:bg-amber-900/30',
    dotColor: 'bg-amber-500',
  },
  high: {
    label: 'High',
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-100',
    darkBgColor: 'dark:bg-orange-900/30',
    dotColor: 'bg-orange-500',
  },
  critical: {
    label: 'Critical',
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900/30',
    dotColor: 'bg-red-500',
  },
};

export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; bgColor: string; darkBgColor: string }
> = {
  todo: {
    label: 'To Do',
    color: 'text-slate-700 dark:text-slate-300',
    bgColor: 'bg-slate-100',
    darkBgColor: 'dark:bg-slate-700/30',
  },
  'in-progress': {
    label: 'In Progress',
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900/30',
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-700 dark:text-emerald-400',
    bgColor: 'bg-emerald-100',
    darkBgColor: 'dark:bg-emerald-900/30',
  },
};

export const AVAILABLE_TAGS = [
  'Frontend',
  'Backend',
  'Design',
  'Bug',
  'Feature',
  'Documentation',
  'Testing',
  'DevOps',
  'Research',
  'Urgent',
] as const;

/** Numeric weight for sorting priorities (lower = more urgent) */
export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};
