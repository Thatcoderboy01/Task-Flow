import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authService, { type AuthUser, type SignupPayload, type LoginPayload } from '@/services/authService';

/* ============================================================
 * Auth slice — authentication state, async thunks
 * ============================================================ */

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isInitialised: boolean; // Has the app attempted to restore session?
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('taskflow_token'),
  isLoading: false,
  isInitialised: false,
  error: null,
};

/* ─────────────── ASYNC THUNKS ─────────────── */

/** Sign up a new user */
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (data: SignupPayload, { rejectWithValue }) => {
    try {
      const response = await authService.signup(data);
      localStorage.setItem('taskflow_token', response.token);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Signup failed. Please try again.';
      return rejectWithValue(message);
    }
  }
);

/** Log in an existing user */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem('taskflow_token', response.token);
      return response;
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(message);
    }
  }
);

/** Restore session on app load (check /auth/me) */
export const restoreSession = createAsyncThunk(
  'auth/restore',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getMe();
      return response.user;
    } catch (error: any) {
      localStorage.removeItem('taskflow_token');
      return rejectWithValue('Session expired');
    }
  }
);

/** Logout */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('taskflow_token');
    } catch (error: any) {
      // Even if the API call fails, clear local state
      localStorage.removeItem('taskflow_token');
      return rejectWithValue('Logout failed');
    }
  }
);

/* ─────────────── SLICE ─────────────── */

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Clear auth state (called by axios interceptor on 401) */
    clearAuth(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
    /** Clear error message */
    clearAuthError(state) {
      state.error = null;
    },
    /** Update user object after profile edit */
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // SIGNUP
    builder
      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialised = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isInitialised = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // RESTORE SESSION
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isInitialised = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isInitialised = true;
      });

    // LOGOUT
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isInitialised = true;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear state even on error
        state.user = null;
        state.token = null;
      });
  },
});

export const { clearAuth, clearAuthError, setUser } = authSlice.actions;
export default authSlice.reducer;
