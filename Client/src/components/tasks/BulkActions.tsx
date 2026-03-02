import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, CheckCircle2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteTasksAsync, bulkUpdateStatusAsync } from '@/store/slices/taskSlice';
import { clearSelection } from '@/store/slices/uiSlice';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

/* ============================================================
 * BulkActions — floating bar shown when tasks are selected
 * ============================================================ */

const BulkActions: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTasks = useAppSelector((s) => s.ui.selectedTasks);
  const count = selectedTasks.length;
  const isVisible = count > 0;

  const handleBulkDelete = () => {
    dispatch(deleteTasksAsync(selectedTasks));
    dispatch(clearSelection());
    toast.success(`${count} task${count > 1 ? 's' : ''} deleted`);
  };

  const handleBulkComplete = () => {
    dispatch(bulkUpdateStatusAsync({ ids: selectedTasks, status: 'completed' }));
    dispatch(clearSelection());
    toast.success(`${count} task${count > 1 ? 's' : ''} marked complete`);
  };

  const handleClear = () => {
    dispatch(clearSelection());
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-900 dark:bg-white shadow-2xl max-w-[calc(100vw-2rem)] safe-bottom"
        >
          <span className="text-sm font-medium text-white dark:text-slate-900">
            {count} selected
          </span>

          <div className="w-px h-5 bg-slate-700 dark:bg-slate-300" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBulkComplete}
            className="text-emerald-400 hover:text-emerald-300 dark:text-emerald-600 dark:hover:text-emerald-700 hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            <CheckCircle2 size={16} /> Complete
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBulkDelete}
            className="text-red-400 hover:text-red-300 dark:text-red-600 dark:hover:text-red-700 hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            <Trash2 size={16} /> Delete
          </Button>

          <button
            onClick={handleClear}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 dark:text-slate-400 dark:hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BulkActions;
