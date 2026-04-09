import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { AuthState, User } from '../types';

const initialState: AuthState = { user: null, token: null, isAdmin: false, isSuperAdmin: false };

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { setLoading(false); return; }
    api.getMe()
      .then((user: User) => setAuth({
        user,
        token,
        isAdmin: user.role === 'admin' || user.role === 'superadmin',
        isSuperAdmin: user.role === 'superadmin',
      }))
      .catch(() => localStorage.removeItem('auth_token'))
      .finally(() => setLoading(false));
  }, []);

  const loginWithOtp = useCallback(async (phone: string, code: string) => {
    const { token, user } = await api.verifyOtp(phone, code);
    localStorage.setItem('auth_token', token);
    setAuth({ user, token, isAdmin: user.role === 'admin' || user.role === 'superadmin', isSuperAdmin: user.role === 'superadmin' });
  }, []);

  const adminLogin = useCallback(async (username: string, password: string) => {
    const { token, user } = await api.adminLogin(username, password);
    localStorage.setItem('auth_token', token);
    setAuth({ user, token, isAdmin: true, isSuperAdmin: user.role === 'superadmin' });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setAuth(initialState);
  }, []);

  return { auth, loading, loginWithOtp, adminLogin, logout };
}
