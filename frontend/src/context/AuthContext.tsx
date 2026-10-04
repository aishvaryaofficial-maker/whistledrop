import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { setOnUnauthorizedCallback, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../api/axiosClient';
import type { LoginRequest } from '../types';

interface ModeratorUser {
  username: string;
  role?: string;
}

interface AuthContextType {
  token: string | null;
  user: ModeratorUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<ModeratorUser | null>(() => {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Register unauthorized listener
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      logout();
    });
  }, [logout]);

  // Verify session on mount if token exists
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (storedToken) {
        try {
          const session = await authApi.getMe();
          setUser({ username: session.username });
        } catch {
          // Token is invalid/expired
          logout();
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, [logout]);

  const login = async (credentials: LoginRequest) => {
    const data = await authApi.login(credentials);
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    const userData: ModeratorUser = {
      username: data.username,
      role: data.role,
    };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
