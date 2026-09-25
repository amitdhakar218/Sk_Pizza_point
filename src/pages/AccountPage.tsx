import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  MapPin,
  Save,
  LogOut,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountPage: React.FC = () => {
  const {
    currentUser,
    userProfile,
    updateCustomerProfile,
    logout,
    orders,
    formatPrice,
    navigate,
    generateWhatsAppUrl,
    showToast,
  } = useApp();

  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [defaultAddress, setDefaultAddress] = useState(userProfile?.defaultAddress || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [pinCode, setPinCode] = useState(userProfile?.pinCode || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '');
      setPhone(userProfile.phone || '');
      setDefaultAddress(userProfile.defaultAddress || '');
      setCity(userProfile.city || '');
      setPinCode(userProfile.pinCode || '');
    }
  }, [userProfile]);

  // Filter orders related to this customer (by userId, or phone/email)
  const userOrders = orders.filter((o) => {
    if (currentUser && o.userId === currentUser.uid) return true;
    if (currentUser?.email && o.customerEmail === currentUser.email) return true;
    if (userProfile?.phone && o.customerPhone === userProfile.phone) return true;
    return false;
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const ok = await updateCustomerProfile({
        displayName: displayName.trim(),
        phone: phone.trim(),
        defaultAddress: defaultAddress.trim(),
        city: city.trim(),
        pinCode: pinCode.trim(),
      });
      if (ok) {
        showToast('Profile & delivery details saved safely to Firebase!', 'success');
      } else {
        showToast('Could not save profile. Please check connection.', 'error');
      }
    } catch {
      showToast('Error saving profile. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully.', 'info');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5 text-amber-700" />
              <span>Customer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1915]">
              Hello, {displayName || 'Pizza Lover'}!
            </h1>
            <p className="text-xs text-[#6B5B4F] mt-0.5">
              {currentUser ? currentUser.email : 'Local Guest Account'} • Firebase Synced
            </p>
          </div>

          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1E1915] text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-600" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
              >
                Login with Email
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Saved Profile & Delivery Address Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-amber-200 shadow-md space-y-5">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-[#1E1915] flex items-center gap-2">
                <User className="w-4 h-4 text-amber-600" />
                <span>Default Address & Profile</span>
              </h2>
              <p className="text-xs text-[#6B5B4F]">
                Changes saved here will auto-fill your next checkout so you never have to type it again!
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  Contact / WhatsApp Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  Default Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <textarea
                    rows={2}
                    placeholder="House/Street, landmark..."
                    value={defaultAddress}
                    onChange={(e) => setDefaultAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving to Database...' : 'Save Profile Changes'}</span>
              </button>
            </form>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2 text-xs text-[#55473E]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Saved in Firebase database securely for quick reordering.</span>
            </div>
          </div>

          {/* Right: Order History & Real-Time Status */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-[#1E1915] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>Your Order History ({userOrders.length})</span>
              </h2>
              <button
                onClick={() => navigate('/menu')}
                className="text-xs font-bold text-amber-800 hover:underline cursor-pointer"
              >
                + Place New Order
              </button>
            </div>

            {userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 border border-amber-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl">
                  🍕
                </div>
                <h3 className="font-extrabold text-sm text-[#1E1915]">No past orders found</h3>
                <p className="text-xs text-[#6B5B4F] max-w-sm mx-auto">
                  When you place an order, your complete receipt and status will appear here!
                </p>
                <button
                  onClick={() => navigate('/menu')}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer active:scale-95"
                >
                  Order Food Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const whatsAppUrl = generateWhatsAppUrl(order);
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-5 border border-amber-200/80 shadow-sm space-y-3"
                    >
                      {/* Top Header of Order */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2.5 border-b border-amber-100">
                        <div>
                          <span className="font-mono text-xs font-black text-amber-900 block">
                            {order.id}
                          </span>
                          <span className="text-[11px] text-[#6B5B4F]">
                            {new Date(order.createdAt).toLocaleString(undefined, {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold capitalize ${
                              order.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.status === 'Preparing'
                                ? 'bg-amber-100 text-amber-800'
                                : order.status === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className="font-black text-sm text-[#1E1915]">
                            {formatPrice(order.finalTotal)}
                          </span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-1.5 text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-[#45382E]">
                            <span>
                              <strong>{it.quantity}x</strong> {it.productName} ({it.size})
                            </span>
                            <span className="font-bold">{formatPrice(it.totalPrice)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer actions & re-send WhatsApp */}
                      <div className="pt-2 border-t border-amber-50 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-[#6B5B4F]">
                          {order.orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}
                        </span>
                        <a
                          href={whatsAppUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Re-open WhatsApp Order</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
