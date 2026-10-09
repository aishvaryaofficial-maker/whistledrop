import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Send,
  EyeOff,
  AlertCircle,
  Link as LinkIcon,
  Check,
  ArrowLeft,
  Lock,
} from 'lucide-react';
import { reportApi } from '../../api/reportApi';
import type { CreateReportRequest, ReportCategory } from '../../types';
import { Alert } from '../../components/common/Alert';

const CATEGORIES: Array<{
  value: ReportCategory;
  label: string;
  desc: string;
}> = [
  {
    value: 'SECURITY',
    label: 'Security Incident or Vulnerability',
    desc: 'Unauthorized access, data leaks, credential exposure, or exploit vectors.',
  },
  {
    value: 'CORRUPTION',
    label: 'Corruption, Fraud or Financial Malpractice',
    desc: 'Bribery, embezzlement, rigged procurement, or falsified records.',
  },
  {
    value: 'HARASSMENT',
    label: 'Harassment or Bullying',
    desc: 'Hostile workplace abuse, discrimination, intimidation, or misconduct.',
  },
  {
    value: 'TECHNICAL',
    label: 'Technical System Failure or Bug',
    desc: 'Critical architectural flaws, broken integrity controls, or session failures.',
  },
  {
    value: 'OTHER',
    label: 'Other Concern',
    desc: 'Any other serious ethical or organizational violation.',
  },
];

export const ReportSubmissionPage: React.FC = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState<ReportCategory>('SECURITY');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  const [errors, setErrors] = useState<{ category?: string; description?: string; evidenceUrl?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const validate = () => {
    const newErrors: { category?: string; description?: string; evidenceUrl?: string } = {};

    if (!category) {
      newErrors.category = 'Please select a report category.';
    }

    const trimmedDesc = description.trim();
    if (!trimmedDesc) {
      newErrors.description = 'Description cannot be empty.';
    } else if (trimmedDesc.length < 20) {
      newErrors.description = `Description must be at least 20 characters (currently ${trimmedDesc.length}).`;
    } else if (trimmedDesc.length > 5000) {
      newErrors.description = `Description cannot exceed 5000 characters (currently ${trimmedDesc.length}).`;
    }

    if (evidenceUrl.trim()) {
      const urlPattern = /^https?:\/\/.+/i;
      if (!urlPattern.test(evidenceUrl.trim())) {
        newErrors.evidenceUrl = 'Evidence URL must start with http:// or https://';
      } else if (evidenceUrl.trim().length > 1000) {
        newErrors.evidenceUrl = 'Evidence URL must be at most 1000 characters.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReviewStep = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmedSubmit = async () => {
    setIsSubmitting(true);
    setServerError(null);

    const payload: CreateReportRequest = {
      category,
      description: description.trim(),
      evidenceUrl: evidenceUrl.trim() ? evidenceUrl.trim() : undefined,
    };

    try {
      const report = await reportApi.submitReport(payload);
      setShowConfirmModal(false);
      // Navigate to success page with report response data in state
      navigate('/report/success', { state: { report } });
    } catch (err: unknown) {
      setShowConfirmModal(false);
      const message = err instanceof Error ? err.message : 'Failed to submit report. Please verify connection.';
      setServerError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Back button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#6B7280] hover:text-[#111827] dark:text-[#CBD5E1] dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/25 dark:text-blue-400 text-xs font-mono mb-3">
          <EyeOff className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Zero-Knowledge Intake Terminal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
          Submit Confidential Report
        </h1>
        <p className="text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-2 max-w-2xl leading-relaxed">
          Provide factual information regarding your concern. No identity, device tracking, or account creation is
          required.
        </p>
      </div>

      {/* Privacy Notice Banner */}
      <div className="mb-8 p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300 flex items-start gap-3 text-xs sm:text-sm">
        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold block text-blue-950 dark:text-blue-200">Privacy Notice</span>
          You are not required to provide identifying information. Do not include your name or personal contact info
          in the description unless you deliberately intend to disclose it.
        </div>
      </div>

      {serverError && (
        <Alert
          type="error"
          title="Submission Failed"
          message={serverError}
          onClose={() => setServerError(null)}
          className="mb-6"
        />
      )}

      {/* Form */}
      <form onSubmit={handleReviewStep} className="space-y-8 bg-white dark:bg-[#1E293B] p-6 sm:p-8 rounded-2xl border border-[#E5E7EB] dark:border-[#334155] shadow-sm">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#111827] dark:text-[#F8FAFC] mb-2">
            1. Select Concern Category <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.value;
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    selected
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-500/20 dark:bg-blue-950/40 dark:border-blue-500'
                      : 'bg-[#F3F4F6] border-[#E5E7EB] hover:border-slate-300 dark:bg-[#0F172A]/60 dark:border-[#334155] dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-semibold text-sm text-[#111827] dark:text-[#F8FAFC]">{cat.label}</span>
                    {selected && (
                      <span className="w-4 h-4 rounded-full bg-blue-600 text-white dark:bg-blue-500 flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#6B7280] dark:text-[#CBD5E1]">{cat.desc}</span>
                </button>
              );
            })}
          </div>
          {errors.category && <p className="text-xs text-rose-500 mt-2">{errors.category}</p>}
        </div>

        {/* Narrative Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="description" className="block text-sm font-semibold text-[#111827] dark:text-[#F8FAFC]">
              2. Factual Narrative / Description <span className="text-rose-500">*</span>
            </label>
            <span
              className={`text-xs font-mono ${
                description.trim().length < 20 || description.trim().length > 5000
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-[#6B7280] dark:text-[#CBD5E1]'
              }`}
            >
              {description.trim().length} / 5000 chars (min 20)
            </span>
          </div>
          <textarea
            id="description"
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please detail what occurred, dates, parties involved, or affected systems. Be as objective and factual as possible..."
            className="w-full p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] dark:placeholder-[#64748B] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 text-sm leading-relaxed"
          />
          {errors.description && (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Evidence URL */}
        <div>
          <label htmlFor="evidenceUrl" className="block text-sm font-semibold text-[#111827] dark:text-[#F8FAFC] mb-1 flex items-center gap-2">
            <span>3. Optional Supporting Evidence URL</span>
            <span className="text-xs font-normal text-[#6B7280] dark:text-[#CBD5E1] font-mono">(Cloud drive, logs, document link)</span>
          </label>
          <div className="relative">
            <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="evidenceUrl"
              type="url"
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://drive.example.com/s/sample-evidence or https://..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] dark:placeholder-[#64748B] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 text-sm font-mono"
            />
          </div>
          {errors.evidenceUrl ? (
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errors.evidenceUrl}</span>
            </p>
          ) : (
            <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-1">
              Must begin with http:// or https://. External link only. Do not upload files directly with personal metadata.
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#6B7280] dark:text-[#CBD5E1]">
            <ShieldAlert className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Case tracking token will be generated on submission.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20 active:scale-[0.99] cursor-pointer"
          >
            <span>Review & Lodge Report</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Confirmation Step Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-w-lg w-full bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">Confirm Confidential Submission</h3>
              <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#CBD5E1] mt-1">
                Please double-check your submission. Once lodged, a collision-safe case code will be generated to track
                moderator updates.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/70 border border-[#E5E7EB] dark:border-[#334155] text-xs space-y-2">
              <div>
                <span className="text-[#6B7280] dark:text-[#CBD5E1] font-mono">Category: </span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">{category}</span>
              </div>
              <div>
                <span className="text-[#6B7280] dark:text-[#CBD5E1] font-mono">Description length: </span>
                <span className="text-[#111827] dark:text-[#F8FAFC] font-mono">{description.trim().length} characters</span>
              </div>
              {evidenceUrl.trim() && (
                <div className="truncate">
                  <span className="text-[#6B7280] dark:text-[#CBD5E1] font-mono">Evidence: </span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{evidenceUrl.trim()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-slate-100 dark:text-[#CBD5E1] dark:hover:text-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Go Back & Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmedSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Lodge Report...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Submit</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
