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
        <span className={`inline-flex items-center font-medium rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 dark:bg-rose-950/50 dark:border-rose-900/50 ${sizeClasses[size]}`}>
          <ShieldAlert className={`${iconSizes[size]} text-rose-400`} />
          <span>{name}</span>
        </span>
      );
    case 'HARASSMENT':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 dark:bg-orange-950/50 dark:border-orange-900/50 ${sizeClasses[size]}`}>
          <Users className={`${iconSizes[size]} text-orange-400`} />
          <span>{name}</span>
        </span>
      );
    case 'CORRUPTION':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 dark:bg-purple-950/50 dark:border-purple-900/50 ${sizeClasses[size]}`}>
          <Scale className={`${iconSizes[size]} text-purple-400`} />
          <span>{name}</span>
        </span>
      );
    case 'TECHNICAL':
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 dark:bg-cyan-950/50 dark:border-cyan-900/50 ${sizeClasses[size]}`}>
          <Cpu className={`${iconSizes[size]} text-cyan-400`} />
          <span>{name}</span>
        </span>
      );
    case 'OTHER':
    default:
      return (
        <span className={`inline-flex items-center font-medium rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 dark:bg-slate-800/50 dark:border-slate-700/50 ${sizeClasses[size]}`}>
          <HelpCircle className={`${iconSizes[size]} text-slate-400`} />
          <span>{name}</span>
        </span>
      );
  }
};
