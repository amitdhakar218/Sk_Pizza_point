import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Flame, Sparkles, MessageCircle, MapPin, ArrowRight, ShieldCheck, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VideoHero: React.FC = () => {
  const { settings, navigate } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoFailed, setVideoFailed] = useState<boolean>(false);

  const isVideoMode = settings.heroMediaType !== 'image';

  // Ensure video autoplays smoothly on mount
  useEffect(() => {
    if (videoRef.current && isVideoMode) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback: video remains ready
      });
    }
  }, [isVideoMode, settings.homepageVideoUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const videoUrl =
    settings.homepageVideoUrl ||
    'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-pizza-baking-in-an-oven-43956-large.mp4';
  const posterUrl =
    settings.homepageVideoPosterUrl ||
    settings.heroImageUrl ||
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80';
  const heroImageUrl = settings.heroImageUrl || posterUrl;

  return (
    <section className="relative w-full min-h-[82vh] lg:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#120E0B] text-white">
      {/* Background Media Container (Video or Image) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
        {isVideoMode && !videoFailed ? (
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoFailed(true)}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
        ) : (
          <img
            src={heroImageUrl}
            alt="SK Pizza Point Background"
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
          />
        )}

        {/* Balanced optical overlay: bright, vibrant, and appetizing food view without excessive darkness */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120E0B]/85 via-black/30 to-[#120E0B]/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 flex flex-col items-center text-center">
        {/* Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/25 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs sm:text-sm font-black tracking-wide uppercase shadow-lg shadow-amber-950/40 mb-5 animate-scale-up">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Handcrafted Stone-Oven Crusts</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-white font-extrabold">Starting at ₹49</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.08] sm:leading-[1.05] drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]">
          Freshly Oven-Baked. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300">
            Seriously Delicious.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg lg:text-xl text-neutral-100 max-w-2xl font-medium leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          100% pure mozzarella cheese, daily stone-ground rested dough, loaded crispy burgers, and butter-grilled sandwiches made fresh to your order.
        </p>

        {/* Feature Highlights */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-6 mt-6 text-xs sm:text-sm text-neutral-200 drop-shadow">
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">Real Mozzarella Cheese</span>
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">Daily Hand-Tossed Dough</span>
          </span>
          <span className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold">15-Min Fresh Kitchen Prep</span>
          </span>
        </div>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <button
            id="btn-hero-explore-menu"
            onClick={() => navigate('/menu')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            id="btn-hero-whatsapp-order"
            href={settings.whatsAppDirectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Order on WhatsApp (+91 96171 42439)</span>
          </a>

          <button
            id="btn-hero-directions"
            onClick={() => navigate('/contact')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Store Location</span>
          </button>
        </div>

        {/* Special Offer Highlight Banner */}
        {settings.offersText && (
          <div className="mt-6 px-5 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-semibold max-w-xl text-center shadow-lg">
            {settings.offersText}
          </div>
        )}
      </div>

      {/* Floating Video Pause/Play Toggle Button */}
      {isVideoMode && !videoFailed && (
        <div className="absolute bottom-5 right-5 z-20">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
            title={isPlaying ? 'Pause background video' : 'Play background video'}
            className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer active:scale-95 shadow-lg"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 text-neutral-400 flex flex-col items-center pointer-events-none opacity-80">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-300">Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce mt-0.5 text-amber-400" />
      </div>
    </section>
  );
};
