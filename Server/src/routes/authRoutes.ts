import { Router } from 'express';
import { signup, login, getMe, logout } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../utils/validators.js';

/* ============================================================
 * Auth Routes — /api/auth
 * ============================================================ */

const router = Router();

router.post('/signup', validate(signupSchema as any), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;
