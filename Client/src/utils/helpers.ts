import {
  formatDistanceToNow,
  isPast,
  differenceInDays,
  differenceInHours,
} from 'date-fns';

/* ============================================================
 * Pure helper utilities – no side effects, fully testable
 * ============================================================ */

/** Generate a unique ID using timestamp + random suffix */
export const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

/** Format an ISO date string to a short human-readable form */
export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

/** Return a relative time label like "3 days ago" */
export const getRelativeTime = (dateString: string): string =>
  formatDistanceToNow(new Date(dateString), { addSuffix: true });

/** Analyse a due date and return a human label + urgency level */
export const getDueStatus = (
  dueDate: string | null
): { label: string; isOverdue: boolean; urgency: 'none' | 'low' | 'medium' | 'high' } => {
  if (!dueDate) return { label: 'No due date', isOverdue: false, urgency: 'none' };

  const due = new Date(dueDate);
  const now = new Date();

  if (isPast(due)) {
    return {
      label: `Overdue by ${formatDistanceToNow(due)}`,
      isOverdue: true,
      urgency: 'high',
    };
  }

  const daysLeft = differenceInDays(due, now);
  const hoursLeft = differenceInHours(due, now);

  if (hoursLeft < 24) {
    return { label: `Due in ${hoursLeft}h`, isOverdue: false, urgency: 'high' };
  }
  if (daysLeft <= 3) {
    return { label: `Due in ${daysLeft}d`, isOverdue: false, urgency: 'medium' };
  }
  return { label: `Due in ${daysLeft}d`, isOverdue: false, urgency: 'low' };
};

/** Merge class names, filtering falsy values */
export const cn = (...classes: (string | boolean | undefined | null)[]): string =>
  classes.filter(Boolean).join(' ');
