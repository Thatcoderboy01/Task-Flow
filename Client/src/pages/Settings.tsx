import React from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Download,
  Trash2,
  Keyboard,
  Palette,
  Sun,
  Moon,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTheme } from '@/store/slices/uiSlice';
import { setTasks } from '@/store/slices/taskSlice';
import { exportTasksAsJSON } from '@/utils/exportUtils';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

/* ============================================================
 * Settings page — theme, export, data management, shortcuts
 * ============================================================ */

const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const tasks = useAppSelector((s) => s.tasks.tasks);

  const handleExport = () => {
    exportTasksAsJSON(tasks);
    toast.success('Tasks exported successfully');
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
      dispatch(setTasks([]));
      toast.success('All tasks cleared');
    }
  };

  const shortcuts = [
    { keys: ['Ctrl', 'N'], description: 'Create new task' },
    { keys: ['Ctrl', 'Z'], description: 'Undo last action' },
    { keys: ['/'], description: 'Focus search bar' },
    { keys: ['Esc'], description: 'Close modal / blur input' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon size={22} className="text-primary-500 sm:hidden" />
          <SettingsIcon size={24} className="text-primary-500 hidden sm:block" /> Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your TaskFlow experience.
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <Palette size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">
            Appearance
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => dispatch(setTheme('light'))}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
              theme === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <Sun size={20} className={theme === 'light' ? 'text-primary-500' : 'text-slate-400'} />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Light</p>
              <p className="text-xs text-slate-400">Bright & clean</p>
            </div>
          </button>

          <button
            onClick={() => dispatch(setTheme('dark'))}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl border-2 transition-all',
              theme === 'dark'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            )}
          >
            <Moon size={20} className={theme === 'dark' ? 'text-primary-500' : 'text-slate-400'} />
            <div className="text-left">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark</p>
              <p className="text-xs text-slate-400">Easy on the eyes</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Data management */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-4 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <Download size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">
            Data Management
          </h2>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60">
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Export Tasks
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                Download all {tasks.length} tasks as a JSON file
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download size={14} /> Export
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200/50 dark:border-red-800/30">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Clear All Tasks
              </p>
              <p className="text-xs text-red-400 dark:text-red-500 mt-0.5">
                Permanently delete all tasks. This action cannot be undone.
              </p>
            </div>
            <Button variant="danger" size="sm" onClick={handleClearAll}>
              <Trash2 size={14} /> Clear
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Keyboard shortcuts */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 sm:p-6"
      >
        <div className="flex items-center gap-3 mb-4 sm:mb-5">
          <Keyboard size={20} className="text-primary-500" />
          <h2 className="text-base font-semibold text-slate-800 dark:text-white">
            Keyboard Shortcuts
          </h2>
        </div>

        <div className="space-y-3">
          {shortcuts.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {s.description}
              </span>
              <div className="flex gap-1">
                {s.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer info */}
      <p className="text-center text-xs text-slate-400 dark:text-slate-600 pb-4">
        TaskFlow v1.0.0 — Built with React, Redux Toolkit, and Tailwind CSS
      </p>
    </div>
  );
};

export default Settings;
