import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
} from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { selectTaskStats } from '@/store/selectors';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import ProgressRing from '@/components/ui/ProgressRing';

/* ============================================================
 * StatsCards — real-time statistics overview with animated values
 * ============================================================ */

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className="glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4"
  >
    <div
      className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${gradient} shadow-lg`}
    >
      {icon}
    </div>
    <div>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{label}</p>
      <AnimatedCounter
        target={value}
        className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white"
      />
    </div>
  </motion.div>
);

const StatsCards: React.FC = () => {
  const stats = useAppSelector(selectTaskStats);

  const cards = useMemo(
    () => [
      {
        label: 'Total Tasks',
        value: stats.total,
        icon: <ListTodo size={22} className="text-white" />,
        gradient: 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-500/30',
      },
      {
        label: 'Completed',
        value: stats.completed,
        icon: <CheckCircle2 size={22} className="text-white" />,
        gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/30',
      },
      {
        label: 'In Progress',
        value: stats.inProgress,
        icon: <Clock size={22} className="text-white" />,
        gradient: 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-500/30',
      },
      {
        label: 'Overdue',
        value: stats.overdue,
        icon: <AlertTriangle size={22} className="text-white" />,
        gradient: 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30',
      },
    ],
    [stats]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} delay={i * 0.08} />
      ))}

      {/* Completion progress card — spans 1 column on large screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
        className="glass-card p-4 sm:p-5 flex items-center gap-4 sm:gap-5 sm:col-span-2 lg:col-span-4"
      >
        <ProgressRing progress={stats.completionRate} size={64} strokeWidth={6} className="flex-shrink-0 sm:hidden" />
        <ProgressRing progress={stats.completionRate} size={72} strokeWidth={6} className="flex-shrink-0 hidden sm:block" />
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Overall Completion Rate
          </p>
          <p className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mt-0.5 truncate">
            {stats.completed} of {stats.total} tasks completed
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">
            {stats.todo} to do · {stats.inProgress} in progress · {stats.overdue} overdue
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default StatsCards;
