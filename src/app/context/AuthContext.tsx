import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'Admin' | 'Supplier' | 'Retailer' | 'Dealer' | 'DeliveryAgent';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (action: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 'USR-001',
    name: 'Kwame Asante',
    email: 'admin@righttech.com',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/100?img=33'
  });

  const login = async (email: string, role: UserRole) => {
    // Mock login logic
    setUser({
      id: `USR-${Math.floor(Math.random() * 1000)}`,
      name: email.split('@')[0],
      email,
      role
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (action: string) => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    // Add specific permission logic here
    return false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
