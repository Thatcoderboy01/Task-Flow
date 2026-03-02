import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  bulkDeleteTasks,
  bulkUpdateStatus,
  reorderTasks,
} from '../controllers/taskController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { taskSchema } from '../utils/validators.js';

/* ============================================================
 * Task Routes — /api/tasks (all protected)
 * ============================================================ */

const router = Router();

// All task routes require authentication
router.use(protect);

router.get('/', getTasks);
router.post('/', validate(taskSchema as any), createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Bulk operations
router.post('/bulk-delete', bulkDeleteTasks);
router.post('/bulk-status', bulkUpdateStatus);
router.post('/reorder', reorderTasks);

export default router;
