import React, { useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { AuthContext, BACKEND_URL } from './context';
import type { User } from './context';

// Expected shape from backend for login
interface LoginResponse {
  status: { code: number; message?: string };
  data: { id: number; email: string; role?: string };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/login`, {
        user: { email, password },
      });

      // response.data may be typed as unknown depending on axios config — cast to any for now
  const data = response.data as LoginResponse;

      // JWT token'ını başlıkta yakala
      const receivedToken = response.headers.authorization?.split(' ')[1] || null;

      if (data?.status?.code === 200 && receivedToken) {
  const role = (data.data.role as User['role']) || 'employee';
  setUser({ ...data.data, role });
        setToken(receivedToken);
        // Token'ı localStorage'a kaydet (Oturumu korumak için)
        localStorage.setItem('authToken', receivedToken);
        // Also persist the user object so tests can hydrate auth state when
        // setting localStorage directly during Cypress runs.
        localStorage.setItem('authUser', JSON.stringify({ ...data.data, role }));
      } else {
        throw new Error(data?.status?.message || 'Giriş Başarısız.');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { status?: { message?: string } } } };
      const msg = err.response?.data?.status?.message || 'Kullanıcı adı veya şifre hatalı';
      throw new Error(msg);
    }
  };

  const logout = () => {
    // Backend'e Çıkış isteği gönder (isteğe bağlı, JTI'yı iptal eder)
    // Fire-and-forget logout request; swallow errors so UI logout
    // never fails the app or tests if backend is unavailable.
    axios.delete(`${BACKEND_URL}/logout`, {
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {
      /* ignore logout errors */
    });

    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    window.location.hash = '/login'; // Çıkıştan sonra Login sayfasına yönlendir
  };

  // Hydrate auth state from localStorage on mount. This allows tests to
  // programmatically set localStorage before visiting the app and have the
  // AuthProvider pick up the authenticated user/token.
  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('authUser');
      if (storedToken) setToken(storedToken);
      if (storedUser) {
        const parsed = JSON.parse(storedUser) as User;
        setUser(parsed);
      }
    } catch {
      // ignore JSON parse errors in tests
    }
    setHydrated(true);
  }, []);

  const isAuthenticated = !!user && !!token;
  const isManager = isAuthenticated && (user?.role === 'manager' || user?.role === 'admin');

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isManager, hydrated }}>
      {children}
    </AuthContext.Provider>
  );
};
