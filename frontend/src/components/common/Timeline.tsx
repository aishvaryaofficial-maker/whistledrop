import React from 'react';
import { CheckCircle2, Clock, Eye, AlertCircle, Calendar } from 'lucide-react';
import type { StatusUpdateResponse, ReportStatus } from '../../types';

interface TimelineProps {
  updates: StatusUpdateResponse[];
  currentStatus: ReportStatus;
}

export const Timeline: React.FC<TimelineProps> = ({ updates, currentStatus }) => {
  if (!updates || updates.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-[#1E293B]/40 rounded-xl border border-[#E5E7EB] dark:border-[#334155] text-[#6B7280] dark:text-[#CBD5E1]">
        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400 opacity-60" />
        <p className="text-sm">No status audit events recorded yet.</p>
      </div>
    );
  }

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const getStatusIcon = (status: ReportStatus, isLatest: boolean) => {
    switch (status) {
      case 'SUBMITTED':
        return <Clock className={`w-4 h-4 ${isLatest ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'UNDER_REVIEW':
        return <Eye className={`w-4 h-4 ${isLatest ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'RESOLVED':
        return <CheckCircle2 className={`w-4 h-4 ${isLatest ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      case 'DISMISSED':
        return <AlertCircle className={`w-4 h-4 ${isLatest ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`} />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = (status: ReportStatus, isLatest: boolean) => {
    if (!isLatest) return 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B]/60';
    switch (status) {
      case 'SUBMITTED':
        return 'border-blue-300 dark:border-blue-500/50 bg-blue-50/60 dark:bg-blue-950/40 shadow-sm ring-2 ring-blue-500/20';
      case 'UNDER_REVIEW':
        return 'border-amber-300 dark:border-amber-500/50 bg-amber-50/60 dark:bg-amber-950/40 shadow-sm ring-2 ring-amber-500/20';
      case 'RESOLVED':
        return 'border-emerald-300 dark:border-emerald-500/50 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20';
      case 'DISMISSED':
        return 'border-rose-300 dark:border-rose-500/50 bg-rose-50/60 dark:bg-rose-950/40 shadow-sm ring-2 ring-rose-500/20';
      default:
        return 'border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#1E293B]';
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-blue-500/50 before:via-slate-300 dark:before:via-slate-700 before:to-slate-200 dark:before:to-slate-800">
      {updates.map((update, index) => {
        const isLatest = index === updates.length - 1;
        const isCurrent = update.status === currentStatus && isLatest;

        return (
          <div key={update.id || index} className="relative group">
            {/* Timeline node dot */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 flex items-center justify-center w-6 h-6 rounded-full border ${
                isLatest
                  ? 'bg-white dark:bg-[#0F172A] border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 ring-4 ring-blue-500/20'
                  : 'bg-slate-100 dark:bg-[#1E293B] border-slate-300 dark:border-[#334155] text-slate-400 dark:text-slate-500'
              } transition-transform duration-200 group-hover:scale-110 shadow-sm`}
            >
              {getStatusIcon(update.status, isLatest)}
            </div>

            {/* Event Card */}
            <div
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 shadow-sm ${getBorderColor(
                update.status,
                isCurrent
              )}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                    {update.statusDisplayName || update.status}
                    {isLatest && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30">
                        Current State
                      </span>
                    )}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6B7280] dark:text-[#CBD5E1] font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <time dateTime={update.createdAt}>{formatDate(update.createdAt)}</time>
                </div>
              </div>

              {/* Status Update Message */}
              <p className="text-sm text-[#111827] dark:text-[#CBD5E1] leading-relaxed font-sans bg-[#F3F4F6] dark:bg-[#0F172A]/70 p-3 rounded-lg border border-[#E5E7EB] dark:border-[#334155] mt-2">
                {update.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
