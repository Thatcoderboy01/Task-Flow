import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import StatsCards from '@/components/analytics/StatsCards';
import CompletionChart from '@/components/analytics/CompletionChart';
import ProductivityGraph from '@/components/analytics/ProductivityGraph';
import PriorityPieChart from '@/components/analytics/PriorityPieChart';

/* ============================================================
 * Analytics page — charts and statistics
 * ============================================================ */

const Analytics: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 size={22} className="text-primary-500 sm:hidden" />
          <BarChart3 size={24} className="text-primary-500 hidden sm:block" /> Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Track your productivity and task metrics.
        </p>
      </motion.div>

      {/* Stats */}
      <StatsCards />

      {/* Charts grid */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProductivityGraph />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CompletionChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="md:col-span-2 lg:col-span-1"
        >
          <PriorityPieChart />
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
