import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, EyeOff, Hash } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand info */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold text-slate-100 tracking-tight text-lg">
              WHISTLE<span className="text-emerald-400">DROP</span>
            </span>
          </div>
          <p className="text-sm text-slate-300 font-medium">
            "Speak Without Being Seen"
          </p>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            WhistleDrop provides a secure, anonymous intake platform for reporting security vulnerabilities,
            corruption, harassment, and critical organizational concerns without accounts or identity disclosure.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 font-mono">
            <span className="flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400/80" /> Stateless API
            </span>
            <span className="flex items-center gap-1">
              <EyeOff className="w-3 h-3 text-cyan-400/80" /> Zero Identity Intake
            </span>
            <span className="flex items-center gap-1">
              <Hash className="w-3 h-3 text-indigo-400/80" /> Collision-Safe Codes
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Public Intake
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/report" className="hover:text-emerald-400 transition-colors">
                Submit Confidential Report
              </Link>
            </li>
            <li>
              <Link to="/track" className="hover:text-emerald-400 transition-colors">
                Track Case by Code
              </Link>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                Reporting Protocol
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-emerald-400 transition-colors">
                Intake FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Operational / Moderator Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
            Administration
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link to="/moderator/login" className="hover:text-emerald-400 transition-colors">
                Moderator Portal
              </Link>
            </li>
            <li>
              <Link to="/moderator/dashboard" className="hover:text-emerald-400 transition-colors">
                Triage Dashboard
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
                className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
              >
                OpenAPI / Swagger Spec
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} WhistleDrop Confidential Reporting Network. All rights reserved.</p>
        <p className="text-[11px] text-slate-400 font-mono">
          Security intake node: <span className="text-emerald-400">ONLINE</span>
        </p>
      </div>
    </footer>
  );
};
