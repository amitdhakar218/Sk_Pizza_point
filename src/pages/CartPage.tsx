import React from 'react';
import { ShoppingBag, ArrowLeft, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PizzaSize } from '../types';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    deliveryFee,
    finalTotal,
    updateCartQuantity,
    updateCartItemSize,
    removeFromCart,
    clearCart,
    formatPrice,
    navigate,
    products,
    settings,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl">
          🍕
        </div>
        <h2 className="text-2xl font-black text-[#1E1915]">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-[#6B5B4F] max-w-sm">
          Discover our stone-baked pizzas, burgers, and crunchy sandwiches freshly prepared for you.
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
        >
          Explore Full Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <button
              onClick={() => navigate('/menu')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#55473E] hover:text-[#1E1915] mb-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Ordering Food</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1915]">Your Food Cart ({cartCount})</h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline self-start sm:self-auto cursor-pointer"
          >
            Clear Entire Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Cart items */}
          <div className="lg:col-span-8 space-y-3.5">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              const hasMultipleSizes = product && product.sizes.length > 1;
              const addOnsPrice = item.selectedAddOns.reduce((acc, a) => acc + a.price, 0);
              const itemTotal = (item.unitPrice + addOnsPrice) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-3xl bg-white border border-amber-200/70 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-amber-50 shrink-0 border border-amber-100"
                    />
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-sm sm:text-base text-[#1E1915]">{item.productName}</h3>
                      <p className="text-xs text-[#6B5B4F]">Base: {formatPrice(item.unitPrice)}</p>

                      {hasMultipleSizes ? (
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-[#55473E] font-medium">Size:</span>
                          <div className="flex gap-1">
                            {product?.sizes.map((s) => (
                              <button
                                key={s.size}
                                onClick={() => updateCartItemSize(item.id, s.size as PizzaSize)}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                                  item.selectedSize === s.size
                                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                                    : 'bg-neutral-100 text-[#55473E] hover:bg-neutral-200'
                                }`}
                              >
                                {s.size}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-amber-800 font-semibold block">Standard Size</span>
                      )}

                      {item.selectedAddOns.length > 0 && (
                        <p className="text-xs text-amber-700">
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Item total */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-100">
                    <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-200 rounded-xl p-1">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center font-bold text-xs hover:bg-amber-100 cursor-pointer active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center text-[#1E1915]">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white flex items-center justify-center font-bold text-xs hover:bg-amber-100 cursor-pointer active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-black text-[#1E1915] block">{formatPrice(itemTotal)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-red-500 hover:text-red-700 font-medium inline-flex items-center gap-1 mt-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Checkout summary sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-md space-y-4">
            <h3 className="font-extrabold text-base text-[#1E1915] pb-2 border-b border-amber-100">Order Totals</h3>
            <div className="space-y-2 text-xs sm:text-sm text-[#55473E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1E1915]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery</span>
                <span className="font-semibold text-amber-800">
                  {deliveryFee > 0 ? formatPrice(deliveryFee) : settings.deliveryFeeNote || 'To be confirmed'}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#1E1915] pt-2 border-t border-amber-100">
                <span>Total Amount</span>
                <span className="text-amber-800">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
