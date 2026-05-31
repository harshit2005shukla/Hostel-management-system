import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Bed, 
  MessageSquareWarning, 
  UserCheck, 
  CreditCard,
  Compass,
  FileCode,
  PieChart,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!user) return null;

  // Build role specific navigational structures
  const getNavLinks = () => {
    switch (user.role) {
      case 'Admin':
        return [
          { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/admin/analytics', label: 'Graphical Analytics', icon: PieChart },
          { to: '/admin/reports', label: 'Reports Studio', icon: FileText },
          { to: '/admin/audit-trails', label: 'Audit Trails', icon: ShieldCheck },
          { to: '/admin/students', label: 'Student Management', icon: Users },
          { to: '/admin/rooms', label: 'Room Management', icon: Bed },
          { to: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning },
          { to: '/admin/visitors', label: 'Visitor Logs', icon: UserCheck },
          { to: '/admin/fees', label: 'Fee Ledgers', icon: CreditCard },
        ];
      case 'Warden':
        return [
          { to: '/warden/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/warden/reports', label: 'Reports Studio', icon: FileText },
          { to: '/warden/audit-trails', label: 'Audit Trails', icon: ShieldCheck },
          { to: '/warden/complaints', label: 'Complaints', icon: MessageSquareWarning },
          { to: '/warden/visitors', label: 'Visitor Logs', icon: UserCheck },
          { to: '/warden/rooms', label: 'Room Inventory', icon: Bed },
        ];
      case 'Student':
        return [
          { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { to: '/student/room', label: 'My Room', icon: Bed },
          { to: '/student/complaints', label: 'My Complaints', icon: MessageSquareWarning },
          { to: '/student/fees', label: 'Fee Status', icon: CreditCard },
        ];
      default:
        return [];
    }
  };

  const links = getNavLinks();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden" 
        />
      )}

      {/* Sidebar Framework */}
      <aside className={`
        fixed top-16 bottom-0 left-0 w-64 bg-slate-900 text-slate-300 z-40 flex flex-col justify-between transition-transform duration-200 border-r border-slate-800
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static
      `}>
        
        {/* Navigation Section */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-3 pb-1">
              {user.role} Control Portal
            </span>

            <div className="space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={onClose}
                    className={({ isActive }) => `
                      flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${isActive 
                        ? 'bg-indigo-600 text-white font-bold shadow-xs border-l-4 border-indigo-400' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>

          {/* Architecture Access Button directly in persistent sidebar */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block px-3 pb-2">
              System Blueprints
            </span>

            <NavLink
              to="/architecture"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${isActive 
                  ? 'bg-slate-800 text-indigo-400 font-bold border-l-4 border-indigo-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }
              `}
            >
              <Compass className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Architecture Docs</span>
            </NavLink>

            <NavLink
              to="/backend-code"
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all mt-1
                ${isActive 
                  ? 'bg-slate-800 text-emerald-400 font-bold border-l-4 border-emerald-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }
              `}
            >
              <FileCode className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Backend Code Explorer</span>
            </NavLink>
          </div>

        </div>

        {/* Footer info box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex justify-between">
            <span>Stack:</span>
            <span className="text-slate-200 font-mono">React 19 + TS</span>
          </div>
          <div className="flex justify-between">
            <span>Security:</span>
            <span className="text-slate-200 font-mono">RBAC Gated</span>
          </div>
          <div className="flex justify-between">
            <span>Storage:</span>
            <span className="text-emerald-400 font-mono">Live Mocking</span>
          </div>
        </div>

      </aside>
    </>
  );
};
