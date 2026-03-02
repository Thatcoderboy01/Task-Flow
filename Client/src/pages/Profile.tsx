import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Lock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Trash2,
  BarChart3,
  Target,
  TrendingUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logoutUser, setUser } from '@/store/slices/authSlice';
import { clearTasks } from '@/store/slices/taskSlice';
import userService from '@/services/userService';
import type { ProfileStats } from '@/services/userService';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';

/* ============================================================
 * Profile page — user info, stats, edit, password, delete
 * ============================================================ */

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^a-zA-Z0-9]/, 'Must contain a special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Load stats on mount
  useEffect(() => {
    userService.getStats().then((data) => setStats(data.stats)).catch(() => {});
  }, []);

  // Update form defaults when user changes
  useEffect(() => {
    if (user) profileForm.reset({ name: user.name });
  }, [user, profileForm]);

  const handleProfileUpdate = async (data: ProfileFormValues) => {
    setProfileLoading(true);
    try {
      const updatedUser = await userService.updateProfile(data.name);
      dispatch(setUser(updatedUser));
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormValues) => {
    setPasswordLoading(true);
    try {
      await userService.changePassword(data.currentPassword, data.newPassword, data.confirmPassword);
      toast.success('Password changed');
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await userService.deleteAccount();
      dispatch(clearTasks());
      dispatch(logoutUser());
      navigate('/login', { replace: true });
      toast.success('Account deleted');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete account');
    } finally {
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  if (!user) return null;

  const inputClasses =
    'w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/20 outline-none transition-all';

  const cardClasses =
    'glass rounded-2xl p-5 sm:p-6 border border-slate-200/50 dark:border-slate-700/50';

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const item = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account settings
        </p>
      </motion.div>

      {/* User info card */}
      <motion.div variants={item} className={cardClasses}>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
            <User size={28} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              {user.name}
            </h2>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <Mail size={14} />
              {user.email}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              <Calendar size={12} />
              Joined {formatDate(user.createdAt)}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      {stats && (
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Total Tasks',
              value: stats.totalTasks,
              icon: BarChart3,
              color: 'text-blue-500',
              bg: 'bg-blue-50 dark:bg-blue-900/20',
            },
            {
              label: 'Completed',
              value: stats.completedTasks,
              icon: Target,
              color: 'text-emerald-500',
              bg: 'bg-emerald-50 dark:bg-emerald-900/20',
            },
            {
              label: 'Productivity',
              value: `${stats.productivityRate}%`,
              icon: TrendingUp,
              color: 'text-primary-500',
              bg: 'bg-primary-50 dark:bg-primary-900/20',
            },
          ].map((stat) => (
            <div key={stat.label} className={cardClasses}>
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Update name */}
      <motion.div variants={item} className={cardClasses}>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Update profile
        </h3>
        <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Full name
            </label>
            <input {...profileForm.register('name')} className={inputClasses} />
            {profileForm.formState.errors.name && (
              <p className="mt-1 text-xs text-red-500">
                {profileForm.formState.errors.name.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={profileLoading} size="sm">
            {profileLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle2 size={16} />
            )}
            Save changes
          </Button>
        </form>
      </motion.div>

      {/* Change password */}
      <motion.div variants={item} className={cardClasses}>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          Change password
        </h3>
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Current password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                {...passwordForm.register('currentPassword')}
                type="password"
                className={`${inputClasses} pl-10`}
              />
            </div>
            {passwordForm.formState.errors.currentPassword && (
              <p className="mt-1 text-xs text-red-500">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              New password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                {...passwordForm.register('newPassword')}
                type="password"
                className={`${inputClasses} pl-10`}
              />
            </div>
            {passwordForm.formState.errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Confirm new password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                {...passwordForm.register('confirmPassword')}
                type="password"
                className={`${inputClasses} pl-10`}
              />
            </div>
            {passwordForm.formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" disabled={passwordLoading} size="sm">
            {passwordLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Lock size={16} />
            )}
            Update password
          </Button>
        </form>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        variants={item}
        className="rounded-2xl p-5 sm:p-6 border-2 border-red-200 dark:border-red-800/50 bg-red-50/50 dark:bg-red-900/10"
      >
        <h3 className="text-base font-semibold text-red-700 dark:text-red-400 mb-2">
          Danger zone
        </h3>
        <p className="text-sm text-red-600/70 dark:text-red-400/70 mb-4">
          Once you delete your account, all data will be permanently removed. This action
          cannot be undone.
        </p>

        {!deleteConfirm ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteConfirm(true)}
            className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
          >
            <Trash2 size={16} />
            Delete account
          </Button>
        ) : (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertCircle size={16} />
              Are you sure? This is irreversible.
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {deleteLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                Yes, delete my account
              </Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Profile;
