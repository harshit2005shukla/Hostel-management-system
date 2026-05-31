import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  LogOut, 
  User, 
  Bell, 
  ShieldAlert, 
  UserCheck, 
  Users,
  Menu
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'Admin':
        return (
          <span className="bg-rose-50 text-rose-700 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-rose-200 flex items-center space-x-1">
            <ShieldAlert className="h-2.5 w-2.5" />
            <span>Admin Root</span>
          </span>
        );
      case 'Warden':
        return (
          <span className="bg-amber-50 text-amber-700 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-amber-200 flex items-center space-x-1">
            <UserCheck className="h-2.5 w-2.5" />
            <span>Block Warden</span>
          </span>
        );
      case 'Student':
        return (
          <span className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-mono font-bold border border-emerald-200 flex items-center space-x-1">
            <Users className="h-2.5 w-2.5" />
            <span>Student Resident</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6">
      
      {/* Left side: Brand + Mobile Trigger */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center space-x-2.5">
          <div className="bg-indigo-600 p-1.5 rounded-lg text-white shadow-xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">
              SmartHostel
            </span>
            <span className="bg-indigo-50 text-indigo-700 text-[10px] px-1.5 py-0.2 rounded font-mono border border-indigo-100">
              PRO
            </span>
          </div>
        </Link>
      </div>

      {/* Right side: Telemetry & Actions */}
      <div className="flex items-center space-x-3">
        
        {/* Real-time Notifications Simulator */}
        <div className="relative">
          <button 
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 relative"
            title="System Alert Broadcasts"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* User Identity Info */}
        {user ? (
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-800">
                {user.firstName} {user.lastName}
              </div>
              <div className="flex justify-end pt-0.5">
                {getRoleBadge()}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
              {user.firstName[0]}{user.lastName[0]}
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Secure Session Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link 
              to="/login"
              className="flex items-center space-x-1 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
            >
              <User className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </Link>
          </div>
        )}

      </div>

    </header>
  );
};
