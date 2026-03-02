import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { openAddTaskModal, selectAllTasks, clearSelection } from '@/store/slices/uiSlice';
import { selectFilteredTasks } from '@/store/selectors';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';
import TaskForm from '@/components/tasks/TaskForm';
import BulkActions from '@/components/tasks/BulkActions';
import Button from '@/components/ui/Button';

/* ============================================================
 * Tasks page — full task management with filters & bulk actions
 * ============================================================ */

const Tasks: React.FC = () => {
  const dispatch = useAppDispatch();
  const filteredTasks = useAppSelector(selectFilteredTasks);
  const selectedTasks = useAppSelector((s) => s.ui.selectedTasks);

  const taskIds = useMemo(() => filteredTasks.map((t) => t.id), [filteredTasks]);
  const allSelected = taskIds.length > 0 && selectedTasks.length === taskIds.length;

  const handleSelectAll = () => {
    if (allSelected) {
      dispatch(clearSelection());
    } else {
      dispatch(selectAllTasks(taskIds));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckSquare size={22} className="text-primary-500 sm:hidden" />
            <CheckSquare size={24} className="text-primary-500 hidden sm:block" /> Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} showing
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          {filteredTasks.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </Button>
          )}
          <Button onClick={() => dispatch(openAddTaskModal())}>
            <Plus size={18} /> New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-3 sm:p-4"
      >
        <TaskFilters />
      </motion.div>

      {/* Task list */}
      <TaskList />

      {/* Modals & overlays */}
      <TaskForm />
      <BulkActions />
    </div>
  );
};

export default Tasks;
