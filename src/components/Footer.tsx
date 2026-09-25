import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { settings, navigate } = useApp();
  const [logoError, setLogoError] = useState(false);

  return (
    <footer className="bg-[#181411] text-[#E5DCD4] pt-14 pb-10 border-t-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-800">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 bg-amber-100 flex items-center justify-center shrink-0">
                {!logoError ? (
                  <img
                    src={settings.logoUrl}
                    alt={settings.restaurantName}
                    onError={() => setLogoError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-amber-950 text-sm">SK</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-white">{settings.restaurantName}</h3>
                <p className="text-xs text-amber-400 font-semibold">{settings.tagline}</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#A8988C] leading-relaxed">{settings.description}</p>
            {/* Social media icons */}
            <div className="pt-2 flex items-center gap-2.5">
              {/* WhatsApp */}
              <a
                href={settings.whatsAppDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 flex items-center justify-center transition-colors cursor-pointer"
                title="Chat on WhatsApp"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              {/* Instagram */}
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-pink-600/20 text-pink-400 hover:bg-pink-600 hover:text-white border border-pink-500/30 flex items-center justify-center transition-colors cursor-pointer"
                title="Follow on Instagram"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              {/* Facebook (if configured) */}
              {settings.facebookUrl ? (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              ) : null}
              {/* YouTube (if configured) */}
              {settings.youtubeUrl ? (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white border border-red-500/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="YouTube Channel"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Navigation</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <button onClick={() => navigate('/')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/menu')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Full Menu
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/gallery')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Photo Gallery
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/videos')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Kitchen Videos
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/reviews')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Location & Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Menu Categories */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Specialties</h4>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => navigate('/menu/pizza')}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Handcrafted Pizzas</span>
                  <span className="text-amber-500 text-xs font-bold">From ₹69</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/menu/burger')}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Crispy Veg & Paneer Burgers</span>
                  <span className="text-amber-500 text-xs font-bold">From ₹49</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/menu/sandwich')}
                  className="hover:text-amber-400 transition-colors flex items-center justify-between w-full cursor-pointer"
                >
                  <span>Butter-Grilled Sandwiches</span>
                  <span className="text-amber-500 text-xs font-bold">From ₹49</span>
                </button>
              </li>
              <li className="pt-2 text-[11px] text-[#8A7B70]">
                Freshly prepared with 100% pure vegetarian ingredients.
              </li>
            </ul>
          </div>

          {/* Location & Timings */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Visit & Order</h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.whatsAppNumber}`} className="hover:text-amber-400 font-bold">
                  {settings.whatsAppNumber}
                </a>
              </div>
              <div className="pt-2">
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-xs border border-amber-500/40 transition-all cursor-pointer"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8A7B70]">
          <p>© {new Date().getFullYear()} SK Pizza Point. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="flex items-center gap-1 text-amber-400 hover:underline cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
