import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Settings,
  User,
  X,
  Zap,
  ChevronLeft,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSidebarOpen, toggleSidebarCollapsed } from '@/store/slices/uiSlice';
import { cn } from '@/utils/helpers';

/* ============================================================
 * Sidebar — responsive navigation panel
 * ============================================================ */

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const sidebarOpen = useAppSelector((s) => s.ui.sidebarOpen);
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);
  const location = useLocation();

  const closeMobile = () => dispatch(setSidebarOpen(false));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={cn('flex items-center gap-3 px-5 py-6', collapsed && 'justify-center px-3')}>
        <div className="flex items-center justify-center w-9 h-9 rounded-xl gradient-primary shadow-lg shadow-primary-500/30">
          <Zap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            TaskFlow
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobile}
              className={cn(
                'relative flex items-center gap-3 px-3 py-3 lg:py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]',
                collapsed && 'justify-center px-2',
                isActive
                  ? 'text-primary-700 dark:text-primary-400'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200/60 dark:border-primary-500/20"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <item.icon size={20} className="relative z-10 flex-shrink-0" />
              {!collapsed && <span className="relative z-10">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse button (desktop only) */}
      <div className="hidden lg:flex px-3 pb-4">
        <button
          onClick={() => dispatch(toggleSidebarCollapsed())}
          className="flex items-center justify-center w-full gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft
            size={18}
            className={cn('transition-transform duration-300', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>

      {/* Keyboard shortcuts hint — hidden on mobile drawer */}
      {!collapsed && (
        <div className="hidden lg:block px-5 pb-5">
          <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
              Shortcuts
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>New task</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono shadow-sm border border-slate-200 dark:border-slate-600">
                Ctrl+N
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono shadow-sm border border-slate-200 dark:border-slate-600">
                /
              </kbd>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Undo</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-[10px] font-mono shadow-sm border border-slate-200 dark:border-slate-600">
                Ctrl+Z
              </kbd>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-30 glass-sidebar transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 glass-sidebar lg:hidden"
            >
              <button
                onClick={closeMobile}
                className="absolute top-4 right-4 p-2.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X size={20} />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
