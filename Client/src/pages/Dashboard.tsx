import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectTaskStats, selectFilteredTasks } from '@/store/selectors';
import { openAddTaskModal } from '@/store/slices/uiSlice';
import StatsCards from '@/components/analytics/StatsCards';
import CompletionChart from '@/components/analytics/CompletionChart';
import TaskCard from '@/components/tasks/TaskCard';
import TaskForm from '@/components/tasks/TaskForm';
import Button from '@/components/ui/Button';
import ProgressRing from '@/components/ui/ProgressRing';
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';

/* ============================================================
 * Dashboard page — overview with stats, recent tasks, charts
 * ============================================================ */

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector(selectTaskStats);
  const allTasks = useAppSelector((s) => s.tasks.tasks);

  // Show latest 5 non-completed tasks
  const recentTasks = useMemo(() => {
    return [...allTasks]
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [allTasks]);

  // Overdue tasks
  const overdueTasks = useMemo(() => {
    const now = new Date();
    return allTasks.filter(
      (t) => t.status !== 'completed' && t.dueDate && new Date(t.dueDate) < now
    );
  }, [allTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } })
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white"
          >
            Dashboard
          </motion.h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's your productivity overview.
          </p>
        </div>
        <Button onClick={() => dispatch(openAddTaskModal())} className="self-start sm:self-auto">
          <Plus size={18} /> New Task
        </Button>
      </div>

      {/* Stats cards */}
      <StatsCards />

      {/* Two-column layout */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Recent tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
              <Clock size={16} />
              Recent Tasks
            </h2>
            <span className="text-xs text-slate-400">
              {recentTasks.length} active
            </span>
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={() => {}}>
            <SortableContext items={recentTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
              </div>
            </SortableContext>
          </DndContext>

          {recentTasks.length === 0 && (
            <div className="glass-card p-8 text-center">
              <TrendingUp size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-400">All caught up! No active tasks.</p>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Completion chart */}
          <CompletionChart />

          {/* Overdue alert */}
          {overdueTasks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-4 sm:p-5 border-l-4 border-red-500"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={18} className="text-red-500" />
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-400">
                  Overdue Tasks
                </h3>
              </div>
              <ul className="space-y-2">
                {overdueTasks.slice(0, 3).map((t) => (
                  <li
                    key={t.id}
                    className="text-sm text-slate-600 dark:text-slate-300 truncate"
                  >
                    • {t.title}
                  </li>
                ))}
                {overdueTasks.length > 3 && (
                  <li className="text-xs text-slate-400">
                    +{overdueTasks.length - 3} more
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </div>
      </div>

      <TaskForm />
    </div>
  );
};

export default Dashboard;
