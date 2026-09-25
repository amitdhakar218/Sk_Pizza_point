import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminLoginPage: React.FC = () => {
  const { loginAdminWithPasscode, isAdmin, navigate, showToast } = useApp();
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await loginAdminWithPasscode(passcode);
    if (res.success) {
      showToast('Welcome back, Admin!', 'success');
      navigate('/admin');
    } else {
      showToast(res.error || 'Invalid Admin Passcode. Try "admin123" or your designated key.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[75vh] bg-[#FFFDF9] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-amber-300 shadow-2xl space-y-6 animate-scale-up">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#1E1915] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#1E1915]">SK Pizza Point Admin Studio</h1>
          <p className="text-xs text-[#6B5B4F] max-w-xs mx-auto">
            Manage your live menu items, background video/image toggles, YouTube reels, and orders.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
              Master Admin Passcode
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="Enter admin passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-300 bg-neutral-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <p className="text-[10px] text-[#8A7B70] mt-1">
              Default passcode: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">admin123</code> or <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-bold">skpizzaadmin</code>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Enter Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-[#55473E] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Firebase Realtime Database syncing enabled.</span>
        </div>
      </div>
    </div>
  );
};
