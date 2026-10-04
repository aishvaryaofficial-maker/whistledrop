import React from 'react';
import { Clock, Search, CheckCircle2, XCircle } from 'lucide-react';
import type { ReportStatus } from '../../types';

interface StatusBadgeProps {
  status: ReportStatus;
  displayName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, displayName, size = 'md' }) => {
  const name = displayName || status;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  switch (status) {
    case 'SUBMITTED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60 ${sizeClasses[size]}`}
          aria-label={`Status: ${name}`}
        >
          <Clock className={`${iconSizes[size]} text-sky-400`} />
          <span>{name}</span>
        </span>
      );
    case 'UNDER_REVIEW':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60 ${sizeClasses[size]}`}
          aria-label={`Status: ${name}`}
        >
          <Search className={`${iconSizes[size]} text-amber-500 dark:text-amber-400 animate-pulse`} />
          <span>{name}</span>
        </span>
      );
    case 'RESOLVED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 ${sizeClasses[size]}`}
          aria-label={`Status: ${name}`}
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-500 dark:text-emerald-400`} />
          <span>{name}</span>
        </span>
      );
    case 'DISMISSED':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20 dark:bg-slate-800/60 dark:text-slate-400 dark:border-slate-700 ${sizeClasses[size]}`}
          aria-label={`Status: ${name}`}
        >
          <XCircle className={`${iconSizes[size]} text-slate-400`} />
          <span>{name}</span>
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-full bg-slate-800 text-slate-300 ${sizeClasses[size]}`}>
          {name}
        </span>
      );
  }
};
