import React, { useState } from 'react';
import { User, Lock, Mail, Phone, LogIn, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CustomerAuthPage: React.FC = () => {
  const {
    currentUser,
    loginCustomer,
    registerCustomer,
    navigate,
    showToast,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to Account
  React.useEffect(() => {
    if (currentUser) {
      navigate('/account');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const res = await loginCustomer(email.trim(), password);
        if (res.success) {
          showToast('Welcome back!', 'success');
          navigate('/account');
        } else {
          showToast(res.error || 'Login failed. Please check your credentials.', 'error');
        }
      } else {
        if (!name.trim()) {
          showToast('Please provide your name', 'error');
          setLoading(false);
          return;
        }
        const res = await registerCustomer(email.trim(), password, name.trim(), phone.trim());
        if (res.success) {
          showToast('Account created successfully!', 'success');
          navigate('/account');
        } else {
          showToast(res.error || 'Failed to create account.', 'error');
        }
      }
    } catch (err: any) {
      const msg = err?.message || 'Authentication failed. Please check credentials.';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-[#FFFDF9] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xl space-y-6 animate-scale-up">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-sm">
            <User className="w-6 h-6 text-amber-700" />
          </div>
          <h1 className="text-2xl font-black text-[#1E1915]">
            {mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h1>
          <p className="text-xs text-[#6B5B4F]">
            {mode === 'login'
              ? 'Access your saved delivery address & view your previous orders.'
              : 'Save your profile and view your past orders on any device.'}
          </p>
        </div>

        {/* Form Mode Selector */}
        <div className="grid grid-cols-2 gap-1.5 bg-neutral-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-[#1E1915] shadow-sm'
                : 'text-[#6B5B4F] hover:text-[#1E1915]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-[#1E1915] shadow-sm'
                : 'text-[#6B5B4F] hover:text-[#1E1915]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Inputs */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Gupta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing In...' : 'Sign In to Account'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Creating...' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-amber-100 flex items-center justify-between text-xs text-[#6B5B4F]">
          <span className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Firebase Secure Auth</span>
          </span>
          <button
            onClick={() => navigate('/menu')}
            className="font-bold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Order as Guest</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
