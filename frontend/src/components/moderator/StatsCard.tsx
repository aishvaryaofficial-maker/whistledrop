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
      border: 'border-slate-800 hover:border-slate-700',
      activeBorder: 'border-slate-500 ring-2 ring-slate-500/20',
      bg: 'bg-slate-900/60',
      iconBg: 'bg-slate-800 text-slate-300',
      textColor: 'text-slate-100',
    },
    sky: {
      border: 'border-sky-900/40 hover:border-sky-800/80',
      activeBorder: 'border-sky-500 ring-2 ring-sky-500/20',
      bg: 'bg-sky-950/20',
      iconBg: 'bg-sky-500/10 text-sky-400',
      textColor: 'text-sky-300',
    },
    amber: {
      border: 'border-amber-900/40 hover:border-amber-800/80',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      bg: 'bg-amber-950/20',
      iconBg: 'bg-amber-500/10 text-amber-400',
      textColor: 'text-amber-300',
    },
    emerald: {
      border: 'border-emerald-900/40 hover:border-emerald-800/80',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      bg: 'bg-emerald-950/20',
      iconBg: 'bg-emerald-500/10 text-emerald-400',
      textColor: 'text-emerald-300',
    },
    rose: {
      border: 'border-rose-900/40 hover:border-rose-800/80',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
      bg: 'bg-rose-950/20',
      iconBg: 'bg-rose-500/10 text-rose-400',
      textColor: 'text-rose-300',
    },
  }[colorVariant];

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${variantStyles.bg} ${
        isActive ? variantStyles.activeBorder : variantStyles.border
      } ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.99]' : ''}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1">{label}</p>
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
