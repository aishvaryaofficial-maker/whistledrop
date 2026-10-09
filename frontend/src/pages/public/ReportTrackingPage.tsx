import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Search,
  KeyRound,
  Calendar,
  Clock,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  FileText,
  FilePlus,
} from 'lucide-react';
import { reportApi } from '../../api/reportApi';
import type { ReportDetailResponse } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Timeline } from '../../components/common/Timeline';
import { Alert } from '../../components/common/Alert';
import { CardSkeleton } from '../../components/common/Skeleton';

export const ReportTrackingPage: React.FC = () => {
  const { caseCode: urlCaseCode } = useParams<{ caseCode?: string }>();
  const navigate = useNavigate();

  const [inputCode, setInputCode] = useState(urlCaseCode || '');
  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchReport = useCallback(async (code: string) => {
    if (!code || !code.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await reportApi.trackReport(code.trim());
      setReport(data);
    } catch (err: unknown) {
      setReport(null);
      const msg = err instanceof Error ? err.message : 'Unable to find a report matching this case code.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync with route param
  useEffect(() => {
    if (urlCaseCode) {
      setInputCode(urlCaseCode);
      fetchReport(urlCaseCode);
    } else {
      setReport(null);
      setError(null);
    }
  }, [urlCaseCode, fetchReport]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = inputCode.trim().toUpperCase();
    if (cleanCode) {
      navigate(`/track/${encodeURIComponent(cleanCode)}`);
    }
  };

  const handleCopyCode = () => {
    if (report?.caseCode) {
      navigator.clipboard.writeText(report.caseCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '—';
    try {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header & Search Bar */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/25 dark:text-blue-400 text-xs font-mono mb-3">
          <KeyRound className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Anonymous Tracking Terminal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight mb-3">
          Track Your Confidential Report
        </h1>
        <p className="text-sm text-[#6B7280] dark:text-[#CBD5E1] leading-relaxed mb-6">
          Enter your private case code to query the live investigation timeline. No login required.
        </p>

        {/* Case Code Search Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Enter case code (e.g. WD-9K4M8X2P)"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] dark:placeholder-[#64748B] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 font-mono text-sm tracking-wider uppercase shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={!inputCode.trim() || isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 shrink-0 inline-flex items-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Search className="w-4 h-4 text-white" />
            )}
            <span>Track</span>
          </button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="max-w-2xl mx-auto">
          <Alert
            type="error"
            title="Unable to Locate Report"
            message={
              <div className="space-y-2">
                <p>{error}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">
                  Please verify that the case code is formatted correctly (e.g., <code>WD-XXXXXXXX</code>) and matches the code provided upon submission.
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* Empty State when no code in route */}
      {!urlCaseCode && !isLoading && !report && !error && (
        <div className="max-w-lg mx-auto p-8 rounded-2xl bg-white dark:bg-[#1E293B]/40 border border-dashed border-[#E5E7EB] dark:border-[#334155] text-center shadow-sm">
          <KeyRound className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-[#111827] dark:text-[#F8FAFC] mb-1">No Case Code Entered</h3>
          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mb-4">
            Type your private tracking code above to retrieve the live status and moderator updates.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Need to lodge a new report instead?</span>
          </Link>
        </div>
      )}

      {/* Report Details & Timeline View */}
      {report && !isLoading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Main Status Header Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#E5E7EB] dark:border-[#334155]">
              {/* Case Code & Copy */}
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[11px] uppercase font-mono tracking-wider text-[#6B7280] dark:text-[#CBD5E1] block mb-0.5">
                    Case Reference
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-bold font-mono text-[#111827] dark:text-[#F8FAFC] tracking-wider">
                      {report.caseCode}
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="p-1.5 rounded-lg bg-[#F3F4F6] hover:bg-slate-200 text-[#111827] dark:bg-[#0F172A] dark:hover:bg-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      title="Copy case code"
                      aria-label="Copy case code"
                    >
                      {copied ? <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status and Refresh */}
              <div className="flex items-center gap-3">
                <StatusBadge status={report.status} displayName={report.statusDisplayName} size="lg" />
                <button
                  onClick={() => fetchReport(report.caseCode)}
                  className="p-2.5 rounded-xl bg-[#F3F4F6] hover:bg-slate-200 text-[#111827] border border-[#E5E7EB] dark:bg-[#0F172A] dark:hover:bg-slate-700 dark:text-slate-300 dark:border-[#334155] transition-colors cursor-pointer"
                  title="Refresh status updates"
                  aria-label="Refresh status updates"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Status Narrative Description */}
            <div className="py-5 border-b border-[#E5E7EB] dark:border-[#334155]">
              <span className="text-xs font-semibold text-[#6B7280] dark:text-[#CBD5E1] uppercase tracking-wider block mb-1">
                Current Status Description
              </span>
              <p className="text-sm sm:text-base text-[#111827] dark:text-[#CBD5E1] leading-relaxed font-medium">
                {report.statusDescription}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
              <div className="p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-[#334155]/60">
                <span className="text-[#6B7280] dark:text-slate-400 font-mono block mb-1">Category</span>
                <CategoryBadge category={report.category} displayName={report.categoryDisplayName} />
              </div>
              <div className="p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-[#334155]/60">
                <span className="text-[#6B7280] dark:text-slate-400 font-mono block mb-1">Submitted At</span>
                <div className="flex items-center gap-1.5 text-[#111827] dark:text-slate-300 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{formatDate(report.createdAt)}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/40 border border-[#E5E7EB] dark:border-[#334155]/60">
                <span className="text-[#6B7280] dark:text-slate-400 font-mono block mb-1">Last Updated</span>
                <div className="flex items-center gap-1.5 text-[#111827] dark:text-slate-300 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{formatDate(report.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Report Narrative & Evidence Summary Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] shadow-sm">
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Report Narrative</span>
            </h3>
            <div className="p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/80 border border-[#E5E7EB] dark:border-[#334155] text-sm text-[#111827] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-wrap font-sans">
              {report.description}
            </div>

            {report.evidenceUrl && (
              <div className="mt-4 p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/60 border border-[#E5E7EB] dark:border-[#334155]/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[#6B7280] dark:text-slate-400 font-mono">Evidence Link:</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono truncate">{report.evidenceUrl}</span>
                </div>
                <a
                  href={report.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shrink-0 font-medium"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Vertical Status Timeline Section */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Investigation & Audit Timeline</span>
              </h3>
              <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-1">
                Chronological ledger of status transitions and moderator review explanations.
              </p>
            </div>

            <Timeline updates={report.statusUpdates} currentStatus={report.status} />
          </div>
        </div>
      )}
    </div>
  );
};
