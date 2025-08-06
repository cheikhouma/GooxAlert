import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  login: (telephone: string, password: string) => Promise<void>;
  register: (name: string, telephone: string, password: string, commune: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('gooxAlertUser', JSON.stringify(updatedUser));
  };
  
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('gooxAlertUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitialized(true);
  }, []);
  
  const login = async (telephone: string, password: string) => {
    const userData = await authService.login({ telephone, password });
    setUser(userData.user);
    console.log(userData)
    localStorage.setItem('gooxAlertUser', JSON.stringify(userData.user));

      // Enregistre les tokens
  localStorage.setItem('accessToken', userData.tokens.access);
  localStorage.setItem('refreshToken', userData.tokens.refresh);
  };

  const register = async (name: string, telephone: string, password: string, commune: string) => {
    const registerData = { full_name: name, telephone, commune, password };
    await authService.register(registerData);
   
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gooxAlertUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };
  
  return (
    <AuthContext.Provider
    value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isInitialized,
        login,
        register,
        logout,
        updateUser
      }}
      >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
