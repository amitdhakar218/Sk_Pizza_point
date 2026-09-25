import React, { useState } from 'react';
import { Pizza, Sandwich, UtensilsCrossed, ArrowRight, Sparkles, Check, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FoodStorytelling: React.FC = () => {
  const { navigate } = useApp();
  const [activeScene, setActiveScene] = useState<0 | 1 | 2>(0);

  const scenes = [
    {
      id: 'pizza',
      category: 'pizza',
      title: 'Scene 1: Hand-Tossed Pizzas',
      subtitle: 'The Soul of SK Pizza Point',
      tagline: 'Fresh Dough • 100% Real Mozzarella • Rich Herbs',
      description:
        'Every pizza begins with daily-kneaded artisanal dough stretched by hand, layered with our slow-simmered spiced herb tomato sauce, generously smothered with pure mozzarella, and baked until the crust reaches golden perfection.',
      priceRange: 'Starting from ₹69 (Small) to ₹309 (Large)',
      highlightImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
      badge: 'Bestselling Category',
      items: [
        { name: 'Regular Pizza', price: '₹69' },
        { name: 'Cheese Pizza', price: '₹89' },
        { name: 'Double Cheese Pizza', price: '₹109' },
        { name: 'Paneer Pizza', price: '₹119' },
      ],
      layers: [
        'Stone-ground wheat crust with puffed airy rim',
        'Zesty signature marinara sauce infused with oregano',
        'Stretching hot mozzarella & golden cheddar notes',
        'Farm-fresh paneer, sweet corn & capsicum slivers',
      ],
      ctaText: 'Explore All 6 Pizzas',
      ctaRoute: '/menu/pizza',
      icon: Pizza,
    },
    {
      id: 'sandwich',
      category: 'sandwich',
      title: 'Scene 2: Crispy Grilled Sandwiches',
      subtitle: 'Golden Grill Marks & Melty Fillings',
      tagline: 'Multi-Layered • Butter Toasted • Herb Seasoned',
      description:
        'Thick artisanal bread brushed with aromatic butter, packed with savory spiced vegetables, velvety cheese slices, and pressed between sizzling grill plates for that irresistible golden crunch.',
      priceRange: 'Starting from ₹49 to ₹89',
      highlightImage: 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?auto=format&fit=crop&w=1000&q=80',
      badge: 'Snack Favorite',
      items: [
        { name: 'Veg Sandwich', price: '₹49' },
        { name: 'Cheese Sandwich', price: '₹69' },
        { name: 'Grilled Sandwich', price: '₹79' },
        { name: 'Paneer Sandwich', price: '₹89' },
      ],
      layers: [
        'Golden toasted butter bread with diagonal precision slice',
        'Chilled mint-coriander and sweet-sour chutney spreads',
        'Crisp cucumber, tomato rounds and seasoned potatoes',
        'Rich paneer slices and molten cheese layer',
      ],
      ctaText: 'Explore All Sandwiches',
      ctaRoute: '/menu/sandwich',
      icon: Sandwich,
    },
    {
      id: 'burger',
      category: 'burger',
      title: 'Scene 3: Gourmet Veg & Paneer Burgers',
      subtitle: 'Stacked High With Flavor',
      tagline: 'Toasted Sesame Buns • Crisp Patty • Secret Sauce',
      description:
        'Soft golden brioche buns toasted with butter, stacked with a freshly fried crispy spiced vegetable or paneer patty, crisp iceberg lettuce, caramelized red onions, and our house special burger sauce.',
      priceRange: 'Starting from ₹49 to ₹79',
      highlightImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80',
      badge: 'Street Style Perfection',
      items: [
        { name: 'Veg Burger', price: '₹49' },
        { name: 'Cheese Burger', price: '₹69' },
        { name: 'Paneer Burger', price: '₹79' },
      ],
      layers: [
        'Warm toasted sesame bun crown and base',
        'Creamy garlic mayo and spiced tomato relish',
        'Crispy fried golden patty seasoned with Indian herbs',
        'Melted cheese slice, crunchy red onions & tomato',
      ],
      ctaText: 'Explore All Burgers',
      ctaRoute: '/menu/burger',
      icon: UtensilsCrossed,
    },
  ];

  const current = scenes[activeScene];
  const IconComponent = current.icon;

  return (
    <section className="py-14 sm:py-20 bg-[#FDFBF7] border-b border-amber-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Culinary Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1E1915] tracking-tight">
            A Walkthrough of Our Kitchen Craft
          </h2>
          <p className="mt-2.5 text-xs sm:text-sm text-[#6B5B4F]">
            Step into the crafting of our three flagship categories. Discover the layers, textures, and genuine ingredients.
          </p>

          {/* Scene Switcher Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6">
            {scenes.map((scene, idx) => {
              const SceneIcon = scene.icon;
              const isActive = activeScene === idx;
              return (
                <button
                  key={scene.id}
                  id={`btn-scene-tab-${scene.id}`}
                  onClick={() => setActiveScene(idx as 0 | 1 | 2)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all cursor-pointer active:scale-95 ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 border border-amber-300'
                      : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200/80 hover:border-amber-300'
                  }`}
                >
                  <SceneIcon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-600'}`} />
                  <span>{scene.title.split(':')[1].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Showcase Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-xl transition-all duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Visual Column */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-amber-100 bg-neutral-900 group">
                <img
                  src={current.highlightImage}
                  alt={current.title}
                  className="w-full h-72 sm:h-88 object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Badge top-left */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 text-xs font-black tracking-wide uppercase shadow-lg border border-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{current.badge}</span>
                </div>

                {/* Price pill bottom */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div>
                    <p className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">Price Range</p>
                    <p className="text-base sm:text-lg font-black">{current.priceRange}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl bg-white/20 backdrop-blur-md text-xs font-bold">
                    Fresh Order
                  </span>
                </div>
              </div>

              {/* Quick Price List Pills */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {current.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50/90 border border-amber-200/60 text-center"
                  >
                    <p className="text-[11px] font-semibold text-[#55473E] truncate">{item.name}</p>
                    <p className="text-xs font-black text-amber-800">{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Layers Column */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider">
                  <IconComponent className="w-4 h-4" />
                  <span>{current.tagline}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1E1915]">{current.subtitle}</h3>
                <p className="text-xs sm:text-sm text-[#6B5B4F] leading-relaxed">{current.description}</p>
              </div>

              {/* Anatomy / Layer Breakdown */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1915]">
                  Quality Highlights:
                </h4>
                <div className="space-y-2">
                  {current.layers.map((layer, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#45382E]">
                      <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                        <Check className="w-3 h-3 text-amber-700" />
                      </div>
                      <span>{layer}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  id={`btn-story-cta-${current.id}`}
                  onClick={() => navigate(current.ctaRoute)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/menu')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1E1915] font-bold text-xs sm:text-sm transition-colors text-center cursor-pointer active:scale-95"
                >
                  View All Categories
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
