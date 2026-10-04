import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FilePlus,
  Search,
  Lock,
  EyeOff,
  Hash,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [quickCode, setQuickCode] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickCode.trim()) {
      navigate(`/track/${encodeURIComponent(quickCode.trim().toUpperCase())}`);
    }
  };

  const faqs = [
    {
      q: 'Do I need an account, email address, or phone number to submit a report?',
      a: 'Absolutely not. WhistleDrop has no sign-up or registration requirement. We do not ask for your name, email, phone number, or employee ID. You can submit your disclosure completely detached from your personal identity.',
    },
    {
      q: 'How do I know what happened to my report without logging in?',
      a: 'Upon successful submission, the system generates a unique, collision-safe case code (e.g., WD-9K4M8X2P). You can use this private code anytime on the Track page to view investigation milestones, moderator updates, and final resolutions.',
    },
    {
      q: 'What types of misconduct or issues can be reported?',
      a: 'WhistleDrop supports submissions under Security Vulnerabilities, Harassment or Bullying, Corruption & Financial Malpractice, Technical System Failures, or Other organizational concerns.',
    },
    {
      q: 'Can anyone else view my report details?',
      a: 'No. Reports are strictly accessible only by authorized compliance moderators with verified credentials, and by the individual holding the private case code. Public users cannot search or browse reports.',
    },
    {
      q: 'What should I do if I lose my case code?',
      a: 'Because WhistleDrop does not collect emails or credentials, there is intentionally no recovery mechanism for lost case codes. Please store your case code in a secure offline location immediately after submission.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-slate-800/60">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs sm:text-sm font-medium mb-8 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Zero-Knowledge Intake & High-Entropy Case Tracking</span>
          </div>

          {/* Brand & Tagline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
            WHISTLE<span className="text-emerald-400">DROP</span>
            <span className="block text-xl sm:text-3xl lg:text-4xl font-semibold text-slate-300 mt-3 font-sans">
              "Speak Without Being Seen"
            </span>
          </h1>

          {/* Supporting text */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
            A confidential, anonymous reporting network built for ethical disclosures. Report security
            vulnerabilities, harassment, or financial malpractice with zero account registration and cryptographically
            safe case tracking.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <FilePlus className="w-5 h-5 text-slate-950" />
              <span>Submit a Report</span>
            </Link>
            <Link
              to="/track"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer"
            >
              <Search className="w-5 h-5 text-slate-400" />
              <span>Track a Report</span>
            </Link>
          </div>

          {/* Quick Case Code Input Bar */}
          <div className="max-w-md mx-auto p-2 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-md">
            <form onSubmit={handleQuickTrack} className="flex items-center gap-2">
              <div className="relative flex-1">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={quickCode}
                  onChange={(e) => setQuickCode(e.target.value.toUpperCase())}
                  placeholder="Enter case code (e.g. WD-9K4M8X2P)"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={!quickCode.trim()}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 disabled:opacity-40 disabled:pointer-events-none transition-colors shrink-0 cursor-pointer"
              >
                Track
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Security & Privacy Pillars Section */}
      <section className="py-16 md:py-24 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 font-mono">
              Confidentiality First
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Built Specifically for Sensitive Disclosures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1: Anonymous */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <EyeOff className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Anonymous
                <span className="text-xs font-normal text-emerald-400 font-mono">Zero Accounts</span>
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No personal information, email, or credentials are requested or required. You submit purely factual
                information without leaving user identification footprints.
              </p>
            </div>

            {/* Pillar 2: Secure */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Lock className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Secure
                <span className="text-xs font-normal text-cyan-400 font-mono">Protected Intake</span>
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Strict input sanitization, TLS transport encryption, and role-based moderator access protect every
                intake payload against unauthorized tampering or inspection.
              </p>
            </div>

            {/* Pillar 3: Trackable */}
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-slate-700 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Hash className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                Trackable
                <span className="text-xs font-normal text-indigo-400 font-mono">Private Case Code</span>
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Our cryptographic collision-safe generator issues an unguessable case code (e.g. WD-XXXXXXXX). Use it
                to follow milestone updates while keeping your identity undisclosed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 bg-slate-950/80 border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 font-mono">
              Simple & Safe Process
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How WhistleDrop Works</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Submit Anonymously',
                desc: 'Select a category (Security, Corruption, Harassment, Technical, Other) and describe what transpired. Optionally include an external evidence URL.',
                icon: FilePlus,
              },
              {
                step: '02',
                title: 'Save Your Case Code',
                desc: 'Immediately receive your randomly generated private tracking token. Store it securely in a safe note or password manager.',
                icon: KeyRound,
              },
              {
                step: '03',
                title: 'Track Your Report',
                desc: 'Navigate to the tracking terminal whenever you want. Simply paste your case code to inspect progress without logging into any account.',
                icon: Search,
              },
              {
                step: '04',
                title: 'Follow Status Updates',
                desc: 'Review live chronological audit updates and investigation messages published by authorized compliance moderators.',
                icon: CheckCircle,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/80 relative group">
                  <div className="text-xs font-mono font-bold text-emerald-400/80 mb-3 tracking-wider">
                    STEP {item.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 text-emerald-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-2">{item.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="py-16 md:py-24 bg-slate-950 border-b border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-2 font-mono">
              Clear Answers
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm sm:text-base text-slate-200 hover:text-white transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reassurance Call-to-Action */}
      <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Submit a Confidential Disclosure?
            </h3>
            <p className="text-sm text-slate-400 max-w-xl mx-auto mb-8">
              Protect your organization by reporting issues early. Your report is processed with strict integrity and
              zero personal tracking.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/report"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <FilePlus className="w-4 h-4" />
                <span>Begin Confidential Report</span>
              </Link>
              <Link
                to="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer"
              >
                <span>Track Existing Case</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
