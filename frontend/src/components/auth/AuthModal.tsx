import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, X, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { LogoIcon } from '../common/Logo.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  initialMode?: 'login' | 'register';
}

const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, password);
        onSuccess(res.user);
      } else {
        if (!fullName.trim()) {
          setError('Full name is required');
          setIsLoading(false);
          return;
        }
        const res = await api.register(email, password, fullName);
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.oauthLogin(provider);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.demoLogin();
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to start demo session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white dark:glass-card border border-slate-200 dark:border-white/[0.12] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <LogoIcon size={44} />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'login'
              ? 'Sign in to access your customized opportunity intelligence pipeline'
              : 'Sign up to build your verified capability profile and automate job matches'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 dark:bg-surface-950 p-1 rounded-xl border border-slate-200 dark:border-white/[0.08] mb-4">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'login'
                ? 'bg-white dark:bg-surface-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/[0.1]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'register'
                ? 'bg-white dark:bg-surface-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-white/[0.1]'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Social Auth Providers (Google & GitHub) */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button
            type="button"
            onClick={() => handleSocialSignIn('google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-surface-950 hover:bg-slate-50 dark:hover:bg-surface-800 border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
          >
            <GoogleIcon className="w-4 h-4" />
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn('github')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white dark:bg-surface-950 hover:bg-slate-50 dark:hover:bg-surface-800 border border-slate-200 dark:border-white/[0.1] text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
          >
            <GithubIcon className="w-4 h-4 text-slate-900 dark:text-white" />
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-wider">
            <span className="bg-white dark:bg-surface-900 px-3 text-slate-400">or continue with email</span>
          </div>
        </div>

        {/* Error notice */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-2.5 text-xs text-rose-600 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-white/[0.08] focus:border-emerald-500/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-white/[0.08] focus:border-emerald-500/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-surface-950 border border-slate-200 dark:border-white/[0.08] focus:border-emerald-500/60 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white dark:text-surface-950 text-xs font-bold tracking-wide transition shadow-md shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white dark:border-surface-950 border-t-transparent animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/[0.08]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-white dark:bg-surface-900 px-3 text-slate-500">or instant preview</span>
          </div>
        </div>

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-surface-950 hover:bg-slate-200 dark:hover:bg-surface-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/[0.1] transition flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
          <span>Continue with 1-Click Demo Profile</span>
        </button>
      </div>
    </div>
  );
};
