import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('smartDakarUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsInitialized(true);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // This would be replaced with actual API call
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    password +='';
    // Mock user based on email for demo purposes
    const isAdminEmail = email.includes('admin');
    const mockUser: User = {
      id: '1',
      name: email.split('@')[0],
      email,
      role: isAdminEmail ? 'admin' : 'user',
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=10B981&color=fff`
    };
    
    setUser(mockUser);
    localStorage.setItem('smartDakarUser', JSON.stringify(mockUser));
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    // This would be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));

    password +='';
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: 'user',
      avatar: `https://ui-avatars.com/api/?name=${name}&background=10B981&color=fff`
    };
    
    setUser(mockUser);
    localStorage.setItem('smartDakarUser', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartDakarUser');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isInitialized,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};