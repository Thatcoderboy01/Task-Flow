import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type TaskFormValues, type Task } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTask, updateTaskAsync } from '@/store/slices/taskSlice';
import { closeModal } from '@/store/slices/uiSlice';
import { AVAILABLE_TAGS } from '@/utils/constants';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { cn } from '@/utils/helpers';
import toast from 'react-hot-toast';

/* ============================================================
 * Zod validation schema
 * ============================================================ */

const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be under 100 characters'),
  description: z.string().max(500, 'Description must be under 500 characters'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['todo', 'in-progress', 'completed']),
  dueDate: z.string(),
  tags: z.array(z.string()),
});

/* ============================================================
 * TaskForm — modal form for creating / editing tasks
 * ============================================================ */

const TaskForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((s) => s.ui.activeModal);
  const editingId = useAppSelector((s) => s.ui.editingTaskId);
  const tasks = useAppSelector((s) => s.tasks.tasks);

  const isOpen = activeModal === 'addTask' || activeModal === 'editTask';
  const isEditing = activeModal === 'editTask';

  const editingTask: Task | undefined = useMemo(
    () => (editingId ? tasks.find((t) => t.id === editingId) : undefined),
    [editingId, tasks]
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      dueDate: '',
      tags: [],
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditing && editingTask) {
      reset({
        title: editingTask.title,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate
          ? new Date(editingTask.dueDate).toISOString().split('T')[0]
          : '',
        tags: editingTask.tags,
      });
    } else if (!isEditing && isOpen) {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
        tags: [],
      });
    }
  }, [isEditing, editingTask, isOpen, reset]);

  const onSubmit = (data: TaskFormValues) => {
    const payload = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
    };

    if (isEditing && editingId) {
      dispatch(updateTaskAsync({ id: editingId, updates: payload }));
      toast.success('Task updated');
    } else {
      dispatch(createTask(payload));
      toast.success('Task created');
    }

    dispatch(closeModal());
  };

  const handleClose = () => dispatch(closeModal());

  const labelClasses =
    'block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5';
  const inputClasses =
    'w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all';
  const errorClasses = 'mt-1 text-xs text-red-500';

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className={labelClasses}>
            Title <span className="text-red-400">*</span>
          </label>
          <input
            {...register('title')}
            className={cn(inputClasses, errors.title && 'border-red-400')}
            placeholder="Enter task title"
          />
          {errors.title && (
            <p className={errorClasses}>{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className={cn(inputClasses, 'resize-none', errors.description && 'border-red-400')}
            placeholder="Optional description…"
          />
          {errors.description && (
            <p className={errorClasses}>{errors.description.message}</p>
          )}
        </div>

        {/* Priority + Status row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>Priority</label>
            <select {...register('priority')} className={inputClasses}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className={labelClasses}>Status</label>
            <select {...register('status')} className={inputClasses}>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Due date */}
        <div>
          <label className={labelClasses}>Due Date</label>
          <input type="date" {...register('dueDate')} className={inputClasses} />
        </div>

        {/* Tags */}
        <div>
          <label className={labelClasses}>Tags</label>
          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => {
                  const active = field.value.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        field.onChange(
                          active
                            ? field.value.filter((t: string) => t !== tag)
                            : [...field.value, tag]
                        );
                      }}
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                        active
                          ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-500/30'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
