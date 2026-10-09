import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  colorVariant: 'slate' | 'sky' | 'amber' | 'emerald' | 'rose';
  isActive?: boolean;
  onClick?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  label,
  count,
  icon: Icon,
  colorVariant,
  isActive = false,
  onClick,
}) => {
  const variantStyles = {
    slate: {
      border: 'border-[#E5E7EB] hover:border-slate-300 dark:border-[#334155] dark:hover:border-slate-600',
      activeBorder: 'border-blue-600 ring-2 ring-blue-500/20 dark:border-blue-400',
      bg: 'bg-white dark:bg-[#1E293B]',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      textColor: 'text-[#111827] dark:text-[#F8FAFC]',
    },
    sky: {
      border: 'border-blue-200 hover:border-blue-300 dark:border-blue-900/40 dark:hover:border-blue-800/80',
      activeBorder: 'border-blue-600 ring-2 ring-blue-500/20 dark:border-blue-400',
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    amber: {
      border: 'border-amber-200 hover:border-amber-300 dark:border-amber-900/40 dark:hover:border-amber-800/80',
      activeBorder: 'border-amber-600 ring-2 ring-amber-500/20 dark:border-amber-400',
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
      textColor: 'text-amber-700 dark:text-amber-300',
    },
    emerald: {
      border: 'border-emerald-200 hover:border-emerald-300 dark:border-emerald-900/40 dark:hover:border-emerald-800/80',
      activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20 dark:border-emerald-400',
      bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
      textColor: 'text-emerald-700 dark:text-emerald-300',
    },
    rose: {
      border: 'border-rose-200 hover:border-rose-300 dark:border-rose-900/40 dark:hover:border-rose-800/80',
      activeBorder: 'border-rose-600 ring-2 ring-rose-500/20 dark:border-rose-400',
      bg: 'bg-rose-50/50 dark:bg-rose-950/20',
      iconBg: 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400',
      textColor: 'text-rose-700 dark:text-rose-300',
    },
  }[colorVariant];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 shadow-sm ${variantStyles.bg} ${
        isActive ? variantStyles.activeBorder : variantStyles.border
      } ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.99]' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280] dark:text-[#CBD5E1] mb-1">{label}</p>
          <p className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${variantStyles.textColor}`}>
            {count.toLocaleString()}
          </p>
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${variantStyles.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
