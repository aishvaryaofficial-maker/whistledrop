import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, FilePlus, Search, LogIn, LogOut, LayoutDashboard, Sun, Moon, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Submit Report', path: '/report', icon: FilePlus },
    { label: 'Track Report', path: '/track', icon: Search },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-[#0F172A]/90 border-b border-[#E5E7EB] dark:border-[#334155] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 dark:border-blue-400/40 flex items-center justify-center group-hover:border-blue-500/60 transition-colors shadow-sm shadow-blue-500/10">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-lg sm:text-xl text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
                WHISTLE<span className="text-blue-600 dark:text-blue-400">DROP</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-[#6B7280] dark:text-[#CBD5E1] font-mono -mt-1 hidden sm:block">
                Speak Without Being Seen
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm dark:bg-[#1E293B] dark:text-blue-400 dark:border-[#334155]'
                      : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] dark:text-[#CBD5E1] dark:hover:text-white dark:hover:bg-[#1E293B]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-[#6B7280] dark:text-[#CBD5E1]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] dark:text-[#CBD5E1] dark:hover:text-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#334155] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>

            {/* Moderator Status / Auth button */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-[#E5E7EB] dark:border-[#334155]">
                <Link
                  to="/moderator/dashboard"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                    isActive('/moderator')
                      ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/60'
                      : 'bg-[#F3F4F6] text-[#111827] border-[#E5E7EB] hover:bg-slate-200 dark:bg-[#1E293B] dark:text-[#F8FAFC] dark:border-[#334155] dark:hover:bg-slate-700'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Dashboard</span>
                  {user?.username && (
                    <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#CBD5E1] bg-white dark:bg-[#0F172A] px-1.5 py-0.5 rounded border border-[#E5E7EB] dark:border-[#334155]">
                      @{user.username}
                    </span>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-[#6B7280] hover:text-rose-600 hover:bg-rose-50 dark:text-[#CBD5E1] dark:hover:text-rose-400 dark:hover:bg-rose-950/20 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/40 transition-colors cursor-pointer"
                  aria-label="Logout moderator"
                  title="Logout moderator"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/moderator/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#6B7280] hover:text-[#111827] bg-[#F3F4F6] hover:bg-slate-200 dark:text-[#CBD5E1] dark:hover:text-white dark:bg-[#1E293B] dark:hover:bg-slate-700 border border-[#E5E7EB] dark:border-[#334155] transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-[#6B7280] dark:text-[#CBD5E1]" />
                <span>Moderator</span>
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] dark:text-[#CBD5E1] dark:hover:text-white dark:hover:bg-[#1E293B] border border-transparent hover:border-[#E5E7EB] dark:hover:border-[#334155] transition-colors cursor-pointer"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-600" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#111827] dark:text-[#F8FAFC] bg-[#F3F4F6] dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] dark:border-[#334155] bg-white dark:bg-[#0F172A] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active
                    ? 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-[#1E293B] dark:text-blue-400 dark:border-[#334155]'
                    : 'text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] dark:text-[#CBD5E1] dark:hover:text-white dark:hover:bg-[#1E293B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-[#6B7280] dark:text-[#CBD5E1]'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#334155] flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/moderator/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800/40"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Moderator Dashboard ({user?.username})</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/moderator/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] dark:text-[#CBD5E1] dark:hover:text-white dark:hover:bg-[#1E293B]"
              >
                <LogIn className="w-4 h-4" />
                <span>Moderator Access</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
