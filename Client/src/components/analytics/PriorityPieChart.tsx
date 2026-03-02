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
import { selectPriorityDistribution } from '@/store/selectors';

/* ============================================================
 * PriorityPieChart — pie chart of task priority distribution
 * ============================================================ */

const PriorityPieChart: React.FC = () => {
  const data = useAppSelector(selectPriorityDistribution);

  return (
    <div className="glass-card p-4 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 sm:mb-4">
        Priority Distribution
      </h3>
      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius="55%"
              innerRadius="25%"
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, idx) => (
                <Cell key={idx} fill={entry.fill} />
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

export default PriorityPieChart;
