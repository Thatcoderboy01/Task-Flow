import React from 'react';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/utils/helpers';

/* ============================================================
 * DashboardLayout — main shell with sidebar + content area
 * ============================================================ */

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const collapsed = useAppSelector((s) => s.ui.sidebarCollapsed);

  return (
    <div className="min-h-screen gradient-mesh">
      <Sidebar />

      {/* Main content area – offset by sidebar width */}
      <div
        className={cn(
          'transition-all duration-300',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        )}
      >
        <TopNavbar />
        <main className="p-3 sm:p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
