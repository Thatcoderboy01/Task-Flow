import React, { useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { AnimatePresence } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { store } from '@/store';
import { reorderTasks, reorderTasksAsync } from '@/store/slices/taskSlice';
import { selectFilteredTasks } from '@/store/selectors';
import TaskCard from './TaskCard';

/* ============================================================
 * TaskList — sortable list of TaskCards with DnD context
 * ============================================================ */

const TaskList: React.FC = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectFilteredTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        dispatch(
          reorderTasks({
            activeId: active.id as string,
            overId: over.id as string,
          })
        );
        // Sync order to server after optimistic local reorder
        setTimeout(() => {
          const orderedIds = store.getState().tasks.tasks.map((t) => t.id);
          dispatch(reorderTasksAsync(orderedIds));
        }, 0);
      }
    },
    [dispatch]
  );

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
          <Inbox size={28} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300">
          No tasks found
        </h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
          Create a new task or adjust your filters to see results here.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;
