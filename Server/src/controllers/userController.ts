import { type Request, type Response } from 'express';
import User from '../models/User.js';
import Task from '../models/Task.js';
import catchAsync from '../utils/catchAsync.js';
import { NotFound, Unauthorized, BadRequest } from '../utils/AppError.js';

/* ============================================================
 * User Controller — profile update, password change, delete
 * ============================================================ */

/* ─────────────── UPDATE PROFILE ─────────────── */
export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user!.id,
    { name },
    { new: true, runValidators: true }
  );

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

/* ─────────────── CHANGE PASSWORD ─────────────── */
export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user!.id).select('+password');
  if (!user) {
    throw NotFound('User not found');
  }

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw Unauthorized('Current password is incorrect');
  }

  // Prevent reusing the same password
  const isSame = await user.comparePassword(newPassword);
  if (isSame) {
    throw BadRequest('New password must be different from current password');
  }

  user.password = newPassword;
  await user.save(); // triggers pre-save hash

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/* ─────────────── DELETE ACCOUNT ─────────────── */
export const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  // Delete all user's tasks
  await Task.deleteMany({ userId: req.user!.id });

  // Delete the user
  await User.findByIdAndDelete(req.user!.id);

  // Clear auth cookie
  res.cookie('token', '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully',
  });
});

/* ─────────────── GET PROFILE STATS ─────────────── */
export const getProfileStats = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw NotFound('User not found');
  }

  const totalTasks = await Task.countDocuments({ userId: req.user!.id });
  const completedTasks = await Task.countDocuments({
    userId: req.user!.id,
    status: 'completed',
  });

  res.status(200).json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
    stats: {
      totalTasks,
      completedTasks,
      productivityRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    },
  });
});
