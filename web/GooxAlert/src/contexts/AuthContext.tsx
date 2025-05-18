import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isInitialized: boolean;
  login: (telephone: string, password: string) => Promise<void>;
  register: (name: string, telephone: string, password: string) => Promise<void>;
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
  const login = async (telephone: string, password: string) => {
    // This would be replaced with actual API call
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    password +='';
    // Mock user based on telephone for demo purposes
    const isAdminPhone = telephone.includes('987');
    const mockUser: User = {
      id: '1',
      name: telephone.split(' ')[2], // Utilise une partie du numéro comme nom pour la démo
      telephone,
      role: isAdminPhone ? 'admin' : 'user',
      avatar: `https://ui-avatars.com/api/?name=${telephone.split(' ')[2]}&background=10B981&color=fff`
    };
    
    setUser(mockUser);
    localStorage.setItem('smartDakarUser', JSON.stringify(mockUser));
  };

  // Mock register function
  const register = async (name: string, telephone: string, password: string) => {
    // This would be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 800));

    password +='';
    
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      telephone,
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