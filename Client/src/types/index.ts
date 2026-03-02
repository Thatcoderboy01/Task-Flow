/* ============================================================
 * Types — Central type definitions for the TaskFlow application
 * ============================================================ */

/** Task priority levels ordered by severity */
export type Priority = 'low' | 'medium' | 'high' | 'critical';

/** Task workflow status */
export type Status = 'todo' | 'in-progress' | 'completed';

/** Application color theme */
export type Theme = 'light' | 'dark';

/** Available sort fields for task lists */
export type SortField = 'createdAt' | 'priority' | 'dueDate' | 'title';

/** Sort direction */
export type SortOrder = 'asc' | 'desc';

/** Core task entity */
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  order: number;
}

/** Active filter configuration for task list views */
export interface TaskFilter {
  status: Status | 'all';
  priority: Priority | 'all';
  sortBy: SortField;
  sortOrder: SortOrder;
  tags: string[];
}

/** In-app notification */
export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

/** Form values used by the task creation / edit form */
export interface TaskFormValues {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: string;
  tags: string[];
}

/** Navigation route definition */
export interface NavRoute {
  path: string;
  label: string;
  icon: string;
}
