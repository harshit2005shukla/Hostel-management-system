import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  Lock, 
  User, 
  ShieldAlert, 
  UserCheck, 
  Users,
  ArrowRight
} from 'lucide-react';
import { Role } from '../../types/architecture';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve previous state intent or default to appropriate root dashboard
  const from = location.state?.from?.pathname || null;

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password) {
      setError('Please provide your password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      redirectAfterLogin(email);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedLogin = async (simRole: Role, defaultEmail: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(defaultEmail, 'Secr3tP@ssw0rd', simRole);
      redirectAfterLogin(defaultEmail);
    } catch (err: any) {
      setError('Simulated login failed.');
    } finally {
      setLoading(false);
    }
  };

  const redirectAfterLogin = (userEmail: string) => {
    if (from && from !== '/') {
      navigate(from, { replace: true });
      return;
    }

    // Default target based on determined role
    if (userEmail.includes('admin')) {
      navigate('/admin/dashboard', { replace: true });
    } else if (userEmail.includes('warden')) {
      navigate('/warden/dashboard', { replace: true });
    } else {
      navigate('/student/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-600/30">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          SmartHostel Access
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200">
          Sign in to access your administrative workspace or student hub
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-2xl rounded-2xl border border-slate-100 space-y-6">
          
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-rose-700 animate-fadeIn">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smarthostel.edu"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center space-x-1"
            >
              <span>{loading ? 'Authenticating...' : 'Secure Sign In'}</span>
              {!loading && <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          </form>

          {/* Instant Simulators Box */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="text-center">
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold px-2 py-0.5 rounded border border-indigo-100 uppercase tracking-wider">
                Instant Role Simulators
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Bypass typing to immediately evaluate complete user flows
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleSimulatedLogin('Admin', 'admin@smarthostel.edu')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-100 text-xs font-bold transition-colors"
                title="Simulate Full Root Admin Role"
              >
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Simulate Executive Admin</span>
                </div>
                <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-rose-200">
                  Root
                </span>
              </button>

              <button
                onClick={() => handleSimulatedLogin('Warden', 'warden@smarthostel.edu')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-100 text-xs font-bold transition-colors"
                title="Simulate Block Warden Role"
              >
                <div className="flex items-center space-x-2">
                  <UserCheck className="h-4 w-4" />
                  <span>Simulate Block Warden</span>
                </div>
                <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-amber-200">
                  Block A
                </span>
              </button>

              <button
                onClick={() => handleSimulatedLogin('Student', 'student@smarthostel.edu')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 text-xs font-bold transition-colors"
                title="Simulate Student Resident Role"
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Simulate Student Resident</span>
                </div>
                <span className="text-[9px] font-mono bg-white px-1.5 py-0.2 rounded border border-emerald-200">
                  CS2026001
                </span>
              </button>
            </div>
          </div>

          {/* Footer Access */}
          <div className="pt-2 text-center text-xs text-slate-500">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-indigo-600 hover:underline font-bold">
              Register Hub
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
