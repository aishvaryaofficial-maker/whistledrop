import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Inbox,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { moderatorApi } from '../../api/moderatorApi';
import type {
  ModeratorStatsResponse,
  ReportCategory,
  ReportStatus,
  ReportSummaryResponse,
  SpringPage,
} from '../../types';
import { StatsCard } from '../../components/moderator/StatsCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import { Alert } from '../../components/common/Alert';
import { TableRowSkeleton } from '../../components/common/Skeleton';

export const ModeratorDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Stats state
  const [stats, setStats] = useState<ModeratorStatsResponse | null>(null);

  // Reports table state
  const [reportsPage, setReportsPage] = useState<SpringPage<ReportSummaryResponse> | null>(null);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Fetch stats from real backend endpoint
  const loadStats = useCallback(async () => {
    try {
      const data = await moderatorApi.getStats();
      setStats(data);
    } catch (err: unknown) {
      console.error('Failed to load stats', err);
    }
  }, []);

  // Fetch reports from real backend endpoint with filters
  const loadReports = useCallback(async () => {
    try {
      setReportsLoading(true);
      setError(null);
      const pageData = await moderatorApi.getReports({
        category: selectedCategory,
        status: selectedStatus,
        search: searchTerm,
        page: currentPage,
        size: pageSize,
      });
      setReportsPage(pageData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to retrieve reports from server.';
      setError(msg);
    } finally {
      setReportsLoading(false);
    }
  }, [selectedCategory, selectedStatus, searchTerm, currentPage, pageSize]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
    loadReports();
  };

  const handleStatCardClick = (status: ReportStatus | '') => {
    setSelectedStatus((prev) => (prev === status ? '' : status));
    setCurrentPage(0);
  };

  const handleRefresh = () => {
    loadStats();
    loadReports();
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

  const totalPages = reportsPage?.page?.totalPages ?? reportsPage?.totalPages ?? 1;
  const totalElements = reportsPage?.page?.totalElements ?? reportsPage?.totalElements ?? 0;
  const reportsList = reportsPage?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono mb-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Operational Triage & Review Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Moderator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review confidential incident reports, inspect evidence, and manage status lifecycles.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs sm:text-sm font-medium transition-colors self-start sm:self-auto cursor-pointer"
          title="Refresh dashboard data"
        >
          <RefreshCw className={`w-4 h-4 ${reportsLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
        <StatsCard
          label="Total Reports"
          count={stats?.totalReports ?? 0}
          icon={Inbox}
          colorVariant="slate"
          isActive={selectedStatus === ''}
          onClick={() => handleStatCardClick('')}
        />
        <StatsCard
          label="Submitted"
          count={stats?.submittedCount ?? 0}
          icon={Clock}
          colorVariant="sky"
          isActive={selectedStatus === 'SUBMITTED'}
          onClick={() => handleStatCardClick('SUBMITTED')}
        />
        <StatsCard
          label="Under Review"
          count={stats?.underReviewCount ?? 0}
          icon={Eye}
          colorVariant="amber"
          isActive={selectedStatus === 'UNDER_REVIEW'}
          onClick={() => handleStatCardClick('UNDER_REVIEW')}
        />
        <StatsCard
          label="Resolved"
          count={stats?.resolvedCount ?? 0}
          icon={CheckCircle2}
          colorVariant="emerald"
          isActive={selectedStatus === 'RESOLVED'}
          onClick={() => handleStatCardClick('RESOLVED')}
        />
        <StatsCard
          label="Dismissed"
          count={stats?.dismissedCount ?? 0}
          icon={XCircle}
          colorVariant="rose"
          isActive={selectedStatus === 'DISMISSED'}
          onClick={() => handleStatCardClick('DISMISSED')}
        />
      </div>

      {error && (
        <Alert
          type="error"
          title="Failed to Load Reports"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 mb-6">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Case Code Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Case Code (e.g. WD-9K...)"
                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono uppercase"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium rounded-xl transition-colors shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Select dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as ReportStatus | '');
                  setCurrentPage(0);
                }}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
                <option value="DISMISSED">Dismissed</option>
              </select>
            </div>

            {/* Category dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono hidden sm:inline">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value as ReportCategory | '');
                  setCurrentPage(0);
                }}
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="">All Categories</option>
                <option value="SECURITY">Security</option>
                <option value="HARASSMENT">Harassment</option>
                <option value="CORRUPTION">Corruption</option>
                <option value="TECHNICAL">Technical</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedCategory || selectedStatus || searchTerm) && (
              <button
                onClick={() => {
                  setSelectedCategory('');
                  setSelectedStatus('');
                  setSearchTerm('');
                  setCurrentPage(0);
                }}
                className="text-xs text-slate-400 hover:text-rose-400 py-1 px-2 font-mono cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Reports Table (Desktop) / Cards (Mobile) */}
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800 overflow-hidden shadow-xl">
        {/* Table View (sm and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Case Code</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Preview</th>
                <th className="py-3.5 px-4">Logged At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {reportsLoading ? (
                <>
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                  <TableRowSkeleton cols={6} />
                </>
              ) : reportsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-medium text-slate-400">No reports found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or search term.</p>
                  </td>
                </tr>
              ) : (
                reportsList.map((rep) => (
                  <tr
                    key={rep.caseCode}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => navigate(`/moderator/reports/${rep.caseCode}`)}
                  >
                    <td className="py-4 px-4 font-mono font-bold text-slate-100 tracking-wider">
                      <span className="group-hover:text-emerald-400 transition-colors">
                        {rep.caseCode}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <CategoryBadge category={rep.category} displayName={rep.categoryDisplayName} size="sm" />
                    </td>
                    <td className="py-4 px-4">
                      <StatusBadge status={rep.status} displayName={rep.statusDisplayName} size="sm" />
                    </td>
                    <td className="py-4 px-4 text-slate-400 max-w-xs truncate text-xs font-sans">
                      {rep.previewDescription || '—'}
                    </td>
                    <td className="py-4 px-4 text-slate-400 font-mono text-xs whitespace-nowrap">
                      {formatDate(rep.createdAt)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/moderator/reports/${rep.caseCode}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 text-xs font-medium transition-all"
                      >
                        <span>Review</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="md:hidden divide-y divide-slate-800/80">
          {reportsLoading ? (
            <div className="p-4 space-y-3">
              <TableRowSkeleton cols={2} />
              <TableRowSkeleton cols={2} />
            </div>
          ) : reportsList.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium text-slate-400">No reports found</p>
            </div>
          ) : (
            reportsList.map((rep) => (
              <div
                key={rep.caseCode}
                onClick={() => navigate(`/moderator/reports/${rep.caseCode}`)}
                className="p-4 space-y-3 hover:bg-slate-800/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-emerald-400">{rep.caseCode}</span>
                  <StatusBadge status={rep.status} displayName={rep.statusDisplayName} size="sm" />
                </div>
                <div className="flex items-center gap-2">
                  <CategoryBadge category={rep.category} displayName={rep.categoryDisplayName} size="sm" />
                  <span className="text-[11px] text-slate-500 font-mono">{formatDate(rep.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2">{rep.previewDescription}</p>
                <div className="pt-2 flex justify-end">
                  <Link
                    to={`/moderator/reports/${rep.caseCode}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-slate-200"
                  >
                    <span>Open Case</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-200">
              {reportsList.length > 0 ? currentPage * pageSize + 1 : 0}
            </span>{' '}
            to{' '}
            <span className="font-bold text-slate-200">
              {Math.min((currentPage + 1) * pageSize, totalElements)}
            </span>{' '}
            of <span className="font-bold text-slate-200">{totalElements}</span> cases
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0 || reportsLoading}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page {currentPage + 1} of {Math.max(1, totalPages)}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1 || reportsLoading}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 border border-slate-800 text-slate-300 transition-colors cursor-pointer"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
