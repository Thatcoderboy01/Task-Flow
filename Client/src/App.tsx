import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { restoreSession } from '@/store/slices/authSlice';
import { fetchTasks } from '@/store/slices/taskSlice';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { SkeletonPage } from '@/components/ui/SkeletonLoader';

/* ============================================================
 * Lazy-loaded pages for code splitting
 * ============================================================ */

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Login = lazy(() => import('@/pages/Login'));
const Signup = lazy(() => import('@/pages/Signup'));

/* ============================================================
 * AppContent — inner shell that has access to the Redux store
 * ============================================================ */

function AppContent() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.ui.theme);
  const { user, isInitialised } = useAppSelector((s) => s.auth);

  // Restore session on app load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Fetch tasks whenever user becomes authenticated
  useEffect(() => {
    if (user) {
      dispatch(fetchTasks());
    }
  }, [user, dispatch]);

  // Sync the dark class on <html> whenever theme changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Register global keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <BrowserRouter>
      <Suspense fallback={<SkeletonPage />}>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes wrapped in DashboardLayout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<SkeletonPage />}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

/* ============================================================
 * App — root component with Redux Provider + global toast
 * ============================================================ */

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            '!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100 !shadow-2xl !border !border-slate-200 dark:!border-slate-700 !rounded-xl',
          duration: 3000,
          style: { fontSize: '14px' },
        }}
      />
    </Provider>
  );
}
