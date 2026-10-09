import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400 shadow-sm">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight mb-2">404</h1>
      <p className="text-base text-[#6B7280] dark:text-[#CBD5E1] max-w-sm mb-8">
        The route or resource you requested could not be located in the WhistleDrop network.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500 text-sm font-semibold transition-colors shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to WhistleDrop Home</span>
      </Link>
    </div>
  );
};
