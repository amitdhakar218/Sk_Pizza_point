import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings, currentPath } = useApp();
  const [showTooltip, setShowTooltip] = useState(true);

  if (currentPath.startsWith('/admin')) {
    return null;
  }

  const cleanPhone = settings.whatsAppNumber.replace(/[^0-9]/g, '');
  const whatsAppDirect = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello SK Pizza Point! I want to inquire about your menu and place an order.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 select-none">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#1E1915] text-white text-xs font-semibold shadow-xl border border-amber-400/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Quick WhatsApp Order</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-neutral-400 hover:text-white ml-1 p-0.5 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        id="btn-floating-whatsapp"
        href={whatsAppDirect}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-2xl hover:bg-[#20bd5a] hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 cursor-pointer"
        aria-label="Chat with SK Pizza Point on WhatsApp"
        title="Direct WhatsApp: +91 96171 42439"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </a>
    </div>
  );
};
