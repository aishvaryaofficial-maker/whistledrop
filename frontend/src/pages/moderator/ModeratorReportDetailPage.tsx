import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Calendar,
  Clock,
  ExternalLink,
  Edit3,
  RefreshCw,
  Send,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { moderatorApi } from '../../api/moderatorApi';
import type { ReportDetailResponse, ReportStatus, UpdateStatusRequest } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Timeline } from '../../components/common/Timeline';
import { Alert } from '../../components/common/Alert';
import { CardSkeleton } from '../../components/common/Skeleton';

export const ModeratorReportDetailPage: React.FC = () => {
  const { caseCode } = useParams<{ caseCode: string }>();

  const [report, setReport] = useState<ReportDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status update form state
  const [targetStatus, setTargetStatus] = useState<ReportStatus | ''>('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchReport = useCallback(async () => {
    if (!caseCode) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await moderatorApi.getReportDetail(caseCode);
      setReport(data);
      // Pre-select first allowed transition or current status
      if (data.allowedTransitions && data.allowedTransitions.length > 0) {
        setTargetStatus(data.allowedTransitions[0]);
      } else {
        setTargetStatus(data.status);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve report detail.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [caseCode]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleCopyCode = () => {
    if (report?.caseCode) {
      navigator.clipboard.writeText(report.caseCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !targetStatus) return;

    const trimmedMsg = updateMessage.trim();
    if (!trimmedMsg) {
      setUpdateError('Please enter a status update note explaining this action.');
      return;
    }
    if (trimmedMsg.length < 5) {
      setUpdateError('Status update note must be at least 5 characters long.');
      return;
    }
    if (trimmedMsg.length > 1000) {
      setUpdateError('Status update note cannot exceed 1000 characters.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    const payload: UpdateStatusRequest = {
      status: targetStatus as ReportStatus,
      message: trimmedMsg,
    };

    try {
      const updated = await moderatorApi.updateStatus(report.caseCode, payload);
      setReport(updated);
      setUpdateMessage('');
      setUpdateSuccess(`Status successfully transitioned to ${updated.statusDisplayName || updated.status}!`);
      // Update preselected target status from new allowed transitions
      if (updated.allowedTransitions && updated.allowedTransitions.length > 0) {
        setTargetStatus(updated.allowedTransitions[0]);
      } else {
        setTargetStatus(updated.status);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update report status.';
      setUpdateError(msg);
    } finally {
      setIsUpdating(false);
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

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <Link
          to="/moderator/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </Link>
        <Alert
          type="error"
          title="Case Not Found"
          message={error || `Report with case code ${caseCode} does not exist.`}
        />
      </div>
    );
  }

  // Combine backend-provided allowed transitions + optionally current status for new audit note
  const transitionsList = Array.from(
    new Set([report.status, ...(report.allowedTransitions || [])])
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <Link
        to="/moderator/dashboard"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Moderator Dashboard</span>
      </Link>

      {/* Case Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl backdrop-blur-md mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div>
            <span className="text-[11px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">
              Case Code
            </span>
            <div className="flex items-center gap-2">
              <span className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                {report.caseCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Copy case code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusBadge status={report.status} displayName={report.statusDisplayName} size="lg" />
            <button
              onClick={fetchReport}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
              title="Refresh case details"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metadata info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 font-mono block mb-1">Category</span>
            <CategoryBadge category={report.category} displayName={report.categoryDisplayName} />
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 font-mono block mb-1">Intake Timestamp</span>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(report.createdAt)}</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <span className="text-slate-500 font-mono block mb-1">Last Transition</span>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(report.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Narrative and Status Update Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Narrative Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Submitted Narrative</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
              {report.description}
            </div>

            {report.evidenceUrl && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                <div className="truncate">
                  <span className="text-slate-400 font-mono block text-[10px] uppercase">Attached Evidence Link:</span>
                  <span className="text-cyan-400 font-mono truncate">{report.evidenceUrl}</span>
                </div>
                <a
                  href={report.evidenceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950/30 text-cyan-300 border border-cyan-800/40 hover:bg-cyan-900/40 transition-colors shrink-0 font-medium"
                >
                  <span>Open URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Moderator Status Update Interface */}
          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-400" />
                <span>Update Report Status & Append Audit Note</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Transitions are governed by backend business rules. All updates append an immutable audit log entry.
              </p>
            </div>

            {updateSuccess && (
              <Alert
                type="success"
                title="Status Updated"
                message={updateSuccess}
                onClose={() => setUpdateSuccess(null)}
                className="mb-4"
              />
            )}

            {updateError && (
              <Alert
                type="error"
                title="Transition Failed"
                message={updateError}
                onClose={() => setUpdateError(null)}
                className="mb-4"
              />
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              {/* Target Status Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                  Select Target Status <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {transitionsList.map((stat) => {
                    const isSelected = targetStatus === stat;
                    const isCurrent = report.status === stat;
                    return (
                      <button
                        type="button"
                        key={stat}
                        onClick={() => setTargetStatus(stat)}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="block font-semibold">{stat}</span>
                        {isCurrent && <span className="text-[10px] text-slate-500">(Current)</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Update Note Message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="updateNote" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Audit Note / Explanation <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {updateMessage.trim().length} / 1000 (min 5)
                  </span>
                </div>
                <textarea
                  id="updateNote"
                  rows={4}
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                  placeholder="Record justification, investigative findings, or guidance visible to the reporter on their tracking terminal..."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdating || !targetStatus || updateMessage.trim().length < 5}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Apply Transition & Log Audit</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Complete Status Timeline */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 sticky top-24">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Status Audit History</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Complete history of status transitions and moderator notes.
            </p>

            <Timeline updates={report.statusUpdates} currentStatus={report.status} />
          </div>
        </div>
      </div>
    </div>
  );
};
