import { type Request, type Response } from 'express';
import Task from '../models/Task.js';
import catchAsync from '../utils/catchAsync.js';
import { NotFound, Forbidden } from '../utils/AppError.js';

/* ============================================================
 * Task Controller — CRUD operations, user-scoped
 * ============================================================ */

/* ─────────────── GET ALL TASKS ─────────────── */
export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const tasks = await Task.find({ userId: req.user!.id }).sort({ order: 1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks,
  });
});

/* ─────────────── CREATE TASK ─────────────── */
export const createTask = catchAsync(async (req: Request, res: Response) => {
  const { title, description, priority, status, dueDate, tags, order } = req.body;

  // Get the next order value
  const taskCount = await Task.countDocuments({ userId: req.user!.id });

  const task = await Task.create({
    userId: req.user!.id,
    title,
    description: description || '',
    priority: priority || 'medium',
    status: status || 'todo',
    dueDate: dueDate ? new Date(dueDate) : null,
    tags: tags || [],
    order: order ?? taskCount,
  });

  res.status(201).json({
    success: true,
    task,
  });
});

/* ─────────────── UPDATE TASK ─────────────── */
export const updateTask = catchAsync(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw NotFound('Task not found');
  }

  // Ensure task belongs to authenticated user
  if (task.userId.toString() !== req.user!.id) {
    throw Forbidden('You can only update your own tasks');
  }

  const { title, description, priority, status, dueDate, tags, order } = req.body;

  // Apply updates
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
  if (tags !== undefined) task.tags = tags;
  if (order !== undefined) task.order = order;

  await task.save();

  res.status(200).json({
    success: true,
    task,
  });
});

/* ─────────────── DELETE TASK ─────────────── */
export const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    throw NotFound('Task not found');
  }

  if (task.userId.toString() !== req.user!.id) {
    throw Forbidden('You can only delete your own tasks');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted',
  });
});

/* ─────────────── BULK DELETE TASKS ─────────────── */
export const bulkDeleteTasks = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw NotFound('No task IDs provided');
  }

  const result = await Task.deleteMany({
    _id: { $in: ids },
    userId: req.user!.id,
  });

  res.status(200).json({
    success: true,
    deletedCount: result.deletedCount,
  });
});

/* ─────────────── BULK UPDATE STATUS ─────────────── */
export const bulkUpdateStatus = catchAsync(async (req: Request, res: Response) => {
  const { ids, status } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw NotFound('No task IDs provided');
  }

  await Task.updateMany(
    { _id: { $in: ids }, userId: req.user!.id },
    { $set: { status, updatedAt: new Date() } }
  );

  res.status(200).json({
    success: true,
    message: `${ids.length} tasks updated`,
  });
});

/* ─────────────── REORDER TASKS ─────────────── */
export const reorderTasks = catchAsync(async (req: Request, res: Response) => {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    throw NotFound('No ordered IDs provided');
  }

  // Bulk write to update all order fields
  const bulkOps = orderedIds.map((id: string, index: number) => ({
    updateOne: {
      filter: { _id: id, userId: req.user!.id },
      update: { $set: { order: index } },
    },
  }));

  await Task.bulkWrite(bulkOps);

  res.status(200).json({
    success: true,
    message: 'Tasks reordered',
  });
});
