import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Building2, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const id = searchParams.get('id') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);

    if (!token || !id) {
      setError('Invalid password reset link. Token or User ID parameters are missing.');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please verify your typing.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.resetPassword({ id, token, newPassword });
      setStatusMsg(res.message || 'Password has been reset successfully. You can now log in.');
    } catch (err: any) {
      setError('Failed to reset password. The token may have expired or been used already.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-xl text-white shadow-md shadow-indigo-600/30">
          <Building2 className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Set New Password
        </h2>
        <p className="text-xs sm:text-sm text-indigo-200">
          Enter your new password below to regain full portal access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-4 sm:px-10 shadow-2xl rounded-2xl border border-slate-100 space-y-6">
          
          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded text-xs text-rose-700 animate-fadeIn">
              {error}
            </div>
          )}

          {statusMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-3 animate-fadeIn">
              <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">Password Updated Successfully</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {statusMsg}
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  Proceed to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                <span>{loading ? 'Updating Secret...' : 'Save New Password'}</span>
                {!loading && <ArrowRight className="h-3.5 w-3.5" />}
              </button>

            </form>
          )}

          {/* Footer Access */}
          <div className="pt-2 text-center text-xs text-slate-500">
            <Link to="/login" className="text-indigo-600 hover:underline font-bold">
              ← Return to Login
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
};
