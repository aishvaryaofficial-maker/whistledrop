import React from 'react';
import { ShieldAlert, Users, Scale, Cpu, HelpCircle } from 'lucide-react';
import type { ReportCategory } from '../../types';

interface CategoryBadgeProps {
  category: ReportCategory;
  displayName?: string;
  size?: 'sm' | 'md';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, displayName, size = 'md' }) => {
  const name = displayName || category;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs sm:text-sm px-2.5 py-1 gap-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
  };

  switch (category) {
    case 'SECURITY':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/50 ${sizeClasses[size]}`}>
          <ShieldAlert className={`${iconSizes[size]} text-rose-600 dark:text-rose-400`} />
          <span>{name}</span>
        </span>
      );
    case 'HARASSMENT':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900/50 ${sizeClasses[size]}`}>
          <Users className={`${iconSizes[size]} text-amber-600 dark:text-amber-400`} />
          <span>{name}</span>
        </span>
      );
    case 'CORRUPTION':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900/50 ${sizeClasses[size]}`}>
          <Scale className={`${iconSizes[size]} text-purple-600 dark:text-purple-400`} />
          <span>{name}</span>
        </span>
      );
    case 'TECHNICAL':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900/50 ${sizeClasses[size]}`}>
          <Cpu className={`${iconSizes[size]} text-blue-600 dark:text-blue-400`} />
          <span>{name}</span>
        </span>
      );
    case 'OTHER':
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800/60 dark:text-slate-300 dark:border-slate-700/60 ${sizeClasses[size]}`}>
          <HelpCircle className={`${iconSizes[size]} text-slate-500 dark:text-slate-400`} />
          <span>{name}</span>
        </span>
      );
  }
};
