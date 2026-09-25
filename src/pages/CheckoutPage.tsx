import React, { useState } from 'react';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Phone,
  User,
  MapPin,
  MessageCircle,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    deliveryFee,
    finalTotal,
    createOrder,
    formatPrice,
    navigate,
    generateWhatsAppUrl,
    activeOrder,
    setActiveOrder,
    settings,
    currentUser,
    userProfile,
    showToast,
  } = useApp();

  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(userProfile?.defaultAddress || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [pinCode, setPinCode] = useState(userProfile?.pinCode || '');
  const [instructions, setInstructions] = useState('');

  // Sync if userProfile loads asynchronously
  React.useEffect(() => {
    if (userProfile) {
      if (!customerName && userProfile.displayName) setCustomerName(userProfile.displayName);
      if (!customerPhone && userProfile.phone) setCustomerPhone(userProfile.phone);
      if (!deliveryAddress && userProfile.defaultAddress) setDeliveryAddress(userProfile.defaultAddress);
      if (!city && userProfile.city) setCity(userProfile.city);
      if (!pinCode && userProfile.pinCode) setPinCode(userProfile.pinCode);
    }
  }, [userProfile]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(activeOrder);
  const [whatsAppOpened, setWhatsAppOpened] = useState(false);

  // If already placed an order, show the confirmed order screen
  if (completedOrder) {
    const whatsAppUrl = generateWhatsAppUrl(completedOrder);
    const handleOpenWhatsAppAgain = () => {
      setWhatsAppOpened(true);
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
    };

    return (
      <div className="min-h-screen bg-[#FFFDF9] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 animate-scale-up">
          {/* Success Banner */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1915]">Order Created Successfully!</h1>
            <p className="text-xs sm:text-sm text-[#55473E] max-w-md mx-auto">
              Your unique order ID is ready. Please complete the final step by sending the prepared message on WhatsApp.
            </p>
          </div>

          {/* Unique Order ID Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-300 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div>
                <span className="text-[10px] font-bold text-[#6B5B4F] uppercase tracking-wider block">
                  Official Order ID
                </span>
                <span className="text-lg sm:text-xl font-black text-amber-900 tracking-wide font-mono">
                  {completedOrder.id}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] font-bold text-[#6B5B4F] uppercase tracking-wider block">Status</span>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 font-extrabold text-xs">
                  {completedOrder.status}
                </span>
              </div>
            </div>

            {/* Crucial WhatsApp submission action */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#E8F8EE] border border-emerald-300 space-y-3">
              <div className="flex items-start gap-2.5">
                <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-extrabold text-sm text-emerald-950">
                    Step 2: Press Send in WhatsApp
                  </h3>
                  <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                    Opening WhatsApp will pre-fill your complete order summary with address and total pricing.
                    <strong> Note:</strong> Please tap the "Send" button in WhatsApp to submit to the kitchen!
                  </p>
                </div>
              </div>

              <button
                id="btn-open-whatsapp-order"
                onClick={handleOpenWhatsAppAgain}
                className="w-full py-3.5 px-5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Open WhatsApp to Send Order</span>
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>

              {whatsAppOpened && (
                <p className="text-[11px] text-emerald-700 text-center font-medium">
                  ✓ WhatsApp window opened. Did you press Send? The restaurant will confirm once received!
                </p>
              )}
            </div>

            {/* Order Items Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1E1915] uppercase tracking-wider">Order Items:</h4>
              <div className="divide-y divide-amber-100 border border-amber-100 rounded-2xl p-3.5 bg-[#FFFDF9]">
                {completedOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <span className="font-bold text-[#1E1915]">{item.productName}</span>
                      <span className="text-xs text-[#6B5B4F] ml-1.5">({item.size} x {item.quantity})</span>
                      {item.addOns.length > 0 && (
                        <span className="text-[10px] text-amber-700 block">+ {item.addOns.join(', ')}</span>
                      )}
                    </div>
                    <span className="font-extrabold text-[#1E1915]">{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}

                <div className="pt-2 space-y-1 text-xs text-[#6B5B4F]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1E1915]">{formatPrice(completedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="font-bold text-[#1E1915]">
                      {completedOrder.deliveryFee > 0
                        ? formatPrice(completedOrder.deliveryFee)
                        : settings.deliveryFeeNote || 'To be confirmed'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#1E1915] pt-1.5 border-t border-amber-100">
                    <span>Total Amount</span>
                    <span className="text-amber-800">{formatPrice(completedOrder.finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Snapshot */}
            <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-[#55473E] space-y-1">
              <p>
                <strong>Customer:</strong> {completedOrder.customerName} ({completedOrder.customerPhone})
              </p>
              <p>
                <strong>Type:</strong> {completedOrder.orderType === 'delivery' ? 'Home Delivery' : 'Self Pickup'}
              </p>
              {completedOrder.deliveryAddress && (
                <p>
                  <strong>Address:</strong> {completedOrder.deliveryAddress}
                  {completedOrder.city ? `, ${completedOrder.city}` : ''}
                  {completedOrder.pinCode ? ` - ${completedOrder.pinCode}` : ''}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setActiveOrder(null);
                  navigate('/menu');
                }}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors text-center cursor-pointer active:scale-95"
              >
                Order More Food
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1E1915] font-semibold text-xs transition-colors text-center cursor-pointer active:scale-95"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no active order
  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-3xl">
          🍕
        </div>
        <h2 className="text-2xl font-black text-[#1E1915]">Your cart is empty</h2>
        <p className="text-xs sm:text-sm text-[#6B5B4F] max-w-sm">
          Please select your favorite pizzas, burgers, or sandwiches before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/menu')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
        >
          Explore Full Menu
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/[^0-9]/g, '').length < 8) {
      showToast('Please enter a valid phone number', 'error');
      return;
    }
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      showToast('Please provide your complete delivery address', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newOrder = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: currentUser?.email || undefined,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() : undefined,
        city: orderType === 'delivery' ? city.trim() : undefined,
        pinCode: orderType === 'delivery' ? pinCode.trim() : undefined,
        instructions: instructions.trim() || undefined,
      });

      // Joyful celebratory confetti!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#E11D48', '#3B82F6'],
        });
      } catch {
        // ignore
      }

      setCompletedOrder(newOrder);

      // Open WhatsApp with prefilled message
      const whatsAppUrl = generateWhatsAppUrl(newOrder);
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer');
      setWhatsAppOpened(true);
    } catch {
      showToast('Failed to create order. Please check details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#55473E] hover:text-[#1E1915] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Menu</span>
          </button>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            Direct WhatsApp Ordering
          </span>
        </div>

        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black text-[#1E1915]">Order Checkout</h1>
          <p className="text-xs text-[#6B5B4F] mt-0.5">
            Review food selection, provide your contact details, and confirm your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Customer Information Form */}
          <form
            onSubmit={handleSubmitOrder}
            className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-md space-y-5"
          >
            <h2 className="text-base font-black text-[#1E1915] flex items-center gap-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Contact & Delivery Details</span>
            </h2>

            {/* Order Type Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-[#1E1915]">
                Select Fulfillment Type:
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  id="btn-order-type-delivery"
                  onClick={() => setOrderType('delivery')}
                  className={`py-2.5 px-3 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    orderType === 'delivery'
                      ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-sm'
                      : 'border-amber-200 bg-white text-[#55473E] hover:bg-neutral-50'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Home Delivery</span>
                </button>
                <button
                  type="button"
                  id="btn-order-type-pickup"
                  onClick={() => setOrderType('pickup')}
                  className={`py-2.5 px-3 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                    orderType === 'pickup'
                      ? 'border-amber-500 bg-amber-50 text-slate-950 shadow-sm'
                      : 'border-amber-200 bg-white text-[#55473E] hover:bg-neutral-50'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>Store Pickup</span>
                </button>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                  WhatsApp / Phone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Address fields only for Delivery */}
            {orderType === 'delivery' && (
              <div className="space-y-3 pt-1 border-t border-amber-100 animate-fade-in">
                <div className="space-y-1">
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                    <textarea
                      required
                      rows={2}
                      placeholder="House/Flat No, Landmark, Area name..."
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                      City / Area
                    </label>
                    <input
                      type="text"
                      placeholder="Area / Town"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Cooking & Delivery Instructions */}
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#1E1915]">
                Special Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ring doorbell, extra spicy, no onions..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-amber-200 bg-neutral-50/50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-amber-100">
              <button
                type="submit"
                id="btn-submit-order-whatsapp"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <MessageCircle className="w-5 h-5 text-slate-950" />
                <span>Confirm & Send on WhatsApp ({formatPrice(finalTotal)})</span>
              </button>
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-[#6B5B4F]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero pre-payment required. Pay on delivery or pickup.</span>
              </div>
            </div>
          </form>

          {/* Right: Order Summary Breakdown */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/80 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-amber-100">
              <h3 className="font-extrabold text-sm sm:text-base text-[#1E1915]">Order Summary</h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg">
                {cart.length} item{cart.length > 1 ? 's' : ''}
              </span>
            </div>

            {/* Items list */}
            <div className="divide-y divide-amber-100 max-h-64 overflow-y-auto pr-1 space-y-2">
              {cart.map((item) => {
                const addOnsPrice = item.selectedAddOns.reduce((acc, a) => acc + a.price, 0);
                const itemTotal = (item.unitPrice + addOnsPrice) * item.quantity;
                return (
                  <div key={item.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-[#1E1915] truncate">{item.productName}</p>
                      <p className="text-[11px] text-[#6B5B4F]">
                        {item.selectedSize} x {item.quantity} (@ {formatPrice(item.unitPrice)})
                      </p>
                      {item.selectedAddOns.length > 0 && (
                        <p className="text-[10px] text-amber-700 truncate">
                          + {item.selectedAddOns.map((a) => a.name).join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-black text-[#1E1915] shrink-0">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculations breakdown */}
            <div className="pt-2.5 border-t border-amber-100 space-y-1.5 text-xs text-[#55473E]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#1E1915]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-semibold text-amber-800">
                  {orderType === 'delivery'
                    ? deliveryFee > 0
                      ? formatPrice(deliveryFee)
                      : settings.deliveryFeeNote || 'To be confirmed'
                    : 'Free (Pickup)'}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-[#1E1915] pt-1.5 border-t border-amber-100">
                <span>Total Payable</span>
                <span className="text-base text-amber-800">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-[#55473E] space-y-0.5">
              <p className="font-bold text-amber-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Estimated Prep: 15-25 mins</span>
              </p>
              <p className="text-[11px] text-[#6B5B4F]">
                Freshly baked after your confirmation on WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
