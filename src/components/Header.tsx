import React from 'react';
import { 
  Building2, 
  Download, 
  Search, 
  ShieldAlert, 
  Users, 
  UserCheck 
} from 'lucide-react';
import { Role } from '../types/architecture';

interface HeaderProps {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onExport: (format: 'json' | 'markdown') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  setActiveRole,
  searchTerm,
  setSearchTerm,
  onExport
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-md shadow-indigo-600/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">SmartHostel</span>
                <span className="bg-indigo-500/20 text-indigo-400 text-xs px-2 py-0.5 rounded font-mono border border-indigo-500/30">
                  v1.0-ARCH
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Production-Ready MERN Enterprise Blueprint
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search schemas, endpoints, fields, validations..."
                className="w-full pl-9 pr-4 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Actions: Role Simulator & Export */}
          <div className="flex items-center space-x-3">
            
            {/* RBAC Simulation Switcher */}
            <div className="flex items-center bg-slate-800/90 rounded-lg p-1 border border-slate-700 text-xs">
              <span className="text-slate-400 px-2 font-medium hidden lg:inline">Simulate Role:</span>
              
              <button
                onClick={() => setActiveRole('All')}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  activeRole === 'All' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View universal architecture specifications"
              >
                Universal
              </button>

              <button
                onClick={() => setActiveRole('Admin')}
                className={`px-2 py-1 rounded font-medium flex items-center space-x-1 transition-all ${
                  activeRole === 'Admin' 
                    ? 'bg-rose-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-rose-400'
                }`}
                title="Simulate Full System Administrator Privileges"
              >
                <ShieldAlert className="h-3 w-3 mr-0.5" />
                <span>Admin</span>
              </button>

              <button
                onClick={() => setActiveRole('Warden')}
                className={`px-2 py-1 rounded font-medium flex items-center space-x-1 transition-all ${
                  activeRole === 'Warden' 
                    ? 'bg-amber-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-amber-400'
                }`}
                title="Simulate Hostel Block Warden Access"
              >
                <UserCheck className="h-3 w-3 mr-0.5" />
                <span>Warden</span>
              </button>

              <button
                onClick={() => setActiveRole('Student')}
                className={`px-2 py-1 rounded font-medium flex items-center space-x-1 transition-all ${
                  activeRole === 'Student' 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-emerald-400'
                }`}
                title="Simulate Student Resident Self-Service View"
              >
                <Users className="h-3 w-3 mr-0.5" />
                <span>Student</span>
              </button>
            </div>

            {/* Export Dropdown / Trigger */}
            <div className="relative group">
              <button
                onClick={() => onExport('markdown')}
                className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-medium transition-all"
                title="Download full architectural blueprint"
              >
                <Download className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Export Plan</span>
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search complete system architecture..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

      </div>
    </header>
  );
};
