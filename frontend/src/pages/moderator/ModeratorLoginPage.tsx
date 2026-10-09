import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, User, LogIn, ArrowLeft, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Alert } from '../../components/common/Alert';

export const ModeratorLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Where to redirect after login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/moderator/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Both username and password are required.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({ username: username.trim(), password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please verify your username and password.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const fillTestCredentials = () => {
    setUsername('moderator');
    setPassword('Admin@12345');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 py-12">
      {/* Return home link */}
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111827] dark:text-[#CBD5E1] dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Intake</span>
        </Link>
      </div>

      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#334155] shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400 shadow-md shadow-blue-500/10">
            <Shield className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F8FAFC] tracking-tight">Moderator Portal</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#CBD5E1] mt-1 font-mono">
            Authenticated administrative access for compliance officers
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            title="Authentication Failed"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#CBD5E1] mb-1.5 font-mono">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter moderator username"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] dark:placeholder-[#64748B] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 text-sm font-sans"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] dark:text-[#CBD5E1] mb-1.5 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-[#F3F4F6] dark:bg-[#0F172A] border border-[#E5E7EB] dark:border-[#334155] rounded-xl text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] dark:placeholder-[#64748B] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 dark:focus:border-blue-400 dark:focus:ring-blue-400 text-sm font-sans"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20 inline-flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Authenticate & Access Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Development Seed Account Helper */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#334155] text-xs">
          <div className="p-3 rounded-xl bg-[#F3F4F6] dark:bg-[#0F172A]/60 border border-[#E5E7EB] dark:border-[#334155]/80 text-[#6B7280] dark:text-slate-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-[#111827] dark:text-slate-300 block mb-1">Default Seed Account:</span>
              <p className="font-mono text-[11px] text-[#6B7280] dark:text-slate-400">
                User: <span className="text-blue-600 dark:text-blue-400 font-semibold">moderator</span> &nbsp;|&nbsp; Pass:{' '}
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Admin@12345</span>
              </p>
              <button
                type="button"
                onClick={fillTestCredentials}
                className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Auto-fill credentials &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
