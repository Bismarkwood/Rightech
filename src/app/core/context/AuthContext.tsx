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
  updateRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: ['*'],
  Supplier: ['dashboard', 'supply', 'shipments', 'products', 'consignment', 'storefront'],
  Retailer: ['dashboard', 'retailer', 'products', 'payments', 'credit', 'storefront'],
  Dealer: ['dashboard', 'dealer', 'retailer', 'products', 'storefront'],
  DeliveryAgent: ['dashboard', 'delivery', 'shipments'],
};

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
    const avatarMapping: Record<UserRole, string> = {
      Admin: 'https://i.pravatar.cc/100?img=33',
      Supplier: 'https://i.pravatar.cc/100?img=44',
      Dealer: 'https://i.pravatar.cc/100?img=12',
      Retailer: 'https://i.pravatar.cc/100?img=5',
      DeliveryAgent: 'https://i.pravatar.cc/100?img=60',
    };
    setUser({
      id: `USR-${Math.floor(Math.random() * 1000)}`,
      name: email.split('@')[0],
      email,
      role,
      avatar: avatarMapping[role]
    });
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    const permissions = ROLE_PERMISSIONS[user.role];
    if (permissions.includes('*')) return true;
    return permissions.includes(permission);
  };

  const updateRole = (role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission,
      updateRole
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
