import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  GripVertical,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { type Task } from '@/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteTaskAsync, toggleTaskStatus, updateTaskAsync } from '@/store/slices/taskSlice';
import { openEditTaskModal, toggleTaskSelection } from '@/store/slices/uiSlice';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/utils/constants';
import { formatDate, getDueStatus, cn } from '@/utils/helpers';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

/* ============================================================
 * TaskCard — individual task with DnD, priority badge, actions
 * ============================================================ */

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const dispatch = useAppDispatch();
  const selectedTasks = useAppSelector((s) => s.ui.selectedTasks);
  const isSelected = selectedTasks.includes(task.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const statusCfg = STATUS_CONFIG[task.status];
  const dueStatus = useMemo(() => getDueStatus(task.dueDate), [task.dueDate]);

  const handleDelete = useCallback(() => {
    dispatch(deleteTaskAsync(task.id));
    toast.success('Task deleted');
  }, [dispatch, task.id]);

  const handleToggle = useCallback(() => {
    dispatch(toggleTaskStatus(task.id));
    // Also sync to the server
    dispatch(updateTaskAsync({ id: task.id, updates: { status: task.status === 'completed' ? 'todo' : 'completed' } }));
    toast.success(
      task.status === 'completed' ? 'Task reopened' : 'Task completed!'
    );
  }, [dispatch, task.id, task.status]);

  const handleEdit = useCallback(() => {
    dispatch(openEditTaskModal(task.id));
  }, [dispatch, task.id]);

  const handleSelect = useCallback(() => {
    dispatch(toggleTaskSelection(task.id));
  }, [dispatch, task.id]);

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group glass-card p-3 sm:p-4 hover:shadow-xl hover:shadow-slate-200/40 dark:hover:shadow-slate-900/40 transition-all duration-200',
        isDragging && 'opacity-50 shadow-2xl scale-[1.02]',
        isSelected && 'ring-2 ring-primary-500/50 bg-primary-50/30 dark:bg-primary-500/5',
        task.status === 'completed' && 'opacity-75'
      )}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        {/* Drag handle — always visible on touch, hover on desktop */}
        <button
          className="mt-1 p-1 sm:p-0.5 rounded text-slate-300 dark:text-slate-600 hover:text-slate-400 dark:hover:text-slate-500 cursor-grab active:cursor-grabbing opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity touch-manipulation min-w-[28px] min-h-[28px] flex items-center justify-center"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={16} />
        </button>

        {/* Checkbox */}
        <button onClick={handleSelect} className="mt-0.5 flex-shrink-0 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center touch-manipulation">
          {isSelected ? (
            <CheckCircle2 size={20} className="text-primary-500" />
          ) : (
            <Circle size={20} className="text-slate-300 dark:text-slate-600" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3
                className={cn(
                  'font-semibold text-slate-800 dark:text-slate-100 truncate',
                  task.status === 'completed' && 'line-through text-slate-400 dark:text-slate-500'
                )}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions — always visible on touch, hover on desktop */}
            <div className="flex items-center gap-0.5 sm:gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={handleToggle}
                title={task.status === 'completed' ? 'Reopen' : 'Complete'}
                className={cn(
                  'p-2 sm:p-1.5 rounded-lg transition-colors min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-manipulation',
                  task.status === 'completed'
                    ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                )}
              >
                <CheckCircle2 size={16} />
              </button>
              <button
                onClick={handleEdit}
                title="Edit task"
                className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-manipulation"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={handleDelete}
                title="Delete task"
                className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center touch-manipulation"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {/* Priority */}
            <Badge
              colorClasses={`${priorityCfg.bgColor} ${priorityCfg.darkBgColor} ${priorityCfg.color}`}
              dot
              dotColor={priorityCfg.dotColor}
            >
              {priorityCfg.label}
            </Badge>

            {/* Status */}
            <Badge
              colorClasses={`${statusCfg.bgColor} ${statusCfg.darkBgColor} ${statusCfg.color}`}
            >
              {statusCfg.label}
            </Badge>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs',
                  dueStatus.isOverdue
                    ? 'text-red-600 dark:text-red-400 font-medium'
                    : dueStatus.urgency === 'high'
                    ? 'text-orange-600 dark:text-orange-400'
                    : 'text-slate-400 dark:text-slate-500'
                )}
              >
                {dueStatus.urgency === 'high' ? (
                  <Clock size={12} />
                ) : (
                  <Calendar size={12} />
                )}
                {dueStatus.label}
              </span>
            )}

            {/* Tags */}
            {task.tags.map((tag) => (
              <Badge key={tag} className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Created at */}
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-600">
            Created {formatDate(task.createdAt)}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(TaskCard);
