// hooks/useAuth.ts
'use client';

import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { login, register, logout } from '@/lib/features/authSlice';
import { DELETE } from '../api/set-token/route';
import type { RootState } from '@/lib/store/store';

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state: RootState) => state.auth);
  
  const loginUser = (email: string, password: string) => {
    return dispatch(login({ email, password }));
  };
  
  const registerUser = (
    name: string,
    email: string,
    password: string,
    role?: string,
    createdBy?: string,
  ) => {
    return dispatch(register({ name, email, password, role, createdBy }));
  };
  
  const logoutUser = () => {
    dispatch(logout());
    DELETE()
    fetch('/api/set-token', { method: 'DELETE' });
  };
  
  return {
    user,
    isLoading,
    error,
    loginUser,
    registerUser,
    logoutUser,
    isAuthenticated: !!user,
  };
}