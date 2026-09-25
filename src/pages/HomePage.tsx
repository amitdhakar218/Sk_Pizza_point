import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  MessageCircle,
  Pizza,
  UtensilsCrossed,
} from 'lucide-react';
import { VideoHero } from '../components/VideoHero';
import { FoodStorytelling } from '../components/FoodStorytelling';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../context/AppContext';

export const HomePage: React.FC = () => {
  const { products, reviews, settings, navigate } = useApp();

  const featuredPizzas = products.filter((p) => p.category === 'pizza').slice(0, 3);
  const featuredSnacks = products.filter((p) => p.category !== 'pizza').slice(0, 3);
  const approvedReviews = reviews.filter((r) => r.isApproved).slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-20">
      {/* 1. Cinematic Full-Background Video/Image Hero */}
      <VideoHero />

      {/* 2. Restaurant Value Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1E1915]">Stone-Oven Baked</h4>
              <p className="text-[11px] text-[#6B5B4F]">Crisp golden crust</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1E1915]">15-Min Prep</h4>
              <p className="text-[11px] text-[#6B5B4F]">Made fresh to order</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1E1915]">Pure Mozzarella</h4>
              <p className="text-[11px] text-[#6B5B4F]">100% genuine cheese</p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/80 shadow-sm flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-[#1E1915]">Direct WhatsApp</h4>
              <p className="text-[11px] text-[#6B5B4F]">Fast order dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Food Storytelling Category Showcase */}
      <FoodStorytelling />

      {/* 4. Real Restaurant Storefront & Heritage Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-amber-200/80 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Storefront Photograph */}
          <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-full min-h-[320px] bg-neutral-900">
            <img
              src={settings.heroImageUrl || 'https://i.imgur.com/ofhMdHe.jpeg'}
              alt="SK Pizza Point Storefront"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
            <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider inline-block">
                Storefront
              </span>
              <p className="text-xs sm:text-sm text-neutral-100 font-semibold">
                Real atmosphere, warm hospitality & oven-hot dining at SK Pizza Point.
              </p>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700">
                <Sparkles className="w-4 h-4" />
                <span>Our Heritage & Quality</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1E1915] leading-tight">
                Crafting Every Slice with Fresh Dough & Love
              </h2>
              <p className="text-xs sm:text-sm text-[#55473E] leading-relaxed">
                {settings.aboutStory}
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-[#1E1915] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Handcrafted slow-fermented dough prepared daily</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#1E1915] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Sun-ripened tomato herb marinara sauce made from scratch</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#1E1915] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Crispy grilled sandwiches with golden butter and rich cheese</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => navigate('/contact')}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Store Directions</span>
              </button>
              <button
                onClick={() => navigate('/gallery')}
                className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1E1915] font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                View Photo Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Pizza Selection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
              <Pizza className="w-4 h-4" />
              <span>Signature Selections</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1915]">
              Popular Stone-Oven Pizzas
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu/pizza')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
          >
            <span>View All Pizzas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featuredPizzas.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Popular Burgers & Sandwiches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-700 mb-1">
              <UtensilsCrossed className="w-4 h-4" />
              <span>Crispy & Grilled Snacks</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1915]">
              Fresh Burgers & Sandwiches
            </h2>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-amber-700 hover:text-amber-800 transition-colors cursor-pointer"
          >
            <span>Explore Complete Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featuredSnacks.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Real Guest Reviews Snapshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Star className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>Customer Love</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1915]">Words from Our Guests</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {approvedReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border border-amber-200/80 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#45382E] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>
              <div className="pt-2.5 border-t border-amber-100 flex items-center justify-between text-xs">
                <span className="font-extrabold text-[#1E1915]">{rev.customerName}</span>
                <span className="text-[#8A7B70]">Verified Guest</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-1">
          <button
            onClick={() => navigate('/reviews')}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-extrabold text-amber-800 hover:text-amber-900 hover:underline cursor-pointer"
          >
            <span>Read All Verified Reviews or Leave One →</span>
          </button>
        </div>
      </section>

      {/* 8. WhatsApp Direct Order Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-amber-600 p-7 sm:p-10 text-slate-950 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="px-2.5 py-0.5 rounded-full bg-white/25 text-slate-950 text-[10px] font-black uppercase tracking-wider inline-block">
              Fast Order Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready for a Piping-Hot Feast?
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-amber-950">
              Send your order directly to WhatsApp (+91 96171 42439) with custom sizes, delivery address, and zero wait time!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={() => navigate('/menu')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1E1915] hover:bg-neutral-800 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Order from Menu
            </button>
            <a
              href={settings.whatsAppDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Direct Chat</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
