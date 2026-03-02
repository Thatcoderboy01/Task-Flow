import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';

/* ============================================================
 * Express application setup
 * ============================================================ */

const app = express();

/* ─────────────── SECURITY ─────────────── */
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

/* ─────────────── RATE LIMITING ─────────────── */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

/* ─────────────── BODY PARSING ─────────────── */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ─────────────── ROUTES ─────────────── */
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', apiLimiter, taskRoutes);
app.use('/api/users', apiLimiter, userRoutes);

/* ─────────────── HEALTH CHECK ─────────────── */
app.get('/api/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'TaskFlow API is running' });
});

/* ─────────────── 404 HANDLER ─────────────── */
app.all('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ─────────────── ERROR HANDLER ─────────────── */
app.use(errorHandler);

export default app;
