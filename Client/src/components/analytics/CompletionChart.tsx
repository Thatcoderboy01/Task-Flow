import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { selectCompletionTrend } from '@/store/selectors';

/* ============================================================
 * CompletionChart — donut chart showing status distribution
 * ============================================================ */

const COLORS = ['#64748b', '#3b82f6', '#10b981'];

const CompletionChart: React.FC = () => {
  const data = useAppSelector(selectCompletionTrend);

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 sm:mb-4">
        Task Status Distribution
      </h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="35%"
              outerRadius="55%"
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: 'none',
                borderRadius: '12px',
                color: '#f1f5f9',
                fontSize: '13px',
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompletionChart;
