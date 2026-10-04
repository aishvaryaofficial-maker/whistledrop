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
      <div className="p-8 text-center bg-slate-900/40 rounded-xl border border-slate-800/80 text-slate-400">
        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-500 opacity-60" />
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
        return <Clock className={`w-4 h-4 ${isLatest ? 'text-sky-400' : 'text-slate-400'}`} />;
      case 'UNDER_REVIEW':
        return <Eye className={`w-4 h-4 ${isLatest ? 'text-amber-400' : 'text-slate-400'}`} />;
      case 'RESOLVED':
        return <CheckCircle2 className={`w-4 h-4 ${isLatest ? 'text-emerald-400' : 'text-slate-400'}`} />;
      case 'DISMISSED':
        return <AlertCircle className={`w-4 h-4 ${isLatest ? 'text-rose-400' : 'text-slate-400'}`} />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBorderColor = (status: ReportStatus, isLatest: boolean) => {
    if (!isLatest) return 'border-slate-800 bg-slate-900/60';
    switch (status) {
      case 'SUBMITTED':
        return 'border-sky-500/50 bg-sky-950/40 shadow-lg shadow-sky-500/10 ring-2 ring-sky-500/20';
      case 'UNDER_REVIEW':
        return 'border-amber-500/50 bg-amber-950/40 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20';
      case 'RESOLVED':
        return 'border-emerald-500/50 bg-emerald-950/40 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20';
      case 'DISMISSED':
        return 'border-rose-500/50 bg-rose-950/40 shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20';
      default:
        return 'border-slate-800 bg-slate-900';
    }
  };

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/50 before:via-slate-700 before:to-slate-800">
      {updates.map((update, index) => {
        const isLatest = index === updates.length - 1;
        const isCurrent = update.status === currentStatus && isLatest;

        return (
          <div key={update.id || index} className="relative group">
            {/* Timeline node dot */}
            <div
              className={`absolute -left-6 sm:-left-8 top-1.5 flex items-center justify-center w-6 h-6 rounded-full border ${
                isLatest
                  ? 'bg-slate-950 border-emerald-400 text-emerald-400 ring-4 ring-emerald-500/20'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              } transition-transform duration-200 group-hover:scale-110`}
            >
              {getStatusIcon(update.status, isLatest)}
            </div>

            {/* Event Card */}
            <div
              className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${getBorderColor(
                update.status,
                isCurrent
              )}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                    {update.statusDisplayName || update.status}
                    {isLatest && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Current State
                      </span>
                    )}
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <time dateTime={update.createdAt}>{formatDate(update.createdAt)}</time>
                </div>
              </div>

              {/* Status Update Message */}
              <p className="text-sm text-slate-300 leading-relaxed font-sans bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 mt-2">
                {update.message}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
