import React, {
  createContext,
  useState,
  useContext,
  useCallback,
} from 'react';
import type { ReactNode } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

export interface User {
  id: {
    id: string;
    entityType: string;
  };
  email: string;
  firstName: string;
  lastName: string;
  authority: string;
  customerId: {
    id: string;
    entityType: string;
  }
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (
    token: string,
    refreshToken: string,
    user: User,
    server: string
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(getItem('token'));
  const [user, setUser] = useState<User | null>(getItem('user'));

  const login = (
    newToken: string,
    newRefreshToken: string,
    newUser: User,
    server: string
  ) => {
    setToken(newToken);
    setUser(newUser);
    setItem('token', newToken);
    setItem('refreshToken', newRefreshToken);
    setItem('user', newUser);
    setItem('server', server);
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    removeItem('token');
    removeItem('refreshToken');
    removeItem('user');
    removeItem('server');
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};