import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Undo2,
  Download,
  Check,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  setSidebarOpen,
  setSearchQuery,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/store/slices/uiSlice';
import { undoLastAction } from '@/store/slices/taskSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { clearTasks } from '@/store/slices/taskSlice';
import { selectCanUndo, selectUnreadNotificationCount } from '@/store/selectors';
import { exportTasksAsJSON } from '@/utils/exportUtils';
import { useDebounce } from '@/hooks/useDebounce';
import { getRelativeTime, cn } from '@/utils/helpers';
import ThemeToggle from '@/components/ui/ThemeToggle';
import toast from 'react-hot-toast';

/* ============================================================
 * TopNavbar — search, notifications, profile, actions
 * ============================================================ */

const TopNavbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tasks = useAppSelector((s) => s.tasks.tasks);
  const canUndo = useAppSelector(selectCanUndo);
  const unreadCount = useAppSelector(selectUnreadNotificationCount);
  const notifications = useAppSelector((s) => s.ui.notifications);
  const user = useAppSelector((s) => s.auth.user);

  const [localSearch, setLocalSearch] = useState('');
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const notifsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch));
  }, [debouncedSearch, dispatch]);

  // Close dropdowns on outside click
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (notifsRef.current && !notifsRef.current.contains(e.target as Node)) {
      setShowNotifs(false);
    }
    if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
      setShowProfile(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  const handleUndo = () => {
    dispatch(undoLastAction());
    toast.success('Action undone');
  };

  const handleExport = () => {
    exportTasksAsJSON(tasks);
    toast.success('Tasks exported as JSON');
  };

  return (
    <header className="sticky top-0 z-20 glass border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 lg:px-6">
        {/* Left: hamburger + search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1">
          <button
            onClick={() => dispatch(setSidebarOpen(true))}
            className="lg:hidden p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Menu size={20} />
          </button>

          {/* Desktop search */}
          <div className="relative max-w-md w-full hidden sm:block">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              data-search-input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search tasks… (press /)"
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
            />
          </div>

          {/* Mobile search toggle */}
          <button
            onClick={() => setShowMobileSearch((v) => !v)}
            className="sm:hidden p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo last action (Ctrl+Z)"
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:pointer-events-none min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Undo2 size={18} />
          </button>

          {/* Export — hidden on very small screens */}
          <button
            onClick={handleExport}
            title="Export tasks as JSON"
            className="hidden xs:flex p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] items-center justify-center"
          >
            <Download size={18} />
          </button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div ref={notifsRef} className="relative">
            <button
              onClick={() => setShowNotifs((v) => !v)}
              className="relative p-2.5 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifs && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] sm:w-80 max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                      Notifications
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={() => dispatch(markAllNotificationsRead())}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => dispatch(markNotificationRead(n.id))}
                        className={cn(
                          'flex items-start gap-3 w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors',
                          !n.read && 'bg-primary-50/40 dark:bg-primary-500/5'
                        )}
                      >
                        <div
                          className={cn(
                            'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                            n.type === 'success' && 'bg-emerald-500',
                            n.type === 'warning' && 'bg-amber-500',
                            n.type === 'error' && 'bg-red-500',
                            n.type === 'info' && 'bg-blue-500'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-700 dark:text-slate-200 leading-snug">
                            {n.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {getRelativeTime(n.createdAt)}
                          </p>
                        </div>
                        {n.read && <Check size={14} className="text-slate-300 mt-1" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setShowProfile((v) => !v)}
              className="ml-0.5 sm:ml-1 flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] justify-center"
            >
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md shadow-primary-500/20">
                <User size={16} className="text-white" />
              </div>
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="font-medium text-sm text-slate-800 dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-slate-400">{user?.email || ''}</p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate('/profile');
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors min-h-[44px]"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        dispatch(clearTasks());
                        dispatch(logoutUser());
                        setShowProfile(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-h-[44px]"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile search bar — slides down below header */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="sm:hidden overflow-hidden border-t border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="px-3 py-2">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  data-search-input
                  type="text"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="Search tasks…"
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default TopNavbar;
