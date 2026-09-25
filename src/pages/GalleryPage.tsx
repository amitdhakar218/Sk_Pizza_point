import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Camera,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GalleryItem } from '../types';

export const GalleryPage: React.FC = () => {
  const { gallery, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const categories = ['all', 'restaurant', 'pizza', 'burger', 'sandwich'];

  const filteredItems = gallery.filter((item) => {
    if (!item.isPublished) return false;
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const activeItem = activeLightboxIndex !== null ? filteredItems[activeLightboxIndex] : null;

  const handlePrev = useCallback(() => {
    if (activeLightboxIndex === null || filteredItems.length === 0) return;
    setActiveLightboxIndex((prev) => (prev! > 0 ? prev! - 1 : filteredItems.length - 1));
  }, [activeLightboxIndex, filteredItems.length]);

  const handleNext = useCallback(() => {
    if (activeLightboxIndex === null || filteredItems.length === 0) return;
    setActiveLightboxIndex((prev) => (prev! < filteredItems.length - 1 ? prev! + 1 : 0));
  }, [activeLightboxIndex, filteredItems.length]);

  useEffect(() => {
    if (activeLightboxIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, handlePrev, handleNext]);

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5 text-amber-600" />
            <span>Restaurant & Food Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1915]">
            A Visual Showcase of SK Pizza Point
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B4F]">
            Browse our genuine restaurant moments, piping-hot cheese stretches, and fresh kitchen creations.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveLightboxIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow border border-amber-300'
                    : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200/80'
                }`}
              >
                {cat === 'all' ? 'All Photographs' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setActiveLightboxIndex(index)}
              className="group relative h-72 sm:h-80 rounded-3xl overflow-hidden bg-neutral-900 cursor-pointer border border-amber-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={item.imageUrl}
                alt={item.altText || item.title}
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              <div className="absolute top-3.5 right-3.5 p-2 rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 inline-block">
                  {item.category || 'SK Pizza Point'}
                </span>
                <h3 className="font-extrabold text-sm sm:text-base line-clamp-1">{item.title}</h3>
                <p className="text-xs text-neutral-300 line-clamp-2">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Explore Menu Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-black">Craving what you see?</h3>
            <p className="text-xs sm:text-sm font-semibold text-amber-950">
              Order fresh stone-oven pizzas, burgers, and sandwiches right now on WhatsApp!
            </p>
          </div>
          <button
            onClick={() => navigate('/menu')}
            className="px-5 py-3 rounded-xl bg-[#1E1915] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-neutral-800 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Explore Menu & Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Accessible Full-screen Lightbox */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in"
          onClick={() => setActiveLightboxIndex(null)}
        >
          <button
            onClick={() => setActiveLightboxIndex(null)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            aria-label="Close image viewer"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20 cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>

          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center justify-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeItem.imageUrl}
              alt={activeItem.altText || activeItem.title}
              className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-neutral-800"
            />
            <div className="text-center text-white space-y-1 px-4">
              <h3 className="font-extrabold text-base sm:text-lg text-amber-400">{activeItem.title}</h3>
              <p className="text-xs text-neutral-300 max-w-lg">{activeItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
