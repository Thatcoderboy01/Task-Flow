import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import { PRIORITY_ORDER } from '@/utils/constants';
import {
  isPast,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  subWeeks,
  format,
} from 'date-fns';

/* ============================================================
 * Memoised selectors — derived data computed from the store
 * ============================================================ */

const selectTasks = (state: RootState) => state.tasks.tasks;
const selectFilter = (state: RootState) => state.ui.filter;
const selectSearchQuery = (state: RootState) => state.ui.searchQuery;

/** Filtered + sorted task list based on active UI filters & search query */
export const selectFilteredTasks = createSelector(
  [selectTasks, selectFilter, selectSearchQuery],
  (tasks, filter, searchQuery) => {
    let result = [...tasks];

    // Full-text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Status filter
    if (filter.status !== 'all') {
      result = result.filter((t) => t.status === filter.status);
    }

    // Priority filter
    if (filter.priority !== 'all') {
      result = result.filter((t) => t.priority === filter.priority);
    }

    // Tag filter
    if (filter.tags.length > 0) {
      result = result.filter((t) => filter.tags.some((tag) => t.tags.includes(tag)));
    }

    // Sorting
    result.sort((a, b) => {
      let cmp = 0;
      switch (filter.sortBy) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'priority':
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          break;
        case 'dueDate': {
          const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          cmp = da - db;
          break;
        }
        case 'createdAt':
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return filter.sortOrder === 'asc' ? cmp : -cmp;
    });

    return result;
  }
);

/** Aggregate statistics derived from all tasks */
export const selectTaskStats = createSelector([selectTasks], (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const todo = tasks.filter((t) => t.status === 'todo').length;
  const overdue = tasks.filter(
    (t) => t.status !== 'completed' && t.dueDate && isPast(new Date(t.dueDate))
  ).length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, inProgress, todo, overdue, completionRate };
});

/** Data for the priority distribution pie chart */
export const selectPriorityDistribution = createSelector([selectTasks], (tasks) => [
  { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length, fill: '#10b981' },
  { name: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, fill: '#f59e0b' },
  { name: 'High', value: tasks.filter((t) => t.priority === 'high').length, fill: '#f97316' },
  { name: 'Critical', value: tasks.filter((t) => t.priority === 'critical').length, fill: '#ef4444' },
]);

/** Data for the weekly productivity bar chart (last 6 weeks) */
export const selectWeeklyProductivity = createSelector([selectTasks], (tasks) => {
  const weeks = [];
  for (let i = 5; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i));
    const weekEnd = endOfWeek(subWeeks(new Date(), i));
    const label = format(weekStart, 'MMM d');

    const created = tasks.filter((t) =>
      isWithinInterval(new Date(t.createdAt), { start: weekStart, end: weekEnd })
    ).length;

    const completed = tasks.filter(
      (t) =>
        t.status === 'completed' &&
        isWithinInterval(new Date(t.updatedAt), { start: weekStart, end: weekEnd })
    ).length;

    weeks.push({ week: label, created, completed });
  }
  return weeks;
});

/** Status breakdown for completion trend charts */
export const selectCompletionTrend = createSelector([selectTasks], (tasks) => [
  { name: 'To Do', value: tasks.filter((t) => t.status === 'todo').length },
  { name: 'In Progress', value: tasks.filter((t) => t.status === 'in-progress').length },
  { name: 'Completed', value: tasks.filter((t) => t.status === 'completed').length },
]);

/** Whether undo is available */
export const selectCanUndo = (state: RootState) => state.tasks.history.length > 0;

/** Count of unread notifications */
export const selectUnreadNotificationCount = createSelector(
  [(state: RootState) => state.ui.notifications],
  (notifications) => notifications.filter((n) => !n.read).length
);
