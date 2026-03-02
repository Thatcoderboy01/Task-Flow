import api from './api';

/* ============================================================
 * Auth service — API calls for authentication
 * ============================================================ */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const authService = {
  signup: async (data: SignupPayload): Promise<AuthResponse> => {
    const res = await api.post('/auth/signup', data);
    return res.data;
  },

  login: async (data: LoginPayload): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<{ success: boolean; user: AuthUser }> => {
    const res = await api.get('/auth/me');
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

export default authService;
