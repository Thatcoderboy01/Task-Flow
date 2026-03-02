import { type Request, type Response } from 'express';
import User from '../models/User.js';
import { signToken } from '../config/jwt.js';
import catchAsync from '../utils/catchAsync.js';
import {
  BadRequest,
  Unauthorized,
  Conflict,
  NotFound,
} from '../utils/AppError.js';

/* ============================================================
 * Auth Controller — signup, login, me, logout
 * ============================================================ */

/** Cookie config for httpOnly JWT */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: (process.env.NODE_ENV === 'production' ? 'strict' : 'lax') as
    | 'strict'
    | 'lax'
    | 'none',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/* ─────────────── SIGNUP ─────────────── */
export const signup = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw Conflict('An account with this email already exists');
  }

  // Create user (password hashed via pre-save hook)
  const user = await User.create({ name, email, password });

  // Issue JWT
  const token = signToken({ userId: user._id.toString(), email: user.email });

  // Set HTTP-only cookie
  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

/* ─────────────── LOGIN ─────────────── */
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Explicitly select password for comparison
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw Unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw Unauthorized('Invalid email or password');
  }

  const token = signToken({ userId: user._id.toString(), email: user.email });

  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

/* ─────────────── GET ME ─────────────── */
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw NotFound('User not found');
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

/* ─────────────── LOGOUT ─────────────── */
export const logout = catchAsync(async (_req: Request, res: Response) => {
  res.cookie('token', '', {
    ...cookieOptions,
    maxAge: 0,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
