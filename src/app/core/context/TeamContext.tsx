import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from './AuthContext';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'inactive';
  lastActive: string;
}

interface TeamContextType {
  members: TeamMember[];
  updateMemberRole: (id: string, newRole: UserRole) => void;
  addMember: (member: Omit<TeamMember, 'id' | 'status' | 'lastActive'>) => void;
  deleteMember: (id: string) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'USR-001',
    name: 'Kwame Asante',
    email: 'kwame@righttech.io',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/100?img=33',
    status: 'active',
    lastActive: 'Active now'
  },
  {
    id: 'USR-002',
    name: 'Yaa Mensah',
    email: 'yaa@righttech.io',
    role: 'Supplier',
    avatar: 'https://i.pravatar.cc/100?img=44',
    status: 'active',
    lastActive: '2 hrs ago'
  },
  {
    id: 'USR-003',
    name: 'Kofi Owusu',
    email: 'kofi@righttech.io',
    role: 'Dealer',
    avatar: 'https://i.pravatar.cc/100?img=12',
    status: 'inactive',
    lastActive: '3 days ago'
  },
  {
    id: 'USR-004',
    name: 'Abena Addo',
    email: 'abena@righttech.io',
    role: 'Retailer',
    avatar: 'https://i.pravatar.cc/100?img=5',
    status: 'active',
    lastActive: '1 hr ago'
  },
  {
    id: 'USR-005',
    name: 'Ekow Baidoo',
    email: 'ekow@righttech.io',
    role: 'DeliveryAgent',
    avatar: 'https://i.pravatar.cc/100?img=60',
    status: 'active',
    lastActive: '5 mins ago'
  }
];

export function TeamProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);

  const updateMemberRole = (id: string, newRole: UserRole) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const addMember = (member: Omit<TeamMember, 'id' | 'status' | 'lastActive'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `USR-00${members.length + 1}`,
      status: 'active',
      lastActive: 'Active now'
    };
    setMembers(prev => [newMember, ...prev]);
  };

  const deleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <TeamContext.Provider value={{ members, updateMemberRole, addMember, deleteMember }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
