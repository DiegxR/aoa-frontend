// store/features/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createClientClient } from '@/lib/graphql/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, ME_QUERY } from '@/lib/graphql/queries';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdBy?: string | null;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

// Login con GraphQL
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const client = createClientClient();
    const data = await client.request(LOGIN_MUTATION, { email, password });
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('user', JSON.stringify(data.login.user));
    }
    
    return data.login;
  }
);

// Register con GraphQL
export const register = createAsyncThunk(
  'auth/register',
  async ({
    name,
    email,
    password,
    role,
    createdBy,
  }: {
    name: string;
    email: string;
    password: string;
    role?: string;
    createdBy?: string;
  }) => {
    const client = createClientClient();
    const data = await client.request(REGISTER_MUTATION, {
      name,
      email,
      password,
      role: "admin",
      createdBy,
    });
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('user', JSON.stringify(data.register.user));
    }
    
    return data.register;
  }
);

// Obtener perfil (Server-side)
export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async () => {
    const client = createClientClient();
    const data = await client.request(ME_QUERY);
    return data.me;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    hydrateFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          state.token = token;
          state.user = JSON.parse(userStr);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error en login';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error en registro';
      });
  },
});

export const { logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;