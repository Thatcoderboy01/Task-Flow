import React from 'react';
import { Filter, ArrowUpDown, X, Tag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilter, resetFilters } from '@/store/slices/uiSlice';
import { type Priority, type Status, type SortField, type SortOrder } from '@/types';
import { AVAILABLE_TAGS } from '@/utils/constants';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';

/* ============================================================
 * TaskFilters — status, priority, sort, and tag filter controls
 * ============================================================ */

const statusOptions: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: 'Created' },
  { value: 'dueDate', label: 'Due Date' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

const TaskFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((s) => s.ui.filter);

  const hasActiveFilters =
    filter.status !== 'all' ||
    filter.priority !== 'all' ||
    filter.tags.length > 0;

  const chipBase =
    'px-3 py-2 sm:py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer whitespace-nowrap min-h-[36px] sm:min-h-0 flex items-center justify-center touch-manipulation';
  const chipInactive =
    'bg-white dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600';
  const chipActive =
    'bg-primary-100 dark:bg-primary-500/15 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-500/30';

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Status + Priority row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => dispatch(setFilter({ status: opt.value }))}
                className={cn(chipBase, filter.status === opt.value ? chipActive : chipInactive)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />

        {/* Priority */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => dispatch(setFilter({ priority: opt.value }))}
                className={cn(chipBase, filter.priority === opt.value ? chipActive : chipInactive)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sort + Tags row */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <ArrowUpDown size={14} className="text-slate-400 flex-shrink-0" />
          <select
            value={filter.sortBy}
            onChange={(e) => dispatch(setFilter({ sortBy: e.target.value as SortField }))}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 outline-none focus:border-primary-400"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              dispatch(
                setFilter({
                  sortOrder: (filter.sortOrder === 'asc' ? 'desc' : 'asc') as SortOrder,
                })
              )
            }
            className={cn(
              chipBase,
              chipInactive,
              'flex items-center gap-1'
            )}
          >
            {filter.sortOrder === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />

        {/* Tags */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          <Tag size={14} className="text-slate-400 flex-shrink-0" />
          {AVAILABLE_TAGS.slice(0, 6).map((tag) => {
            const active = filter.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() =>
                  dispatch(
                    setFilter({
                      tags: active
                        ? filter.tags.filter((t) => t !== tag)
                        : [...filter.tags, tag],
                    })
                  )
                }
                className={cn(chipBase, active ? chipActive : chipInactive)}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Reset */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(resetFilters())}
            className="text-red-500 hover:text-red-600"
          >
            <X size={14} /> Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
