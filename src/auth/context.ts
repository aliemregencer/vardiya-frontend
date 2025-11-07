import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  role: 'employee' | 'manager' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isManager: boolean;
  // Whether the provider has finished hydrating state from persistent storage
  hydrated?: boolean;
}

// Genel backend URL'i tüm bileşenlerin erişebilmesi için burada tanımlandı ve dışa aktarıldı
export const BACKEND_URL = 'http://localhost:3000';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
