import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleTheme } from '@/store/slices/uiSlice';

/* ============================================================
 * ThemeToggle — animated sun/moon toggle switch
 * ============================================================ */

const ThemeToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
