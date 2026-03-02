import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Task } from '@/types';
import taskService from '@/services/taskService';

/* ============================================================
 * Task slice — API-driven CRUD, bulk actions, reorder, undo
 * ============================================================ */

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  /** Stack of previous task snapshots for undo support (local only) */
  history: Task[][];
}

const MAX_HISTORY = 20;

/** Push a deep-copy snapshot of the current tasks onto the undo stack */
const pushHistory = (state: TaskState) => {
  state.history.push(state.tasks.map((t) => ({ ...t, tags: [...t.tags] })));
  if (state.history.length > MAX_HISTORY) state.history.shift();
};

/* ─────────────── ASYNC THUNKS ─────────────── */

/** Fetch all tasks for the authenticated user */
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await taskService.getAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load tasks');
    }
  }
);

/** Create a new task */
export const createTask = createAsyncThunk(
  'tasks/create',
  async (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>, { rejectWithValue }) => {
    try {
      return await taskService.create(data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

/** Update an existing task */
export const updateTaskAsync = createAsyncThunk(
  'tasks/update',
  async ({ id, updates }: { id: string; updates: Partial<Task> }, { rejectWithValue }) => {
    try {
      return await taskService.update(id, updates);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

/** Delete a single task */
export const deleteTaskAsync = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

/** Delete multiple tasks */
export const deleteTasksAsync = createAsyncThunk(
  'tasks/bulkDelete',
  async (ids: string[], { rejectWithValue }) => {
    try {
      await taskService.bulkDelete(ids);
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tasks');
    }
  }
);

/** Bulk update status for multiple tasks */
export const bulkUpdateStatusAsync = createAsyncThunk(
  'tasks/bulkStatus',
  async (
    { ids, status }: { ids: string[]; status: Task['status'] },
    { rejectWithValue }
  ) => {
    try {
      await taskService.bulkUpdateStatus(ids, status);
      return { ids, status };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update tasks');
    }
  }
);

/** Reorder tasks after drag-and-drop */
export const reorderTasksAsync = createAsyncThunk(
  'tasks/reorder',
  async (orderedIds: string[], { rejectWithValue }) => {
    try {
      await taskService.reorder(orderedIds);
      return orderedIds;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reorder tasks');
    }
  }
);

/* ─────────────── INITIAL STATE ─────────────── */

const initialState: TaskState = {
  tasks: [],
  isLoading: false,
  error: null,
  history: [],
};

/* ─────────────── SLICE ─────────────── */

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    /** Optimistic local toggle (for instant UI feedback) */
    toggleTaskStatus(state, action: PayloadAction<string>) {
      pushHistory(state);
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) {
        task.status = task.status === 'completed' ? 'todo' : 'completed';
        task.updatedAt = new Date().toISOString();
      }
    },

    /** Optimistic local reorder (for instant drag feedback) */
    reorderTasks(state, action: PayloadAction<{ activeId: string; overId: string }>) {
      const oldIdx = state.tasks.findIndex((t) => t.id === action.payload.activeId);
      const newIdx = state.tasks.findIndex((t) => t.id === action.payload.overId);
      if (oldIdx !== -1 && newIdx !== -1) {
        const [moved] = state.tasks.splice(oldIdx, 1);
        state.tasks.splice(newIdx, 0, moved);
        state.tasks.forEach((t, i) => {
          t.order = i;
        });
      }
    },

    /** Undo the last destructive action (local only — restores previous snapshot) */
    undoLastAction(state) {
      if (state.history.length > 0) {
        state.tasks = state.history.pop()!;
      }
    },

    /** Replace task list entirely */
    setTasks(state, action: PayloadAction<Task[]>) {
      pushHistory(state);
      state.tasks = action.payload;
    },

    /** Clear all tasks (used on logout) */
    clearTasks(state) {
      state.tasks = [];
      state.history = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // FETCH ALL
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // CREATE
    builder
      .addCase(createTask.pending, (state) => {
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        pushHistory(state);
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // UPDATE
    builder
      .addCase(updateTaskAsync.fulfilled, (state, action) => {
        pushHistory(state);
        const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (idx !== -1) state.tasks[idx] = action.payload;
      })
      .addCase(updateTaskAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // DELETE SINGLE
    builder.addCase(deleteTaskAsync.fulfilled, (state, action) => {
      pushHistory(state);
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    });

    // BULK DELETE
    builder.addCase(deleteTasksAsync.fulfilled, (state, action) => {
      pushHistory(state);
      const ids = new Set(action.payload);
      state.tasks = state.tasks.filter((t) => !ids.has(t.id));
    });

    // BULK STATUS
    builder.addCase(bulkUpdateStatusAsync.fulfilled, (state, action) => {
      pushHistory(state);
      const { ids, status } = action.payload;
      const idSet = new Set(ids);
      const now = new Date().toISOString();
      state.tasks.forEach((t) => {
        if (idSet.has(t.id)) {
          t.status = status;
          t.updatedAt = now;
        }
      });
    });

    // REORDER (server confirmation — no extra action needed, optimistic already applied)
    builder.addCase(reorderTasksAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const {
  toggleTaskStatus,
  reorderTasks,
  undoLastAction,
  setTasks,
  clearTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
