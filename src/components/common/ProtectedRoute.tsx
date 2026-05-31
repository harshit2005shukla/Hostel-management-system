import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/architecture';
import { ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles 
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page while saving the attempted target
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Render an inline Forbidden notification directly inside the operational frame
    return (
      <div className="p-8 max-w-xl mx-auto mt-12 bg-white rounded-2xl border border-rose-100 shadow-xl text-center space-y-4 animate-fadeIn">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-600">
            Your current assigned role claim (<strong className="text-rose-600">{user.role}</strong>) is not authorized to access this specific module.
          </p>
        </div>
        <div className="pt-2">
          <span className="text-[10px] bg-slate-100 text-slate-600 px-3 py-1 rounded font-mono uppercase">
            Required Roles: {allowedRoles.join(', ')}
          </span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
