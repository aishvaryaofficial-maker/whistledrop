import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Copy, Check, Search, FilePlus, AlertTriangle, Key } from 'lucide-react';
import type { ReportDetailResponse } from '../../types';

export const ReportSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateReport = (location.state as { report?: ReportDetailResponse } | undefined)?.report;

  const [copied, setCopied] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const caseCode = stateReport?.caseCode || '';

  const handleCopy = () => {
    if (caseCode) {
      navigator.clipboard.writeText(caseCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!caseCode) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] shadow-sm">
          <Key className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC] mb-2">No Active Submission Found</h2>
          <p className="text-sm text-[#6B7280] dark:text-[#CBD5E1] mb-6">
            If you recently lodged a report, enter your case code below to view your tracking terminal.
          </p>
          <div className="flex gap-2 max-w-sm mx-auto mb-6">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="e.g. WD-9K4M8X2P"
              className="flex-1 px-4 py-2 bg-[#F3F4F6] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl text-[#111827] dark:text-[#F8FAFC] font-mono text-sm uppercase focus:outline-none focus:border-blue-600 dark:focus:border-blue-400"
            />
            <button
              onClick={() => manualCode && navigate(`/track/${encodeURIComponent(manualCode.trim())}`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm cursor-pointer shadow-sm"
            >
              Track
            </button>
          </div>
          <Link to="/report" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Or submit a new confidential report &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 animate-in fade-in zoom-in-95 duration-200">
      <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] shadow-xl relative overflow-hidden text-center">
        {/* Ambient glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center mx-auto mb-6 shadow-md shadow-blue-500/10">
          <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight mb-2">
          Report Submitted Successfully
        </h1>
        <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#CBD5E1] max-w-md mx-auto mb-8">
          Your report has been securely received by the WhistleDrop system.
        </p>

        {/* Highlighted Case Code Box */}
        <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#F3F4F6] dark:bg-[#0F172A] border-2 border-blue-500/40 shadow-inner mb-6 relative group">
          <p className="text-xs uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono font-semibold mb-2">
            YOUR PRIVATE CASE CODE
          </p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-[#111827] dark:text-white select-all">
              {caseCode}
            </span>
            <button
              onClick={handleCopy}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                copied
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white hover:bg-slate-100 text-[#111827] border-[#E5E7EB] dark:bg-[#1E293B] dark:hover:bg-slate-700 dark:text-slate-300 dark:border-[#334155]'
              }`}
              title="Copy Case Code to Clipboard"
              aria-label="Copy Case Code"
            >
              {copied ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          {copied && (
            <p className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-2 animate-in fade-in">
              Copied case code to clipboard!
            </p>
          )}
        </div>

        {/* Warning Note */}
        <div className="max-w-md mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-200 text-left mb-8 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">Important Safety Notice:</span>
            Save this code somewhere safe right now. Because WhistleDrop does not store your email or identity, this
            case code is the <strong>only way</strong> to track investigation updates or review responses.
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(`/track/${encodeURIComponent(caseCode)}`)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Track My Report Now</span>
          </button>
          <Link
            to="/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm text-[#111827] dark:text-[#F8FAFC] bg-[#F3F4F6] hover:bg-slate-200 border border-[#E5E7EB] dark:bg-[#0F172A] dark:hover:bg-slate-800 dark:border-[#334155] transition-all cursor-pointer shadow-sm"
          >
            <FilePlus className="w-4 h-4 text-[#6B7280] dark:text-[#CBD5E1]" />
            <span>Submit Another Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
