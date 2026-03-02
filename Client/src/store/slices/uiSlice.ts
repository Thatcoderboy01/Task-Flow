import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { type Theme, type TaskFilter, type AppNotification } from '@/types';
import { sampleNotifications } from '@/data/sampleData';

/* ============================================================
 * UI slice — theme, sidebar, search, filters, selections, modals
 * ============================================================ */

interface UIState {
  theme: Theme;
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  searchQuery: string;
  activeModal: 'addTask' | 'editTask' | null;
  editingTaskId: string | null;
  filter: TaskFilter;
  selectedTasks: string[];
  notifications: AppNotification[];
}

const loadTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('taskflow_theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const initialFilter: TaskFilter = {
  status: 'all',
  priority: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  tags: [],
};

const initialState: UIState = {
  theme: loadTheme(),
  sidebarOpen: false,
  sidebarCollapsed: false,
  searchQuery: '',
  activeModal: null,
  editingTaskId: null,
  filter: initialFilter,
  selectedTasks: [],
  notifications: sampleNotifications,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      localStorage.setItem('taskflow_theme', action.payload);
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('taskflow_theme', state.theme);
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebarCollapsed(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    openAddTaskModal(state) {
      state.activeModal = 'addTask';
      state.editingTaskId = null;
    },
    openEditTaskModal(state, action: PayloadAction<string>) {
      state.activeModal = 'editTask';
      state.editingTaskId = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
      state.editingTaskId = null;
    },
    setFilter(state, action: PayloadAction<Partial<TaskFilter>>) {
      state.filter = { ...state.filter, ...action.payload };
    },
    resetFilters(state) {
      state.filter = initialFilter;
    },
    toggleTaskSelection(state, action: PayloadAction<string>) {
      const idx = state.selectedTasks.indexOf(action.payload);
      if (idx !== -1) {
        state.selectedTasks.splice(idx, 1);
      } else {
        state.selectedTasks.push(action.payload);
      }
    },
    selectAllTasks(state, action: PayloadAction<string[]>) {
      state.selectedTasks = action.payload;
    },
    clearSelection(state) {
      state.selectedTasks = [];
    },
    markNotificationRead(state, action: PayloadAction<string>) {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) n.read = true;
    },
    markAllNotificationsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    addNotification(
      state,
      action: PayloadAction<Omit<AppNotification, 'id' | 'createdAt' | 'read'>>
    ) {
      state.notifications.unshift({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        read: false,
      });
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSearchQuery,
  openAddTaskModal,
  openEditTaskModal,
  closeModal,
  setFilter,
  resetFilters,
  toggleTaskSelection,
  selectAllTasks,
  clearSelection,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
