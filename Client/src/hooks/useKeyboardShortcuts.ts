import { useEffect, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { openAddTaskModal } from '@/store/slices/uiSlice';
import { undoLastAction } from '@/store/slices/taskSlice';

/**
 * Global keyboard shortcuts.
 *
 * - Ctrl/⌘ + N → open "Add Task" modal
 * - Ctrl/⌘ + Z → undo last action
 * - /          → focus the search input
 * - Escape     → blur active input
 */
export function useKeyboardShortcuts(): void {
  const dispatch = useAppDispatch();

  const handler = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // Allow Escape inside inputs to blur
      if (isInput) {
        if (e.key === 'Escape') (target as HTMLInputElement).blur();
        return;
      }

      const mod = e.ctrlKey || e.metaKey;

      if (mod && e.key === 'n') {
        e.preventDefault();
        dispatch(openAddTaskModal());
      }

      if (mod && e.key === 'z') {
        e.preventDefault();
        dispatch(undoLastAction());
      }

      if (e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handler]);
}
