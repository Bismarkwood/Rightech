import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'motion/react';
import { useTeam, TeamMember } from '../../../core/context/TeamContext';
import { UserRole, useAuth } from '../../../core/context/AuthContext';

/* ─── Components ───────────────────────────── */

const ROLE_CONFIG: Record<UserRole, { label: string; icon: string; color: string; bg: string }> = {
  Admin:          { label: 'Admin',          icon: 'solar:shield-user-bold',         color: '#D40073', bg: 'bg-[#FDEDF5]' },
  Supplier:       { label: 'Supplier',       icon: 'solar:box-bold',                color: '#4F46E5', bg: 'bg-[#EEF2FF]' },
  Retailer:       { label: 'Retailer',       icon: 'solar:shop-2-bold',              color: '#059669', bg: 'bg-[#ECFDF5]' },
  Dealer:         { label: 'Dealer',         icon: 'solar:users-group-two-bold',     color: '#EA580C', bg: 'bg-[#FFF7ED]' },
  DeliveryAgent:  { label: 'Delivery Agent', icon: 'solar:delivery-bold',           color: '#0284C7', bg: 'bg-[#F0F9FF]' },
};

function RoleBadge({ role }: { role: UserRole }) {
  const config = ROLE_CONFIG[role];
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10`}>
      <Icon icon={config.icon} style={{ color: config.color }} className="text-[14px]" />
      <span className="text-[11px] font-bold" style={{ color: config.color }}>{config.label}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: 'active' | 'inactive' }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] ${status === 'active' ? 'bg-[#ECFDF3] dark:bg-[#064E3B]/30 text-[#16A34A]' : 'bg-[#F9FAFB] dark:bg-white/5 text-[#667085] dark:text-[#8B93A7]'} border border-transparent`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'active' ? 'bg-[#16A34A] animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.4)]' : 'bg-[#C0C4CE]'}`} />
      <span className="text-[10px] font-extrabold uppercase tracking-widest">{status}</span>
    </div>
  );
}

/* ─── Add Member Modal ───────────────────────── */

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { addMember } = useTeam();
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Dealer' as UserRole });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      addMember({
        ...formData,
        avatar: `https://i.pravatar.cc/100?u=${formData.email}`
      });
      setIsSubmitting(false);
      setIsSuccess(true);
      // Reset form
      setFormData({ name: '', email: '', role: 'Dealer' });
      // Close after delay
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 1500);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[480px] bg-white rounded-[28px] shadow-2xl overflow-hidden"
          >
            <div className="px-8 py-6 border-b border-[#F3F4F6] flex items-center justify-between">
              <div>
                <h3 className="text-[18px] font-black text-[#111111]">Add New Member</h3>
                <p className="text-[12px] font-medium text-[#8B93A7]">Invite a new user to your organization</p>
              </div>
              <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center text-[#8B93A7] hover:bg-[#F3F4F6] transition-colors">
                <Icon icon="solar:close-square-linear" className="text-[24px]" />
              </button>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center text-[#10B981] mb-4">
                      <Icon icon="solar:check-circle-bold" className="text-[40px]" />
                    </div>
                    <h4 className="text-[18px] font-black text-[#111111]">Member Added!</h4>
                    <p className="text-[14px] text-[#8B93A7] mt-1 text-center">Invitation has been sent successfully.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    onSubmit={handleSubmit} 
                    className="space-y-5"
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Full Name</label>
                      <div className="relative">
                        <Icon icon="solar:user-bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                        <input
                          required
                          type="text"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                          className="w-full h-12 pl-10 pr-4 bg-[#F7F7F8] border border-transparent rounded-[14px] text-[14px] font-medium focus:bg-white focus:border-[#D40073] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Email Address</label>
                      <div className="relative">
                        <Icon icon="solar:letter-bold" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7]" />
                        <input
                          required
                          type="email"
                          placeholder="name@company.com"
                          value={formData.email}
                          onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                          className="w-full h-12 pl-10 pr-4 bg-[#F7F7F8] border border-transparent rounded-[14px] text-[14px] font-medium focus:bg-white focus:border-[#D40073] outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-wider">Assigned Role</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setFormData(p => ({ ...p, role: role as UserRole }))}
                            className={`flex items-center gap-2.5 p-3 rounded-[14px] border-2 transition-all text-left ${formData.role === role ? 'border-[#D40073] bg-[#FDEDF5]' : 'border-[#F3F4F6] hover:border-[#D1D5DB]'}`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[16px] ${formData.role === role ? 'bg-[#D40073] text-white' : 'bg-[#F3F4F6] text-[#525866]'}`}>
                              <Icon icon={config.icon} />
                            </div>
                            <span className={`text-[12px] font-bold ${formData.role === role ? 'text-[#D40073]' : 'text-[#111111]'}`}>{config.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#111111] hover:bg-[#D40073] disabled:opacity-50 disabled:cursor-not-allowed text-white text-[15px] font-black rounded-[16px] shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <><div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Adding...</>
                        ) : (
                          <><Icon icon="solar:user-plus-bold" className="text-[18px]" /> Add to Team</>
                        )}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default function TeamManagement() {
  const { members, updateMemberRole, deleteMember } = useTeam();
  const { user: currentUser, updateRole: updateAuthRole } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | 'All'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'All' || m.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (id: string, newRole: UserRole) => {
    updateMemberRole(id, newRole);
    // If the edited user is the current user, update their role in AuthContext too
    if (currentUser && id === currentUser.id) {
      updateAuthRole(newRole);
    }
    setEditingId(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#F7F7F8] p-6 lg:p-8 overflow-hidden">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-6 bg-[#D40073] rounded-full" />
            <span className="text-[12px] font-black text-[#D40073] uppercase tracking-[0.2em]">Management Console</span>
          </div>
          <p className="text-[14px] font-medium text-[#8B93A7]">Manage global team access, roles, and status.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 bg-[#111111] hover:bg-[#D40073] text-white text-[13px] font-bold rounded-[14px] transition-all flex items-center gap-2 shadow-lg shadow-black/5 cursor-pointer active:scale-[0.98]"
        >
          <Icon icon="solar:user-plus-bold" className="text-[18px]" />
          Add Team Member
        </button>
      </div>

      {/* Statistics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Members', value: members.length, icon: 'solar:users-group-two-bold-duotone', color: '#111111' },
          { label: 'Active Now', value: members.filter(m => m.status === 'active').length, icon: 'solar:bolt-bold-duotone', color: '#16A34A' },
          { label: 'Admins', value: members.filter(m => m.role === 'Admin').length, icon: 'solar:shield-user-bold-duotone', color: '#D40073' },
          { label: 'New Members', value: `+${members.filter(m => m.id.includes('USR-00')).length}`, icon: 'solar:chart-square-bold-duotone', color: '#4F46E5' },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white dark:bg-[#151B2B] p-5 rounded-[22px] border border-[#ECEDEF] dark:border-white/10 shadow-sm transition-all hover:translate-y-[-2px] hover:shadow-md overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 rounded-bl-[40px] transition-transform group-hover:scale-110" />
             <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center text-[24px] transition-all group-hover:scale-110" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <Icon icon={stat.icon} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-[#8B93A7] uppercase tracking-widest group-hover:text-[#111111] dark:group-hover:text-white transition-colors">{stat.label}</p>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <p className="text-[24px] font-black text-[#111111] dark:text-white tracking-tighter">{stat.value}</p>
                    {stat.label === 'New Members' && <span className="text-[11px] font-bold text-[#8B93A7] opacity-60 uppercase tracking-tighter"> / MONTH</span>}
                  </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Controls & Table */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-[#151B2B] rounded-[22px] border border-[#ECEDEF] dark:border-white/10 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#ECEDEF] dark:border-white/5 flex flex-col sm:flex-row gap-4 bg-[#F9FAFB] dark:bg-white/5 relative">
          <div className="relative flex-1 group">
            <Icon icon="solar:magnifer-linear" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#111111] dark:text-white placeholder:text-[#8B93A7] focus:outline-none focus:border-[#D40073] transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as any)}
              className="h-11 px-4 bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#525866] dark:text-[#8B93A7] outline-none cursor-pointer hover:border-[#D40073] transition-all shadow-sm appearance-none min-w-[140px]"
            >
              <option value="All">All Roles</option>
              {Object.keys(ROLE_CONFIG).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <button className="h-11 px-5 flex items-center justify-center bg-white dark:bg-white/5 border border-[#E4E7EC] dark:border-white/10 rounded-[12px] text-[13px] font-black text-[#525866] dark:text-[#8B93A7] hover:border-[#D40073] transition-all shadow-sm uppercase tracking-wider group">
              <Icon icon="solar:filter-bold-duotone" className="text-[20px] mr-2 group-hover:text-[#D40073] transition-colors" />
              ADVANCED FILTERS
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#F9FAFB] dark:bg-white/5 border-b border-[#ECEDEF] dark:border-white/5 z-10">
              <tr>
                <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest whitespace-nowrap">Identity Hub</th>
                <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest whitespace-nowrap">Permission Layer</th>
                <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest whitespace-nowrap text-center">Lifecycle Status</th>
                <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest whitespace-nowrap">Last Synchronization</th>
                <th className="px-6 py-4 text-[12px] font-black text-[#8B93A7] uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECEDEF] dark:divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredMembers.map(member => {
                  const handleMemberDelete = (id: string, name: string) => {
                    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
                      deleteMember(id);
                    }
                  };

                  return (
                      <tr
                        key={member.id}
                        className="hover:bg-[#FBFBFC] dark:hover:bg-white/10 transition-all group border-b border-[#ECEDEF] dark:border-white/5 cursor-pointer"
                      >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={member.avatar} alt={member.name} className="w-11 h-11 rounded-full border-2 border-white dark:border-white/10 shadow-sm transition-transform group-hover:scale-110 shrink-0" />
                          <div>
                            <p className="text-[14px] font-black text-[#111111] dark:text-white uppercase tracking-tight group-hover:text-[#D40073] transition-colors">{member.name}</p>
                            <p className="text-[11px] font-bold text-[#8B93A7] uppercase tracking-widest mt-1 opacity-80">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === member.id ? (
                          <select
                            autoFocus
                            defaultValue={member.role}
                            onChange={(e) => handleRoleChange(member.id, e.target.value as UserRole)}
                            onBlur={() => setEditingId(null)}
                            className="h-8 px-2 bg-white border border-[#D40073] rounded-md text-[12px] font-bold outline-none"
                          >
                            {Object.keys(ROLE_CONFIG).map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        ) : (
                          <div onClick={() => setEditingId(member.id)} className="cursor-pointer hover:opacity-80 transition-opacity">
                            <RoleBadge role={member.role} />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={member.status} />
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[13px] font-black text-[#525866] dark:text-[#8B93A7] uppercase tracking-tighter italic">{member.lastActive}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => setEditingId(member.id)} className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 text-[#8B93A7] hover:text-[#D40073] hover:border-[#D40073] transition-all shadow-sm">
                            <Icon icon="solar:pen-bold" />
                          </button>
                          <button 
                            onClick={() => handleMemberDelete(member.id, member.name)}
                            className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white dark:bg-white/5 border border-[#ECEDEF] dark:border-white/10 text-[#8B93A7] hover:text-[#EF4444] hover:border-[#EF4444] transition-all shadow-sm"
                          >
                            <Icon icon="solar:trash-bin-trash-bold" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredMembers.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-[#F7F7F8] dark:bg-white/5 rounded-[20px] flex items-center justify-center mb-4">
                <Icon icon="solar:users-group-two-bold-duotone" className="text-[32px] text-[#C0C4CE] dark:text-[#8B93A7]" />
              </div>
              <h3 className="text-[16px] font-black text-[#111111] dark:text-white">No team members found</h3>
              <p className="text-[13px] font-medium text-[#8B93A7] mt-1 max-w-[240px]">We couldn't find any members matching your current filters.</p>
              <button onClick={() => { setSearch(''); setSelectedRole('All'); }} className="mt-4 text-[13px] font-bold text-[#D40073] hover:underline">Clear all filters</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 h-16 border-t border-[#ECEDEF] dark:border-white/5 bg-[#F9FAFB] dark:bg-white/5 flex items-center justify-between">
          <p className="text-[12px] font-black text-[#8B93A7] uppercase tracking-widest">Total <span className="text-[#111111] dark:text-white">{members.length} Members</span> enrolled</p>
          <div className="flex items-center gap-2">
            <button className="h-9 px-4 flex items-center justify-center rounded-lg border border-[#ECEDEF] dark:border-white/10 bg-white dark:bg-white/5 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest hover:border-[#D40073] transition-all disabled:opacity-30" disabled>PREVIOUS</button>
            <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#111111] dark:bg-white text-white dark:text-[#111111] text-[12px] font-black shadow-md">1</button>
            <button className="h-9 px-4 flex items-center justify-center rounded-lg border border-[#ECEDEF] dark:border-white/10 bg-white dark:bg-white/5 text-[11px] font-black text-[#8B93A7] uppercase tracking-widest hover:border-[#D40073] transition-all">NEXT</button>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
