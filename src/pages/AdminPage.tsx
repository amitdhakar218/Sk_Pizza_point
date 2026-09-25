import React, { useState } from 'react';
import {
  Utensils,
  Video,
  Image as ImageIcon,
  Settings as SettingsIcon,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Save,
  LogOut,
  Sparkles,
  Play,
  Film,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, PizzaSize, VideoItem, GalleryItem, OrderStatus } from '../types';

export const AdminPage: React.FC = () => {
  const {
    isAdmin,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    videos,
    addVideoItem,
    deleteVideoItem,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    orders,
    updateOrderStatus,
    settings,
    updateSettings,
    formatPrice,
    navigate,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'media-settings' | 'videos' | 'gallery' | 'orders'>('products');

  // If not admin, redirect to login
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider">
                Admin Panel
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Firebase Realtime Database Connected
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1915] mt-1">
              SK Pizza Point Management
            </h1>
            <p className="text-xs text-[#6B5B4F]">
              Directly edit and delete menu items, change background video/image links, and track customer orders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1E1915] text-xs font-bold transition-colors cursor-pointer"
            >
              View Live Website
            </button>
            <button
              onClick={async () => {
                await logout();
                navigate('/admin-login');
              }}
              className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-amber-200 pb-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow border border-amber-400'
                : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Food Menu ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media-settings')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'media-settings'
                ? 'bg-amber-500 text-slate-950 shadow border border-amber-400'
                : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Hero Background & Restaurant Info</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-amber-500 text-slate-950 shadow border border-amber-400'
                : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>YouTube Videos ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-amber-500 text-slate-950 shadow border border-amber-400'
                : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photo Gallery ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow border border-amber-400'
                : 'bg-white text-[#55473E] hover:bg-amber-50 border border-amber-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && <ProductManager />}

        {/* Tab 2: Hero Background & Settings */}
        {activeTab === 'media-settings' && <MediaSettingsManager />}

        {/* Tab 3: Videos */}
        {activeTab === 'videos' && <VideosManager />}

        {/* Tab 4: Gallery */}
        {activeTab === 'gallery' && <GalleryManager />}

        {/* Tab 5: Orders */}
        {activeTab === 'orders' && <OrdersManager />}
      </div>
    </div>
  );
};

// ==========================================
// 1. PRODUCT MANAGER SUB-COMPONENT
// ==========================================
const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, formatPrice, showToast } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('pizza');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [badge, setBadge] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);

  // Pricing: either single or 3 sizes
  const [smallPrice, setSmallPrice] = useState<number>(69);
  const [mediumPrice, setMediumPrice] = useState<number>(149);
  const [largePrice, setLargePrice] = useState<number>(209);
  const [standardPrice, setStandardPrice] = useState<number>(49);

  const resetForm = () => {
    setName('');
    setCategory('pizza');
    setDescription('');
    setImageUrl('');
    setBadge('');
    setIsAvailable(true);
    setSmallPrice(69);
    setMediumPrice(149);
    setLargePrice(209);
    setStandardPrice(49);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingId(prod.id);
    setName(prod.name);
    setCategory(prod.category);
    setDescription(prod.description);
    setImageUrl(prod.imageUrl);
    setBadge(prod.badge || '');
    setIsAvailable(prod.isAvailable);

    if (prod.category === 'pizza') {
      const s = prod.sizes.find((x) => x.size === 'Small')?.price || 69;
      const m = prod.sizes.find((x) => x.size === 'Medium')?.price || 149;
      const l = prod.sizes.find((x) => x.size === 'Large')?.price || 209;
      setSmallPrice(s);
      setMediumPrice(m);
      setLargePrice(l);
    } else {
      setStandardPrice(prod.sizes[0]?.price || 49);
    }
    setIsAdding(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Product name is required', 'error');
      return;
    }

    const sizes =
      category === 'pizza'
        ? [
            { size: 'Small' as PizzaSize, price: Number(smallPrice) || 69 },
            { size: 'Medium' as PizzaSize, price: Number(mediumPrice) || 149 },
            { size: 'Large' as PizzaSize, price: Number(largePrice) || 209 },
          ]
        : [{ size: 'Standard' as PizzaSize, price: Number(standardPrice) || 49 }];

    const payload = {
      name: name.trim(),
      category,
      description: description.trim(),
      imageUrl:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
      badge: badge.trim() || undefined,
      isAvailable,
      sizes,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
        showToast(`Updated "${name}" successfully in Firebase!`, 'success');
      } else {
        await addProduct(payload);
        showToast(`Added new item "${name}" successfully!`, 'success');
      }
      resetForm();
    } catch {
      showToast('Error saving product to Firebase', 'error');
    }
  };

  const handleDelete = async (prod: Product) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prod.name}"?`)) {
      try {
        await deleteProduct(prod.id);
        showToast(`Deleted "${prod.name}" from menu`, 'info');
      } catch {
        showToast('Failed to delete item', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1E1915]">Menu Items List ({products.length})</h2>
          <p className="text-xs text-[#6B5B4F]">Add, edit prices, or delete pizzas, burgers, and sandwiches.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Item</span>
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Inline Card */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl space-y-4 animate-scale-up">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <h3 className="font-black text-base text-[#1E1915]">
              {editingId ? `Edit Product: ${name}` : 'Create New Menu Item'}
            </h3>
            <button
              onClick={resetForm}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Farmhouse Special Pizza"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="pizza">Pizza (Small / Med / Large)</option>
                  <option value="burger">Burger</option>
                  <option value="sandwich">Sandwich</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Description</label>
              <textarea
                rows={2}
                placeholder="Delicious ingredients, mozzarella cheese, herbs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Image URL</label>
                <input
                  type="url"
                  placeholder="https://... (direct image link or unsplash)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Badge (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Chef Choice, Bestseller, 20% Off"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Pricing Fields */}
            {category === 'pizza' ? (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <span className="text-xs font-black text-amber-900 uppercase">Pizza Sizing & Pricing (₹)</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#55473E] block">Small (₹)</label>
                    <input
                      type="number"
                      required
                      value={smallPrice}
                      onChange={(e) => setSmallPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#55473E] block">Medium (₹)</label>
                    <input
                      type="number"
                      required
                      value={mediumPrice}
                      onChange={(e) => setMediumPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#55473E] block">Large (₹)</label>
                    <input
                      type="number"
                      required
                      value={largePrice}
                      onChange={(e) => setLargePrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                <label className="text-xs font-black text-amber-900 uppercase block">Standard Price (₹)</label>
                <input
                  type="number"
                  required
                  value={standardPrice}
                  onChange={(e) => setStandardPrice(Number(e.target.value))}
                  className="w-36 px-2.5 py-1.5 rounded-lg border border-amber-300 text-xs font-bold"
                />
              </div>
            )}

            {/* In Stock toggle */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-[#1E1915]">
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-400"
                />
                <span>Currently Available (In-Stock for ordering)</span>
              </label>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-amber-100">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-[#1E1915] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>{editingId ? 'Save Changes to Firebase' : 'Add to Firebase'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List Table */}
      <div className="bg-white rounded-3xl border border-amber-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-amber-50/70 border-b border-amber-100 uppercase font-extrabold text-[#55473E] text-[11px]">
              <tr>
                <th className="p-3.5">Image & Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Pricing</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100 font-medium">
              {products.map((prod) => {
                const priceLabel =
                  prod.category === 'pizza'
                    ? `S: ${formatPrice(prod.sizes[0]?.price || 0)} | M: ${formatPrice(
                        prod.sizes[1]?.price || 0
                      )} | L: ${formatPrice(prod.sizes[2]?.price || 0)}`
                    : formatPrice(prod.sizes[0]?.price || 0);

                return (
                  <tr key={prod.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img
                        src={prod.imageUrl}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-200 shrink-0 bg-amber-50"
                      />
                      <div>
                        <span className="font-bold text-[#1E1915] block">{prod.name}</span>
                        {prod.badge && (
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-900">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold uppercase text-xs text-amber-800">{prod.category}</td>
                    <td className="p-3.5 font-extrabold text-[#1E1915]">{priceLabel}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => updateProduct(prod.id, { isAvailable: !prod.isAvailable })}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase cursor-pointer ${
                          prod.isAvailable
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        title="Click to toggle availability"
                      >
                        {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleStartEdit(prod)}
                        className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
                        title="Edit Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod)}
                        className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. HERO BACKGROUND & RESTAURANT SETTINGS
// ==========================================
const MediaSettingsManager: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp();

  const [heroMediaType, setHeroMediaType] = useState<'video' | 'image'>(settings.heroMediaType || 'video');
  const [heroVideoUrl, setHeroVideoUrl] = useState(settings.homepageVideoUrl || settings.heroVideoUrl || '');
  const [heroImageUrl, setHeroImageUrl] = useState(settings.heroImageUrl || '');
  const [phone, setPhone] = useState(settings.phone || settings.whatsAppNumber || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(settings.whatsAppNumber || '');
  const [address, setAddress] = useState(settings.address || '');
  const [openingHours, setOpeningHours] = useState(settings.openingHours || '');
  const [deliveryFeeNote, setDeliveryFeeNote] = useState(settings.deliveryFeeNote || '');
  const [aboutStory, setAboutStory] = useState(settings.aboutStory || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        heroMediaType,
        homepageVideoUrl: heroVideoUrl.trim(),
        heroVideoUrl: heroVideoUrl.trim(),
        heroImageUrl: heroImageUrl.trim(),
        phone: phone.trim(),
        whatsAppNumber: whatsAppNumber.trim(),
        address: address.trim(),
        openingHours: openingHours.trim(),
        deliveryFeeNote: deliveryFeeNote.trim(),
        aboutStory: aboutStory.trim(),
      });
      showToast('Settings & Background Media updated successfully in Firebase!', 'success');
    } catch {
      showToast('Failed to save settings to Firebase', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-md space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-black text-[#1E1915]">
          Hero Background Media & Restaurant Settings
        </h2>
        <p className="text-xs text-[#6B5B4F]">
          Switch between video and image background on your homepage, update phone numbers, and address.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5">
        {/* Background media toggle */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-3">
          <label className="block text-xs font-black uppercase text-amber-900 tracking-wide">
            Homepage Hero Background Display:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setHeroMediaType('video')}
              className={`py-3 px-4 rounded-xl border-2 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                heroMediaType === 'video'
                  ? 'border-amber-500 bg-amber-500 text-slate-950 shadow'
                  : 'border-amber-200 bg-white text-[#55473E]'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Background Video Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setHeroMediaType('image')}
              className={`py-3 px-4 rounded-xl border-2 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all ${
                heroMediaType === 'image'
                  ? 'border-amber-500 bg-amber-500 text-slate-950 shadow'
                  : 'border-amber-200 bg-white text-[#55473E]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Background Image Mode</span>
            </button>
          </div>

          {/* Media link input depending on choice */}
          {heroMediaType === 'video' ? (
            <div className="space-y-1 pt-2">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">
                Hero Video Link (Direct MP4 URL or YouTube ID)
              </label>
              <input
                type="text"
                required
                placeholder="https://commondatastorage.googleapis.com/... or YouTube link"
                value={heroVideoUrl}
                onChange={(e) => setHeroVideoUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-[10px] text-[#6B5B4F]">
                Plays silently on loop behind the headline. Fallback image is shown if video fails to buffer.
              </p>
            </div>
          ) : (
            <div className="space-y-1 pt-2">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">
                Hero Background Image Link
              </label>
              <input
                type="text"
                required
                placeholder="https://... (High-res photograph of pizza/storefront)"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          )}
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">WhatsApp Number</label>
            <input
              type="text"
              value={whatsAppNumber}
              onChange={(e) => setWhatsAppNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Restaurant Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Opening Hours</label>
            <input
              type="text"
              value={openingHours}
              onChange={(e) => setOpeningHours(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Delivery Fee Note</label>
            <input
              type="text"
              value={deliveryFeeNote}
              onChange={(e) => setDeliveryFeeNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">About Our Story</label>
          <textarea
            rows={3}
            value={aboutStory}
            onChange={(e) => setAboutStory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving to Firebase...' : 'Save Settings to Firebase'}</span>
        </button>
      </form>
    </div>
  );
};

// ==========================================
// 3. VIDEOS MANAGER SUB-COMPONENT
// ==========================================
const extractYouTubeId = (url: string): string => {
  if (!url) return '';
  const clean = url.trim();
  if (!clean.includes('/') && !clean.includes('.')) {
    return clean;
  }
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|live\/))([\w-]{11})/);
  return match ? match[1] : clean;
};

const VideosManager: React.FC = () => {
  const { videos, addVideoItem, deleteVideoItem, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !youtubeUrl.trim()) {
      showToast('Title and YouTube URL are required', 'error');
      return;
    }

    try {
      const yId = extractYouTubeId(youtubeUrl);
      await addVideoItem({
        title: title.trim(),
        description: description.trim(),
        youtubeUrl: youtubeUrl.trim(),
        youtubeId: yId,
        thumbnailUrl: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
        aspectRatio,
        sortOrder: videos.length + 1,
        isPublished: true,
      });
      showToast(`Added video "${title}" to Firebase!`, 'success');
      setTitle('');
      setDescription('');
      setYoutubeUrl('');
      setIsAdding(false);
    } catch {
      showToast('Failed to add video', 'error');
    }
  };

  const handleDelete = async (v: VideoItem) => {
    if (window.confirm(`Delete video "${v.title}"?`)) {
      try {
        await deleteVideoItem(v.id);
        showToast('Video deleted from Firebase', 'info');
      } catch {
        showToast('Failed to delete video', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1E1915]">YouTube Videos & Reels ({videos.length})</h2>
          <p className="text-xs text-[#6B5B4F]">Add YouTube shorts or video links for guests to watch.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add YouTube Video</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddVideo}
          className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl space-y-4 animate-scale-up"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <h3 className="font-black text-base text-[#1E1915]">Add YouTube Video</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Secret Sauce & Real Cheese Melt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">YouTube Link or ID *</label>
              <input
                type="text"
                required
                placeholder="https://www.youtube.com/watch?v=... or shorts URL"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Aspect Ratio</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="16:9">Standard Video (16:9)</option>
                <option value="9:16">Shorts / Reels (9:16)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Description</label>
              <input
                type="text"
                placeholder="Brief description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-neutral-100 text-[#1E1915] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow cursor-pointer active:scale-95"
            >
              Save Video to Firebase
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {videos.map((vid) => {
          const thumb =
            vid.thumbnailUrl || `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`;
          return (
            <div
              key={vid.id}
              className="bg-white rounded-3xl overflow-hidden border border-amber-200 shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-neutral-900">
                <img src={thumb} alt={vid.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-bold">
                  {vid.aspectRatio}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h4 className="font-extrabold text-sm text-[#1E1915] line-clamp-1">{vid.title}</h4>
                <p className="text-xs text-[#6B5B4F] line-clamp-2">{vid.description}</p>
                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-mono">ID: {vid.youtubeId}</span>
                  <button
                    onClick={() => handleDelete(vid)}
                    className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// 4. GALLERY MANAGER SUB-COMPONENT
// ==========================================
const GalleryManager: React.FC = () => {
  const { gallery, addGalleryItem, deleteGalleryItem, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('restaurant');

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) {
      showToast('Image URL is required', 'error');
      return;
    }

    try {
      await addGalleryItem({
        title: title.trim() || 'SK Pizza Point',
        caption: caption.trim() || 'Delicious moments at SK Pizza Point',
        altText: title.trim() || 'SK Pizza Point image',
        imageUrl: imageUrl.trim(),
        category,
        sortOrder: gallery.length + 1,
        isPublished: true,
      });
      showToast('Photo added to gallery!', 'success');
      setTitle('');
      setCaption('');
      setImageUrl('');
      setIsAdding(false);
    } catch {
      showToast('Failed to add photo', 'error');
    }
  };

  const handleDelete = async (g: GalleryItem) => {
    if (window.confirm(`Delete photo "${g.title}"?`)) {
      try {
        await deleteGalleryItem(g.id);
        showToast('Photo removed from Firebase', 'info');
      } catch {
        showToast('Failed to delete photo', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-[#1E1915]">Gallery Photographs ({gallery.length})</h2>
          <p className="text-xs text-[#6B5B4F]">Manage kitchen, restaurant, and dish photos.</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photograph</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form
          onSubmit={handleAddPhoto}
          className="bg-white rounded-3xl p-6 border-2 border-amber-400 shadow-xl space-y-4 animate-scale-up"
        >
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <h3 className="font-black text-base text-[#1E1915]">Add Photo to Gallery</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Photo Title</label>
              <input
                type="text"
                placeholder="e.g. Hand-kneaded Fresh Dough"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Image URL *</label>
              <input
                type="url"
                required
                placeholder="https://... (Direct image link)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="restaurant">Restaurant Atmosphere</option>
                <option value="pizza">Pizza</option>
                <option value="burger">Burger</option>
                <option value="sandwich">Sandwich</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold uppercase text-[#1E1915]">Caption</label>
              <input
                type="text"
                placeholder="Brief caption for the photo..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-100">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-neutral-100 text-[#1E1915] text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow cursor-pointer active:scale-95"
            >
              Upload to Firebase
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group relative h-48 rounded-2xl overflow-hidden border border-amber-200 shadow-sm bg-neutral-900"
          >
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-white">
              <span className="text-[10px] font-bold uppercase">{item.category}</span>
              <div>
                <p className="text-xs font-extrabold line-clamp-1">{item.title}</p>
                <button
                  onClick={() => handleDelete(item)}
                  className="mt-2 p-1 rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// 5. ORDERS MANAGER SUB-COMPONENT
// ==========================================
const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus, formatPrice, showToast } = useApp();

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-[#1E1915]">Live Customer Orders ({orders.length})</h2>
        <p className="text-xs text-[#6B5B4F]">All incoming orders synchronized in Firebase.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-amber-200">
          <ShoppingBag className="w-10 h-10 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-[#1E1915]">No customer orders yet</p>
          <p className="text-xs text-[#6B5B4F]">Orders placed on the website will be shown here in real-time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-200/90 shadow-sm space-y-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-amber-900">{order.id}</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase">
                      {order.orderType}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B5B4F] mt-0.5">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 font-bold text-xs text-[#1E1915] bg-amber-50 focus:outline-none cursor-pointer"
                  >
                    <option value="Awaiting WhatsApp submission">Awaiting WhatsApp submission</option>
                    <option value="Received">Received</option>
                    <option value="Confirmed by restaurant">Confirmed by restaurant</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Ready">Ready</option>
                    <option value="Out for delivery">Out for delivery</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <span className="font-black text-base text-[#1E1915]">{formatPrice(order.finalTotal)}</span>
                </div>
              </div>

              {/* Customer details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#45382E] bg-neutral-50 p-3 rounded-2xl">
                <div>
                  <strong>Customer:</strong> {order.customerName}
                </div>
                <div>
                  <strong>Phone:</strong> {order.customerPhone}
                </div>
                {order.deliveryAddress && (
                  <div className="sm:col-span-2">
                    <strong>Address:</strong> {order.deliveryAddress} {order.city} {order.pinCode}
                  </div>
                )}
                {order.instructions && (
                  <div className="sm:col-span-2 text-amber-800">
                    <strong>Chef Notes:</strong> {order.instructions}
                  </div>
                )}
              </div>

              {/* Ordered items */}
              <div className="space-y-1 text-xs">
                {order.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-[#55473E]">
                    <span>
                      {it.quantity}x <strong>{it.productName}</strong> ({it.size})
                    </span>
                    <span className="font-bold">{formatPrice(it.totalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
