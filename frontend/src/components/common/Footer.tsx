import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, Hash } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[#E5E7EB] dark:border-[#334155] bg-[#F3F4F6] dark:bg-[#0F172A] text-[#6B7280] dark:text-[#CBD5E1] py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand info */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-400/40 flex items-center justify-center">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight text-lg">
              WHISTLE<span className="text-blue-600 dark:text-blue-400">DROP</span>
            </span>
          </div>
          <p className="text-sm text-[#111827] dark:text-[#F8FAFC] font-medium">
            "Speak Without Being Seen"
          </p>
          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] max-w-md leading-relaxed">
            WhistleDrop provides a secure, anonymous intake platform for reporting security vulnerabilities,
            corruption, harassment, and critical organizational concerns without accounts or identity disclosure.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#6B7280] dark:text-[#CBD5E1] pt-2 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-blue-600 dark:text-blue-400" /> Stateless API
            </span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-3 h-3 text-blue-500 dark:text-blue-300" /> Zero Identity Intake
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> Collision-Safe Codes
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] mb-3">
            Public Intake
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/report" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Submit Confidential Report
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Track Case by Code
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Reporting Protocol
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Intake FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Operational / Moderator Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] mb-3">
            Administration
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/moderator/login" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Moderator Portal
              </Link>
            </li>
            <li>
              <Link to="/moderator/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Triage Dashboard
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-1"
              >
                OpenAPI / Swagger Spec
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#E5E7EB] dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] dark:text-[#CBD5E1]">
        <p>© {CURRENT_YEAR} WhistleDrop Confidential Reporting Network. All rights reserved.</p>
        <p className="text-[11px] font-mono">
          Security intake node: <span className="text-blue-600 dark:text-blue-400 font-semibold">ONLINE</span>
        </p>
      </div>
    </footer>
  );
};
