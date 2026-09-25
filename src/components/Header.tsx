import React, { useState, useEffect } from 'react';
import {
  Home,
  ShoppingBag,
  Menu as MenuIcon,
  X,
  Phone,
  Lock,
  User as UserIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentPath,
    navigate,
    cartCount,
    setIsCartOpen,
    settings,
    currentUser,
    userProfile,
    isAdmin,
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Menu', path: '/menu' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Videos', path: '/videos' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const isHomeActive = currentPath === '/' || currentPath === '';

  const isActive = (path: string) => {
    if (path === '/' && isHomeActive) return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FFFDF9]/95 backdrop-blur-md shadow-md border-b border-amber-200/80 py-2.5'
          : 'bg-[#FFFDF9] border-b border-amber-100 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer transition-transform duration-200 hover:scale-[1.02] shrink-0"
            id="brand-logo-button"
            title="Go to Homepage"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-amber-50 shrink-0 flex items-center justify-center">
              {!imgError ? (
                <img
                  src={settings.logoUrl}
                  alt={settings.restaurantName}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xs sm:text-sm">
                  SK
                </div>
              )}
            </div>
            <div>
              <span className="font-black text-lg sm:text-xl tracking-tight text-[#1E1915] block leading-tight">
                {settings.restaurantName}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-amber-800 block tracking-wide">
                Fresh • Hot • Real Cheese
              </span>
            </div>
          </button>

          {/* Home Button (Always Visible in Title Bar for immediate return) */}
          <button
            id="btn-always-home"
            onClick={() => handleNavClick('/')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
              isHomeActive
                ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-amber-500/20'
                : 'bg-white hover:bg-amber-50 text-[#1E1915] border border-amber-200 hover:border-amber-300'
            }`}
            title="Return to Home Screen from anywhere"
          >
            <Home className="w-4 h-4 text-slate-950" />
            <span>Home</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-amber-50/70 px-2.5 py-1 rounded-full border border-amber-200/70">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-[#55473E] hover:text-[#1E1915] hover:bg-amber-100/60'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right Action Area */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Customer Account / Sign In */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick('/account')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  currentPath === '/account'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                    : 'bg-white border-amber-200 text-[#1E1915] hover:bg-amber-50'
                }`}
                title="My Profile & Orders"
              >
                <div className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-black">
                  {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="max-w-[100px] truncate">
                  {userProfile?.displayName?.split(' ')[0] || 'My Orders'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('/login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#45382E] hover:text-[#1E1915] hover:bg-amber-100/60 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-700" />
                <span>Sign In</span>
              </button>
            )}

            {/* Admin Studio Link */}
            <button
              onClick={() => handleNavClick(isAdmin ? '/admin' : '/admin/login')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isAdmin
                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                  : 'text-[#6B5B4F] hover:text-amber-800 hover:bg-amber-100/60'
              }`}
              title={isAdmin ? 'Admin Studio (Active)' : 'Admin Studio Login'}
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              id="btn-desktop-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-amber-200 hover:border-amber-300 text-[#1E1915] font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Now Button */}
            <button
              id="btn-desktop-order-now"
              onClick={() => handleNavClick('/menu')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Order Now
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex lg:hidden items-center gap-1.5">
            {/* Mobile Account Icon */}
            <button
              onClick={() => handleNavClick(currentUser ? '/account' : '/login')}
              className="p-2 rounded-xl bg-white border border-amber-200 text-[#1E1915] shadow-sm cursor-pointer active:scale-95"
              aria-label="Account"
              title="Account"
            >
              <UserIcon className="w-4 h-4 text-amber-700" />
            </button>

            {/* Cart icon */}
            <button
              id="btn-mobile-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl bg-white border border-amber-200 text-[#1E1915] shadow-sm cursor-pointer active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger menu button */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-amber-100 text-amber-950 hover:bg-amber-200 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-[#FFFDF9] border-b border-amber-200 p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            {/* Quick Home button inside drawer */}
            <button
              onClick={() => handleNavClick('/')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-black text-sm transition-colors cursor-pointer ${
                isHomeActive
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-white text-[#1E1915] border border-amber-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Home className="w-4 h-4" />
                <span>Home Page</span>
              </div>
              <span className="text-xs opacity-75">➜</span>
            </button>

            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
                      active
                        ? 'bg-amber-500 text-slate-950'
                        : 'text-[#1E1915] hover:bg-amber-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs opacity-60">➜</span>
                  </button>
                );
              })}

              {/* Mobile Account link */}
              <button
                onClick={() => handleNavClick(currentUser ? '/account' : '/login')}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl font-bold text-sm text-[#1E1915] hover:bg-amber-50 border border-amber-100 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-amber-700" />
                  <span>{currentUser ? 'My Profile & Orders' : 'Sign In / Register'}</span>
                </div>
                <span className="text-xs opacity-60">➜</span>
              </button>
            </div>

            <div className="pt-3 border-t border-amber-200/80 space-y-2.5">
              <button
                onClick={() => handleNavClick('/menu')}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-sm text-center shadow-md cursor-pointer"
              >
                Order Fresh Pizza Now
              </button>
              <div className="flex items-center justify-between gap-2.5 pt-1">
                <a
                  href={`tel:${settings.whatsAppNumber}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 text-[#1E1915] text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>Call Us</span>
                </a>
                <button
                  onClick={() => handleNavClick(isAdmin ? '/admin' : '/admin/login')}
                  className="flex-1 py-2 px-3 rounded-xl bg-neutral-100 text-[#1E1915] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Admin Studio</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
