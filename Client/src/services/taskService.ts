import api from './api';
import { type Task } from '@/types';

/* ============================================================
 * Task service — API calls for task CRUD
 * ============================================================ */

/** Shape returned by the API for a single task */
export interface ApiTask {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string | null;
  tags: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

/** Normalise API Task into the frontend Task shape */
const normaliseTask = (t: ApiTask): Task => ({
  id: t.id,
  title: t.title,
  description: t.description,
  priority: t.priority,
  status: t.status,
  dueDate: t.dueDate,
  tags: t.tags,
  order: t.order,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority?: string;
  status?: string;
  dueDate?: string | null;
  tags?: string[];
}

const taskService = {
  /** Fetch all tasks for the authenticated user */
  getAll: async (): Promise<Task[]> => {
    const res = await api.get('/tasks');
    return res.data.tasks.map(normaliseTask);
  },

  /** Create a new task */
  create: async (data: CreateTaskPayload): Promise<Task> => {
    const res = await api.post('/tasks', data);
    return normaliseTask(res.data.task);
  },

  /** Update an existing task */
  update: async (id: string, updates: Partial<CreateTaskPayload>): Promise<Task> => {
    const res = await api.put(`/tasks/${id}`, updates);
    return normaliseTask(res.data.task);
  },

  /** Delete a single task */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },

  /** Bulk delete tasks */
  bulkDelete: async (ids: string[]): Promise<void> => {
    await api.post('/tasks/bulk-delete', { ids });
  },

  /** Bulk mark tasks as completed */
  bulkUpdateStatus: async (ids: string[], status: string): Promise<void> => {
    await api.post('/tasks/bulk-status', { ids, status });
  },

  /** Reorder tasks after drag-and-drop */
  reorder: async (orderedIds: string[]): Promise<void> => {
    await api.post('/tasks/reorder', { orderedIds });
  },
};

export default taskService;
