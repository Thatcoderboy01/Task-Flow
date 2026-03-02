import api from './api';
import type { AuthUser } from './authService';

/* ============================================================
 * User service — profile, password, account management
 * ============================================================ */

export interface ProfileStats {
  totalTasks: number;
  completedTasks: number;
  productivityRate: number;
}

const userService = {
  /** Get profile with stats */
  getStats: async (): Promise<{ user: AuthUser; stats: ProfileStats }> => {
    const res = await api.get('/users/stats');
    return { user: res.data.user, stats: res.data.stats };
  },

  /** Update display name */
  updateProfile: async (name: string): Promise<AuthUser> => {
    const res = await api.put('/users/update', { name });
    return res.data.user;
  },

  /** Change password */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<void> => {
    await api.put('/users/change-password', {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
  },

  /** Delete account permanently */
  deleteAccount: async (): Promise<void> => {
    await api.delete('/users/delete');
  },
};

export default userService;
