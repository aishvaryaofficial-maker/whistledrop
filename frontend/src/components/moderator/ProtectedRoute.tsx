import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin" />
        <p className="text-sm text-[#6B7280] dark:text-[#CBD5E1] font-mono flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Verifying moderator authorization...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/moderator/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
