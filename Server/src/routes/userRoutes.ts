import { Router } from 'express';
import {
  updateProfile,
  changePassword,
  deleteAccount,
  getProfileStats,
} from '../controllers/userController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { updateProfileSchema, changePasswordSchema } from '../utils/validators.js';

/* ============================================================
 * User Routes — /api/users (all protected)
 * ============================================================ */

const router = Router();

router.use(protect);

router.get('/stats', getProfileStats);
router.put('/update', validate(updateProfileSchema), updateProfile);
router.put('/change-password', validate(changePasswordSchema as any), changePassword);
router.delete('/delete', deleteAccount);

export default router;
