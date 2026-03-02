import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useAppSelector } from '@/store/hooks';
import { selectWeeklyProductivity } from '@/store/selectors';

/* ============================================================
 * ProductivityGraph — weekly bar chart of created vs completed
 * ============================================================ */

const ProductivityGraph: React.FC = () => {
  const data = useAppSelector(selectWeeklyProductivity);

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 sm:mb-4">
        Weekly Productivity
      </h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="25%">
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(148,163,184,0.15)"
            />
            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#94a3b8' }}
              allowDecimals={false}
            />
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
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span className="text-xs text-slate-600 dark:text-slate-300">{value}</span>
              )}
            />
            <Bar
              dataKey="created"
              name="Created"
              fill="#8b5cf6"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductivityGraph;
