import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { settings, showToast } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const cleanPhone = settings.whatsAppNumber.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Compose a direct WhatsApp link
    const text = `Hello SK Pizza Point! My name is ${name || 'Guest'} (${phone || 'No phone'}). Message: ${message}`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    setSent(true);
    showToast('Opening WhatsApp with your inquiry!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Visit Us or Contact</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1915]">
            We'd Love to Hear from You
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B4F]">
            Reach out for dine-in queries, takeaway orders, birthday celebrations, or catering orders.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info & Map Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-5">
              <h2 className="text-xl font-black text-[#1E1915]">Restaurant Location & Timings</h2>

              <div className="space-y-4 text-xs sm:text-sm text-[#45382E]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1E1915]">Address</h4>
                    <p className="text-[#6B5B4F] mt-0.5 leading-relaxed">{settings.address}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-800 hover:text-amber-900 mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1E1915]">Phone & WhatsApp</h4>
                    <p className="text-[#6B5B4F] mt-0.5">{settings.phone || settings.whatsAppNumber}</p>
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-800 mt-1"
                    >
                      <span>Chat on WhatsApp ({settings.whatsAppNumber})</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1E1915]">Operating Hours</h4>
                    <p className="text-[#6B5B4F] mt-0.5">{settings.openingHours}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Open Today for Dine-in & Takeaway
                    </span>
                  </div>
                </div>

                {settings.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-neutral-100 text-neutral-800 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-neutral-600" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-[#1E1915]">Email</h4>
                      <p className="text-[#6B5B4F] mt-0.5">{settings.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick WhatsApp Action Box */}
            <div className="bg-[#E8F8EE] rounded-3xl p-6 border border-emerald-200 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="font-black text-sm text-emerald-950">Quick WhatsApp Ordering</h4>
                <p className="text-xs text-emerald-800">
                  Prefer instant chat? Reach our chef directly with your order.
                </p>
              </div>
              <a
                href={settings.whatsAppDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Message</span>
              </a>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md space-y-5">
            <h3 className="text-xl font-black text-[#1E1915]">Send Us an Inquiry</h3>
            <p className="text-xs text-[#6B5B4F]">
              Fill in your query below and we will automatically open WhatsApp with your message ready to send.
            </p>

            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-black text-sm text-emerald-950">Message Sent!</h4>
                <p className="text-xs text-emerald-800">
                  Thank you! We will respond promptly.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow cursor-pointer active:scale-95"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ankit Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Ask about bulk party orders, delivery distance, or menu items..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
