import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthResponse } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('skillswap_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('skillswap_token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('skillswap_token');
      const savedUser = localStorage.getItem('skillswap_user');

      if (savedToken && savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Refresh latest profile from backend
          const freshUser = await userService.getProfile(parsedUser._id);
          setUser(freshUser);
          localStorage.setItem('skillswap_user', JSON.stringify(freshUser));
        } catch (err) {
          console.warn('Could not verify token with backend, keeping saved session or clearing:', err);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const saveAuthSession = (authData: AuthResponse) => {
    setToken(authData.token);
    setUser(authData.user);
    localStorage.setItem('skillswap_token', authData.token);
    localStorage.setItem('skillswap_user', JSON.stringify(authData.user));
  };

  const login = async (email: string, pass: string) => {
    const data = await authService.login(email, pass);
    saveAuthSession(data);
  };

  const register = async (userData: any) => {
    const data = await authService.register(userData);
    saveAuthSession(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
  };

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const newObj = { ...user, ...updatedFields };
      setUser(newObj);
      localStorage.setItem('skillswap_user', JSON.stringify(newObj));
    }
  };

  const refreshUser = async () => {
    if (user?._id) {
      try {
        const fresh = await userService.getProfile(user._id);
        setUser(fresh);
        localStorage.setItem('skillswap_user', JSON.stringify(fresh));
      } catch (err) {
        console.error('Error refreshing user context:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser,
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
