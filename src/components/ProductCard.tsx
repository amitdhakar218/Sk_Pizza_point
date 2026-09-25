import React, { useState } from 'react';
import { ShoppingBag, Heart, Eye, Flame, AlertCircle } from 'lucide-react';
import { Product, PizzaSize } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onOpenDetails?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart, formatPrice, isFavorite, toggleFavorite, setActiveProductModal, navigate } = useApp();
  const [selectedSize, setSelectedSize] = useState<PizzaSize | 'Standard'>(product.sizes[0]?.size || 'Small');
  const [imgError, setImgError] = useState(false);

  const selectedSizeObj = product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const currentPrice = selectedSizeObj ? selectedSizeObj.price : 0;
  const isFav = isFavorite(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, selectedSize, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    addToCart(product, selectedSize, 1);
    navigate('/checkout');
  };

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(product);
    } else {
      setActiveProductModal(product);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between bg-white rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer ${
        product.isAvailable
          ? 'border-amber-200/80 hover:border-amber-400 shadow-sm hover:shadow-xl hover:-translate-y-1'
          : 'border-neutral-200 opacity-80 bg-neutral-50/50'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative w-full h-48 sm:h-52 bg-amber-50/50 overflow-hidden">
        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 text-amber-900 p-4 text-center">
            <span className="font-black text-3xl">🍕</span>
            <span className="text-xs font-bold mt-1.5">{product.name}</span>
          </div>
        )}

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badge */}
        {product.badge && product.isAvailable && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md border border-amber-300 flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>{product.badge}</span>
          </div>
        )}

        {/* Out of Stock banner */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-neutral-900/70 backdrop-blur-[1px] flex items-center justify-center p-4">
            <span className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-black text-xs tracking-wider uppercase shadow-lg flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Out of Stock</span>
            </span>
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer active:scale-90 ${
            isFav
              ? 'bg-rose-500 text-white'
              : 'bg-white/85 text-[#55473E] hover:bg-white hover:text-rose-500'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Quick view hint */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="px-2.5 py-1 rounded-xl bg-white/90 text-[#1E1915] text-[11px] font-bold shadow flex items-center gap-1">
            <Eye className="w-3 h-3 text-amber-600" />
            <span>Details</span>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-black text-base sm:text-lg text-[#1E1915] group-hover:text-amber-800 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <span className="text-[10px] uppercase font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md shrink-0">
              {product.category}
            </span>
          </div>
          <p className="text-xs text-[#6B5B4F] mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Size Selection Tabs */}
        {product.sizes.length > 1 ? (
          <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between text-[11px] text-[#55473E] font-medium">
              <span>Portion:</span>
              <span className="text-amber-800 font-bold">{selectedSize}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-amber-50/80 border border-amber-200/70">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                return (
                  <button
                    key={s.size}
                    type="button"
                    onClick={() => setSelectedSize(s.size as PizzaSize)}
                    className={`py-1 px-1.5 rounded-lg text-xs font-bold transition-all text-center cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-[#55473E] hover:bg-amber-100/60'
                    }`}
                  >
                    <div>{s.size}</div>
                    <div className="text-[10px] font-black opacity-90">{formatPrice(s.price)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-[11px] text-[#6B5B4F] font-semibold">
            <span>Portion: Standard size</span>
          </div>
        )}

        {/* Price & Action Row */}
        <div className="pt-2.5 border-t border-amber-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#6B5B4F] block uppercase font-bold">Price</span>
            <span className="text-lg sm:text-xl font-black text-[#1E1915]">
              {formatPrice(currentPrice)}
            </span>
          </div>

          {/* Action Buttons with tactile feel */}
          <div className="flex items-center gap-1.5">
            <button
              id={`btn-add-cart-${product.id}`}
              type="button"
              disabled={!product.isAvailable}
              onClick={handleAddToCart}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl font-bold text-xs flex items-center gap-1 transition-all shadow-sm cursor-pointer active:scale-95 ${
                product.isAvailable
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
              title={product.isAvailable ? 'Add to cart' : 'Out of stock'}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
            <button
              id={`btn-buy-now-${product.id}`}
              type="button"
              disabled={!product.isAvailable}
              onClick={handleBuyNow}
              className={`px-3 py-2 rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer active:scale-95 ${
                product.isAvailable
                  ? 'bg-[#1E1915] hover:bg-[#2E2620] text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
