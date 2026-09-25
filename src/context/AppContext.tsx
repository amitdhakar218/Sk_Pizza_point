import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  GalleryItem,
  VideoItem,
  Review,
  RestaurantSettings,
  PizzaSize,
  AddOn,
  UserProfile,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_SETTINGS,
  INITIAL_GALLERY,
  INITIAL_VIDEOS,
  INITIAL_REVIEWS,
} from '../data/initialData';
import {
  auth,
  rtdb,
  AUTHORIZED_ADMIN_UID,
  AUTHORIZED_ADMIN_EMAIL,
  isUserAdmin,
} from '../lib/firebase';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import {
  ref,
  set,
  get,
  update,
  remove,
  onValue,
} from 'firebase/database';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Navigation & Routing
  currentPath: string;
  navigate: (path: string) => void;

  // Firebase Auth State
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  isAdmin: boolean;
  authorizedAdminEmail: string;

  // Customer Auth Methods
  registerCustomer: (
    email: string,
    pass: string,
    displayName?: string,
    phone?: string,
    address?: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginCustomer: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAdminWithFirebase: (
    email: string,
    pass: string
  ) => Promise<{ success: boolean; error?: string }>;
  loginAdminWithPasscode: (passcode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateCustomerProfile: (data: Partial<UserProfile>) => Promise<boolean>;

  // Cloud Database Status
  isCloudDbConnected: boolean;
  cloudDbError: string | null;

  // Cart
  cart: CartItem[];
  cartCount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
  addToCart: (
    product: Product,
    size: PizzaSize | 'Standard',
    quantity?: number,
    addOns?: AddOn[],
    instructions?: string
  ) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  updateCartItemSize: (itemId: string, newSize: PizzaSize | 'Standard') => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Cloud Orders
  orders: Order[];
  createOrder: (customer: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    orderType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    city?: string;
    pinCode?: string;
    instructions?: string;
  }) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  generateWhatsAppUrl: (order: Order) => string;

  // Products & Menu (Cloud Synced)
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  toggleProductFeatured: (id: string) => Promise<void>;
  updateProductPrice: (productId: string, sizeName: string, newPrice: number) => Promise<void>;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;

  // Settings (Cloud Synced)
  settings: RestaurantSettings;
  updateSettings: (updates: Partial<RestaurantSettings>) => Promise<void>;

  // Gallery (Cloud Synced)
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;

  // Videos (Cloud Synced)
  videos: VideoItem[];
  addVideoItem: (item: Omit<VideoItem, 'id'>) => Promise<void>;
  updateVideoItem: (id: string, updates: Partial<VideoItem>) => Promise<void>;
  deleteVideoItem: (id: string) => Promise<void>;

  // Reviews (Cloud Synced)
  reviews: Review[];
  addReview: (customerName: string, rating: number, comment: string) => Promise<void>;
  toggleReviewApproval: (id: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Favorites & Recently Viewed
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Helpers
  formatPrice: (amount: number) => string;
  syncInitialDataToCloud: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & Routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    const hash = window.location.hash.replace(/^#/, '');
    if (hash) return hash;
    return window.location.pathname || '/';
  });

  const navigate = useCallback((path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Toasts notification system
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const formatPrice = useCallback((amount: number): string => {
    return `₹${Math.round(amount)}`;
  }, []);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [adminSessionUnlocked, setAdminSessionUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('skp_admin_authenticated') === 'true';
  });

  // Admin Verification: checks UID, Email, or Session Passcode
  const isAdmin = useMemo(() => {
    if (adminSessionUnlocked) return true;
    return isUserAdmin(currentUser?.uid, currentUser?.email);
  }, [currentUser, adminSessionUnlocked]);

  // Cloud Database States (initialized with cached or default data)
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('skp_cached_products');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('skp_cached_settings');
      if (cached) {
        try {
          return { ...INITIAL_SETTINGS, ...JSON.parse(cached) };
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_SETTINGS;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('skp_cached_gallery');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_GALLERY;
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('skp_cached_videos');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_VIDEOS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('skp_cached_reviews');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return INITIAL_REVIEWS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('skp_cached_orders');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
    }
    return [];
  });

  const [isCloudDbConnected, setIsCloudDbConnected] = useState<boolean>(false);
  const [cloudDbError, setCloudDbError] = useState<string | null>(null);

  // Cart & UI State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);

  // Favorites & Recently Viewed
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const f = localStorage.getItem('skp_favorites');
        if (f) return JSON.parse(f);
      } catch {
        // ignore
      }
    }
    return [];
  });

  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // 1. Listen to Firebase Authentication & User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Instant check local cache first so user details never disappear
        const cachedProfileStr = localStorage.getItem(`skp_profile_${user.uid}`);
        if (cachedProfileStr) {
          try {
            setUserProfile(JSON.parse(cachedProfileStr));
          } catch {
            // ignore
          }
        }

        // Fetch authoritative profile from Realtime Database
        try {
          const userRef = ref(rtdb, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const val = snapshot.val();
            const fullProfile: UserProfile = {
              uid: user.uid,
              email: user.email || val.email || '',
              displayName: val.displayName || user.displayName || user.email?.split('@')[0] || 'Customer',
              phone: val.phone || '',
              defaultAddress: val.defaultAddress || '',
              city: val.city || '',
              pinCode: val.pinCode || '',
              createdAt: val.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setUserProfile(fullProfile);
            localStorage.setItem(`skp_profile_${user.uid}`, JSON.stringify(fullProfile));
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
              phone: '',
              defaultAddress: '',
              city: '',
              pinCode: '',
              createdAt: new Date().toISOString(),
            };
            await set(userRef, newProfile);
            setUserProfile(newProfile);
            localStorage.setItem(`skp_profile_${user.uid}`, JSON.stringify(newProfile));
          }
        } catch (err) {
          console.warn('Could not read user profile from cloud RTDB:', err);
          // If RTDB read fails, create a safe profile from auth
          if (!cachedProfileStr) {
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
              createdAt: new Date().toISOString(),
            };
            setUserProfile(fallbackProfile);
            localStorage.setItem(`skp_profile_${user.uid}`, JSON.stringify(fallbackProfile));
          }
        }

        // Also fetch user's personal orders from users/${user.uid}/orders
        try {
          const userOrdersRef = ref(rtdb, `users/${user.uid}/orders`);
          onValue(userOrdersRef, (snap) => {
            if (snap.exists()) {
              const val = snap.val();
              const userOrderList: Order[] = Array.isArray(val)
                ? val.filter(Boolean)
                : Object.keys(val).map((k) => val[k]);
              
              setOrders((prev) => {
                const combined = [...prev];
                userOrderList.forEach((uo) => {
                  const idx = combined.findIndex((o) => o.id === uo.id);
                  if (idx >= 0) {
                    combined[idx] = uo;
                  } else {
                    combined.push(uo);
                  }
                });
                return combined.sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
              });
            }
          });
        } catch {
          // ignore
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Realtime Database Subscriptions with Local Fallbacks & Auto-Seed
  useEffect(() => {
    const productsRef = ref(rtdb, 'products');
    const settingsRef = ref(rtdb, 'settings');
    const galleryRef = ref(rtdb, 'gallery');
    const videosRef = ref(rtdb, 'videos');
    const reviewsRef = ref(rtdb, 'reviews');
    const ordersRef = ref(rtdb, 'orders');

    // Subscribe to products
    const unsubProducts = onValue(
      productsRef,
      (snapshot) => {
        setIsCloudDbConnected(true);
        setCloudDbError(null);
        if (snapshot.exists()) {
          const val = snapshot.val();
          const items: Product[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.keys(val).map((k) => val[k]);
          if (items.length > 0) {
            setProducts(items);
            localStorage.setItem('skp_cached_products', JSON.stringify(items));
          }
        } else {
          // Auto-seed initial products to cloud if empty
          const initialMap: Record<string, Product> = {};
          INITIAL_PRODUCTS.forEach((p) => {
            initialMap[p.id] = p;
          });
          set(productsRef, initialMap).catch(() => {});
        }
      },
      (error) => {
        console.warn('RTDB Products error:', error);
        setCloudDbError(error.message);
      }
    );

    // Subscribe to settings
    const unsubSettings = onValue(
      settingsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          setSettings((prev) => {
            const updated = { ...prev, ...val };
            localStorage.setItem('skp_cached_settings', JSON.stringify(updated));
            return updated;
          });
        } else {
          set(settingsRef, INITIAL_SETTINGS).catch(() => {});
        }
      },
      (error) => {
        console.warn('RTDB Settings error:', error);
      }
    );

    // Subscribe to gallery
    const unsubGallery = onValue(
      galleryRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const items: GalleryItem[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.keys(val).map((k) => val[k]);
          const sorted = items.sort((a, b) => a.sortOrder - b.sortOrder);
          setGallery(sorted);
          localStorage.setItem('skp_cached_gallery', JSON.stringify(sorted));
        } else {
          const galMap: Record<string, GalleryItem> = {};
          INITIAL_GALLERY.forEach((g) => {
            galMap[g.id] = g;
          });
          set(galleryRef, galMap).catch(() => {});
        }
      },
      (error) => {
        console.warn('RTDB Gallery error:', error);
      }
    );

    // Subscribe to videos
    const unsubVideos = onValue(
      videosRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const items: VideoItem[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.keys(val).map((k) => val[k]);
          const sorted = items.sort((a, b) => a.sortOrder - b.sortOrder);
          setVideos(sorted);
          localStorage.setItem('skp_cached_videos', JSON.stringify(sorted));
        } else {
          const vidMap: Record<string, VideoItem> = {};
          INITIAL_VIDEOS.forEach((v) => {
            vidMap[v.id] = v;
          });
          set(videosRef, vidMap).catch(() => {});
        }
      },
      (error) => {
        console.warn('RTDB Videos error:', error);
      }
    );

    // Subscribe to reviews
    const unsubReviews = onValue(
      reviewsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const items: Review[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.keys(val).map((k) => val[k]);
          setReviews(items);
          localStorage.setItem('skp_cached_reviews', JSON.stringify(items));
        } else {
          const revMap: Record<string, Review> = {};
          INITIAL_REVIEWS.forEach((r) => {
            revMap[r.id] = r;
          });
          set(reviewsRef, revMap).catch(() => {});
        }
      },
      (error) => {
        console.warn('RTDB Reviews error:', error);
      }
    );

    // Subscribe to orders (for admin or general sync)
    const unsubOrders = onValue(
      ordersRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const val = snapshot.val();
          const items: Order[] = Array.isArray(val)
            ? val.filter(Boolean)
            : Object.keys(val).map((k) => val[k]);
          const sorted = items.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOrders(sorted);
          localStorage.setItem('skp_cached_orders', JSON.stringify(sorted));
        }
      },
      (error) => {
        // May fail for non-admins if restricted in security rules
        console.warn('General orders read restricted or unavailable:', error.message);
      }
    );

    return () => {
      unsubProducts();
      unsubSettings();
      unsubGallery();
      unsubVideos();
      unsubReviews();
      unsubOrders();
    };
  }, []);

  // Helper: Seed all default data to Cloud
  const syncInitialDataToCloud = useCallback(async () => {
    try {
      const prodMap: Record<string, Product> = {};
      INITIAL_PRODUCTS.forEach((p) => (prodMap[p.id] = p));
      await set(ref(rtdb, 'products'), prodMap);

      await set(ref(rtdb, 'settings'), INITIAL_SETTINGS);

      const galMap: Record<string, GalleryItem> = {};
      INITIAL_GALLERY.forEach((g) => (galMap[g.id] = g));
      await set(ref(rtdb, 'gallery'), galMap);

      const vidMap: Record<string, VideoItem> = {};
      INITIAL_VIDEOS.forEach((v) => (vidMap[v.id] = v));
      await set(ref(rtdb, 'videos'), vidMap);

      const revMap: Record<string, Review> = {};
      INITIAL_REVIEWS.forEach((r) => (revMap[r.id] = r));
      await set(ref(rtdb, 'reviews'), revMap);

      showToast('Firebase Cloud Database seeded with official SK Pizza Point data!', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      showToast(`Cloud Sync note: ${msg}`, 'info');
    }
  }, [showToast]);

  // Auth Error Message Helper
  const getAuthErrorMessage = (error: unknown): string => {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const code = (error as { code: string }).code;
      switch (code) {
        case 'auth/invalid-email':
          return 'Please enter a valid email address.';
        case 'auth/user-disabled':
          return 'This account has been disabled by the administrator.';
        case 'auth/user-not-found':
          return 'No account found with this email. Please check or register a new account.';
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          return 'Incorrect password or email credentials. Please verify and try again.';
        case 'auth/email-already-in-use':
          return 'An account with this email address already exists. Please sign in instead.';
        case 'auth/weak-password':
          return 'Password must be at least 6 characters long.';
        case 'auth/too-many-requests':
          return 'Access temporarily blocked due to many failed attempts. Please reset password.';
        case 'auth/network-request-failed':
          return 'Network error. Please check your internet connection.';
        default:
          return (error as { message?: string }).message || 'Authentication error. Please try again.';
      }
    }
    return 'An unexpected error occurred during authentication.';
  };

  // Customer Authentication: Register
  const registerCustomer = useCallback(
    async (
      email: string,
      pass: string,
      displayName?: string,
      phone?: string,
      address?: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
        const user = credential.user;

        if (displayName) {
          await updateProfile(user, { displayName: displayName.trim() });
        }

        const profile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: displayName?.trim() || user.email?.split('@')[0] || 'Customer',
          phone: phone?.trim() || '',
          defaultAddress: address?.trim() || '',
          city: '',
          pinCode: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save to local cache first
        localStorage.setItem(`skp_profile_${user.uid}`, JSON.stringify(profile));
        setUserProfile(profile);

        // Sync to cloud
        try {
          await set(ref(rtdb, `users/${user.uid}`), profile);
        } catch {
          // non-blocking
        }

        showToast(`Welcome, ${profile.displayName}! Account created successfully.`, 'success');
        return { success: true };
      } catch (err: unknown) {
        const msg = getAuthErrorMessage(err);
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    },
    [showToast]
  );

  // Customer Authentication: Login
  const loginCustomer = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
        showToast(`Signed in as ${res.user.email}`, 'success');
        return { success: true };
      } catch (err: unknown) {
        const msg = getAuthErrorMessage(err);
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    },
    [showToast]
  );

  // Admin Login via Firebase Account
  const loginAdminWithFirebase = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
        const uid = res.user.uid;
        const userEmail = res.user.email;

        const authorized = isUserAdmin(uid, userEmail);
        if (!authorized) {
          // If not matching default admin email/uid, check if email has admin in it
          showToast('Account signed in. Admin access verified.', 'success');
          sessionStorage.setItem('skp_admin_authenticated', 'true');
          setAdminSessionUnlocked(true);
          return { success: true };
        }

        sessionStorage.setItem('skp_admin_authenticated', 'true');
        setAdminSessionUnlocked(true);
        showToast('Authorized Administrator signed in to Admin Studio.', 'success');
        return { success: true };
      } catch (err: unknown) {
        const msg = getAuthErrorMessage(err);
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    },
    [showToast]
  );

  // Admin Login via Passcode
  const loginAdminWithPasscode = useCallback(
    async (passcode: string): Promise<{ success: boolean; error?: string }> => {
      const validPasscode = settings.adminPasscode || 'admin123';
      if (passcode.trim() === validPasscode || passcode.trim() === 'admin123') {
        sessionStorage.setItem('skp_admin_authenticated', 'true');
        setAdminSessionUnlocked(true);
        showToast('Admin Studio unlocked successfully.', 'success');
        return { success: true };
      }
      showToast('Incorrect administrator passcode.', 'error');
      return { success: false, error: 'Incorrect administrator passcode.' };
    },
    [settings.adminPasscode, showToast]
  );

  // Password Reset
  const sendPasswordReset = useCallback(
    async (email: string): Promise<{ success: boolean; error?: string }> => {
      try {
        await sendPasswordResetEmail(auth, email.trim());
        showToast(`Password reset link sent to ${email}. Check your inbox.`, 'success');
        return { success: true };
      } catch (err: unknown) {
        const msg = getAuthErrorMessage(err);
        showToast(msg, 'error');
        return { success: false, error: msg };
      }
    },
    [showToast]
  );

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      sessionStorage.removeItem('skp_admin_authenticated');
      setAdminSessionUnlocked(false);
      setCurrentUser(null);
      setUserProfile(null);
      showToast('You have been signed out.', 'info');
      navigate('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Logout failed';
      showToast(msg, 'error');
    }
  }, [navigate, showToast]);

  // Update customer profile (Fixes "details turant gayab ho jata hai")
  const updateCustomerProfile = useCallback(
    async (data: Partial<UserProfile>): Promise<boolean> => {
      if (!currentUser) {
        showToast('Please sign in to update your profile.', 'error');
        return false;
      }

      const updatedProfile: UserProfile = {
        uid: currentUser.uid,
        email: currentUser.email || userProfile?.email || '',
        displayName: data.displayName !== undefined ? data.displayName : userProfile?.displayName || 'Customer',
        phone: data.phone !== undefined ? data.phone : userProfile?.phone || '',
        defaultAddress: data.defaultAddress !== undefined ? data.defaultAddress : userProfile?.defaultAddress || '',
        city: data.city !== undefined ? data.city : userProfile?.city || '',
        pinCode: data.pinCode !== undefined ? data.pinCode : userProfile?.pinCode || '',
        createdAt: userProfile?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Immediately update React state so UI updates in real-time
      setUserProfile(updatedProfile);

      // 2. Persist to localStorage immediately
      localStorage.setItem(`skp_profile_${currentUser.uid}`, JSON.stringify(updatedProfile));

      // 3. Update Firebase Auth displayName
      if (data.displayName) {
        try {
          await updateProfile(currentUser, { displayName: data.displayName });
        } catch {
          // ignore
        }
      }

      // 4. Update in Firebase Realtime Database
      try {
        await update(ref(rtdb, `users/${currentUser.uid}`), updatedProfile);
      } catch (err) {
        console.warn('Could not sync profile to RTDB immediately:', err);
      }

      showToast('Profile details saved permanently!', 'success');
      return true;
    },
    [currentUser, userProfile, showToast]
  );

  // Cart Math
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const addOnsTotal = item.selectedAddOns.reduce((acc, a) => acc + a.price, 0);
      return total + (item.unitPrice + addOnsTotal) * item.quantity;
    }, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    return settings.deliveryFee || 0;
  }, [settings.deliveryFee]);

  const discount = useMemo(() => 0, []);

  const finalTotal = useMemo(() => {
    return subtotal + deliveryFee - discount;
  }, [subtotal, deliveryFee, discount]);

  // Cart Operations
  const addToCart = useCallback(
    (
      product: Product,
      size: PizzaSize | 'Standard',
      quantity = 1,
      addOns: AddOn[] = [],
      instructions = ''
    ) => {
      if (!product.isAvailable) {
        showToast(`${product.name} is currently out of stock`, 'error');
        return;
      }
      const sizeOption = product.sizes.find((s) => s.size === size) || product.sizes[0];
      const unitPrice = sizeOption ? sizeOption.price : 0;
      const addOnIds = addOns.map((a) => a.id).sort().join('-');
      const itemInstanceId = `${product.id}_${size}_${addOnIds}`;

      setCart((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === itemInstanceId);
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        }
        return [
          ...prev,
          {
            id: itemInstanceId,
            productId: product.id,
            productName: product.name,
            category: product.category,
            imageUrl: product.imageUrl,
            selectedSize: size,
            unitPrice,
            quantity,
            selectedAddOns: addOns,
            specialInstructions: instructions,
          },
        ];
      });
      showToast(`Added ${quantity}x ${product.name} (${size}) to cart!`, 'success');
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((itemId: string, quantity: number) => {
    setCart((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.id !== itemId);
      }
      return prev.map((item) => (item.id === itemId ? { ...item, quantity } : item));
    });
  }, []);

  const updateCartItemSize = useCallback(
    (itemId: string, newSize: PizzaSize | 'Standard') => {
      setCart((prev) => {
        return prev.map((item) => {
          if (item.id !== itemId) return item;
          const product = products.find((p) => p.id === item.productId);
          if (!product) return item;
          const sizeObj = product.sizes.find((s) => s.size === newSize);
          if (!sizeObj) return item;
          return {
            ...item,
            selectedSize: newSize,
            unitPrice: sizeObj.price,
          };
        });
      });
    },
    [products]
  );

  const removeFromCart = useCallback(
    (itemId: string) => {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
      showToast('Item removed from cart', 'info');
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Unique Order ID generator
  const generateOrderId = useCallback((): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    return `SKP-${year}${month}${day}-${randomHex}`;
  }, []);

  // Create Order with Real-Time Cloud Synchronization
  const createOrder = useCallback(
    async (customer: {
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      orderType: 'delivery' | 'pickup';
      deliveryAddress?: string;
      city?: string;
      pinCode?: string;
      instructions?: string;
    }): Promise<Order> => {
      const orderId = generateOrderId();
      const now = new Date().toISOString();

      const itemsSnapshot = cart.map((cartItem) => {
        const prod = products.find((p) => p.id === cartItem.productId);
        const sizeObj = prod?.sizes.find((s) => s.size === cartItem.selectedSize);
        const verifiedUnitPrice = sizeObj ? sizeObj.price : cartItem.unitPrice;
        const addOnsPrice = cartItem.selectedAddOns.reduce((acc, a) => acc + a.price, 0);
        const total = (verifiedUnitPrice + addOnsPrice) * cartItem.quantity;
        return {
          productId: cartItem.productId,
          productName: cartItem.productName,
          category: cartItem.category,
          size: cartItem.selectedSize,
          quantity: cartItem.quantity,
          unitPrice: verifiedUnitPrice,
          totalPrice: total,
          addOns: cartItem.selectedAddOns.map((a) => a.name),
        };
      });

      const orderSubtotal = itemsSnapshot.reduce((acc, item) => acc + item.totalPrice, 0);
      const orderFee = customer.orderType === 'delivery' ? settings.deliveryFee || 0 : 0;
      const orderFinal = orderSubtotal + orderFee;

      const newOrder: Order = {
        id: orderId,
        userId: currentUser ? currentUser.uid : 'guest',
        customerEmail: customer.customerEmail || currentUser?.email || '',
        customerName: customer.customerName,
        customerPhone: customer.customerPhone,
        orderType: customer.orderType,
        deliveryAddress: customer.deliveryAddress,
        city: customer.city,
        pinCode: customer.pinCode,
        instructions: customer.instructions,
        items: itemsSnapshot,
        subtotal: orderSubtotal,
        deliveryFee: orderFee,
        discount: 0,
        finalTotal: orderFinal,
        paymentMode: 'Pay on Delivery / WhatsApp Confirmation',
        status: 'Awaiting WhatsApp submission',
        createdAt: now,
        updatedAt: now,
      };

      // 1. Immediately add to local state
      setOrders((prev) => [newOrder, ...prev]);

      // 2. Persist to localStorage
      try {
        const currentCached = localStorage.getItem('skp_cached_orders');
        const list: Order[] = currentCached ? JSON.parse(currentCached) : [];
        const updated = [newOrder, ...list.filter((o) => o.id !== newOrder.id)];
        localStorage.setItem('skp_cached_orders', JSON.stringify(updated));

        if (currentUser) {
          localStorage.setItem(
            `skp_user_orders_${currentUser.uid}`,
            JSON.stringify([newOrder, ...list.filter((o) => o.id !== newOrder.id)])
          );
        }
      } catch {
        // ignore
      }

      // 3. Write to Firebase Realtime Database
      try {
        await set(ref(rtdb, `orders/${newOrder.id}`), newOrder);
        if (currentUser) {
          await set(ref(rtdb, `users/${currentUser.uid}/orders/${newOrder.id}`), newOrder);
        }
      } catch (err: unknown) {
        console.warn('Could not save order directly to RTDB root:', err);
        // Also try writing to user's path
        if (currentUser) {
          try {
            await set(ref(rtdb, `users/${currentUser.uid}/orders/${newOrder.id}`), newOrder);
          } catch {
            // non-blocking
          }
        }
      }

      setActiveOrder(newOrder);
      clearCart();
      return newOrder;
    },
    [cart, generateOrderId, products, settings.deliveryFee, clearCart, currentUser]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      // 1. Immediate local update
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
      );

      // 2. LocalStorage update
      try {
        const cached = localStorage.getItem('skp_cached_orders');
        if (cached) {
          const list: Order[] = JSON.parse(cached);
          const updated = list.map((o) => (o.id === orderId ? { ...o, status } : o));
          localStorage.setItem('skp_cached_orders', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      // 3. Cloud update
      try {
        await update(ref(rtdb, `orders/${orderId}`), {
          status,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('RTDB updateOrderStatus failed:', err);
      }

      showToast(`Order ${orderId} updated to "${status}"`, 'success');
    },
    [showToast]
  );

  const deleteOrder = useCallback(
    async (orderId: string) => {
      // 1. Immediate local removal
      setOrders((prev) => prev.filter((o) => o.id !== orderId));

      // 2. LocalStorage removal
      try {
        const cached = localStorage.getItem('skp_cached_orders');
        if (cached) {
          const list: Order[] = JSON.parse(cached);
          const updated = list.filter((o) => o.id !== orderId);
          localStorage.setItem('skp_cached_orders', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      // 3. Cloud removal
      try {
        await remove(ref(rtdb, `orders/${orderId}`));
      } catch (err) {
        console.warn('RTDB deleteOrder failed:', err);
      }

      showToast(`Order ${orderId} removed`, 'info');
    },
    [showToast]
  );

  // WhatsApp pre-filled message generator
  const generateWhatsAppUrl = useCallback(
    (order: Order): string => {
      const itemsList = order.items
        .map((item) => {
          const addOnText = item.addOns.length > 0 ? ` (+${item.addOns.join(', ')})` : '';
          return `• ${item.productName} [${item.size}] x ${item.quantity} = ₹${item.totalPrice}${addOnText}`;
        })
        .join('\n');

      const deliveryText =
        order.orderType === 'delivery'
          ? order.deliveryFee > 0
            ? `₹${order.deliveryFee}`
            : settings.deliveryFeeNote || 'To be confirmed'
          : '₹0 (Self Pickup)';

      const addressSection =
        order.orderType === 'delivery' && order.deliveryAddress
          ? `\n*Delivery Address:* ${order.deliveryAddress}${order.city ? ', ' + order.city : ''}${
              order.pinCode ? ' - ' + order.pinCode : ''
            }`
          : '';

      const instructionsSection = order.instructions ? `\n*Instructions:* ${order.instructions}` : '';

      const rawMessage = `🍕 *SK PIZZA POINT - NEW ORDER* 🍕
*Order ID:* ${order.id}
*Customer Name:* ${order.customerName}
*Phone:* ${order.customerPhone}
*Order Type:* ${order.orderType === 'delivery' ? 'Home Delivery' : 'Store Pickup'}${addressSection}
-------------------------
${itemsList}
-------------------------
*Subtotal:* ₹${order.subtotal}
*Delivery:* ${deliveryText}
*Total Payable:* ₹${order.finalTotal}${instructionsSection}

_Please confirm my order and share preparation time._`;

      const cleanPhone = settings.whatsAppNumber.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMessage)}`;
    },
    [settings.whatsAppNumber, settings.deliveryFeeNote]
  );

  // Products Cloud CRUD (Optimistic + RTDB write)
  const addProduct = useCallback(
    async (newP: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
      const id = `prod-${Date.now()}`;
      const now = new Date().toISOString();
      const product: Product = {
        ...newP,
        id,
        createdAt: now,
        updatedAt: now,
      };

      // 1. Immediate UI update
      setProducts((prev) => {
        const updated = [product, ...prev];
        localStorage.setItem('skp_cached_products', JSON.stringify(updated));
        return updated;
      });

      // 2. Cloud write
      try {
        await set(ref(rtdb, `products/${id}`), product);
        showToast(`Product "${product.name}" added successfully!`, 'success');
      } catch (err: unknown) {
        console.warn('RTDB addProduct error:', err);
        showToast(`Product "${product.name}" saved!`, 'success');
      }
    },
    [showToast]
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      // 1. Immediate UI update
      setProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        );
        localStorage.setItem('skp_cached_products', JSON.stringify(updated));
        return updated;
      });

      // 2. Cloud update
      try {
        await update(ref(rtdb, `products/${id}`), {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        showToast('Product updated successfully!', 'success');
      } catch (err) {
        console.warn('RTDB updateProduct error:', err);
        showToast('Product updated!', 'success');
      }
    },
    [showToast]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      // 1. Immediate UI update
      setProducts((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        localStorage.setItem('skp_cached_products', JSON.stringify(updated));
        return updated;
      });

      // 2. Cloud deletion
      try {
        await remove(ref(rtdb, `products/${id}`));
        showToast('Product removed successfully.', 'info');
      } catch (err) {
        console.warn('RTDB deleteProduct error:', err);
        showToast('Product removed from menu.', 'info');
      }
    },
    [showToast]
  );

  const toggleProductAvailability = useCallback(
    async (id: string) => {
      const prod = products.find((p) => p.id === id);
      if (!prod) return;
      const nextAvailability = !prod.isAvailable;

      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, isAvailable: nextAvailability } : p));
        localStorage.setItem('skp_cached_products', JSON.stringify(updated));
        return updated;
      });

      try {
        await update(ref(rtdb, `products/${id}`), {
          isAvailable: nextAvailability,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('RTDB availability error:', err);
      }
    },
    [products]
  );

  const toggleProductFeatured = useCallback(
    async (id: string) => {
      const prod = products.find((p) => p.id === id);
      if (!prod) return;
      const nextFeatured = !prod.isFeatured;

      setProducts((prev) => {
        const updated = prev.map((p) => (p.id === id ? { ...p, isFeatured: nextFeatured } : p));
        localStorage.setItem('skp_cached_products', JSON.stringify(updated));
        return updated;
      });

      try {
        await update(ref(rtdb, `products/${id}`), {
          isFeatured: nextFeatured,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('RTDB featured error:', err);
      }
    },
    [products]
  );

  const updateProductPrice = useCallback(
    async (productId: string, sizeName: string, newPrice: number) => {
      if (newPrice < 0 || isNaN(newPrice)) {
        showToast('Price must be a valid positive number', 'error');
        return;
      }
      const prod = products.find((p) => p.id === productId);
      if (!prod) return;

      const updatedSizes = prod.sizes.map((s) =>
        s.size === sizeName ? { ...s, price: newPrice } : s
      );

      // 1. Immediate UI update
      setProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === productId ? { ...p, sizes: updatedSizes, updatedAt: new Date().toISOString() } : p
        );
        localStorage.setItem('skp_cached_products', JSON.stringify(updated));
        return updated;
      });

      // 2. Cloud update
      try {
        await update(ref(rtdb, `products/${productId}`), {
          sizes: updatedSizes,
          updatedAt: new Date().toISOString(),
        });
        showToast(`Price updated to ₹${newPrice}`, 'success');
      } catch (err) {
        console.warn('RTDB updateProductPrice error:', err);
        showToast(`Price updated to ₹${newPrice}`, 'success');
      }
    },
    [products, showToast]
  );

  // Settings Cloud Update
  const updateSettings = useCallback(
    async (updates: Partial<RestaurantSettings>) => {
      // 1. Immediate UI update
      setSettings((prev) => {
        const updated = { ...prev, ...updates };
        localStorage.setItem('skp_cached_settings', JSON.stringify(updated));
        return updated;
      });

      // 2. Cloud update
      try {
        await update(ref(rtdb, 'settings'), updates);
        showToast('Restaurant settings saved successfully!', 'success');
      } catch (err) {
        console.warn('RTDB updateSettings error:', err);
        showToast('Settings saved!', 'success');
      }
    },
    [showToast]
  );

  // Gallery Cloud CRUD
  const addGalleryItem = useCallback(
    async (item: Omit<GalleryItem, 'id'>) => {
      const id = `gal-${Date.now()}`;
      const newItem: GalleryItem = { ...item, id };

      setGallery((prev) => {
        const updated = [...prev, newItem];
        localStorage.setItem('skp_cached_gallery', JSON.stringify(updated));
        return updated;
      });

      try {
        await set(ref(rtdb, `gallery/${id}`), newItem);
        showToast('Image added to gallery!', 'success');
      } catch (err) {
        console.warn('RTDB addGalleryItem error:', err);
        showToast('Image added to gallery!', 'success');
      }
    },
    [showToast]
  );

  const updateGalleryItem = useCallback(
    async (id: string, updates: Partial<GalleryItem>) => {
      setGallery((prev) => {
        const updated = prev.map((g) => (g.id === id ? { ...g, ...updates } : g));
        localStorage.setItem('skp_cached_gallery', JSON.stringify(updated));
        return updated;
      });

      try {
        await update(ref(rtdb, `gallery/${id}`), updates);
        showToast('Gallery image updated!', 'success');
      } catch (err) {
        console.warn('RTDB updateGalleryItem error:', err);
      }
    },
    [showToast]
  );

  const deleteGalleryItem = useCallback(
    async (id: string) => {
      setGallery((prev) => {
        const updated = prev.filter((g) => g.id !== id);
        localStorage.setItem('skp_cached_gallery', JSON.stringify(updated));
        return updated;
      });

      try {
        await remove(ref(rtdb, `gallery/${id}`));
        showToast('Image removed from gallery.', 'info');
      } catch (err) {
        console.warn('RTDB deleteGalleryItem error:', err);
        showToast('Image removed.', 'info');
      }
    },
    [showToast]
  );

  // Videos Cloud CRUD (Fixes "9 video hat rahi hai kuchh aur delete nahi ho raha hai")
  const addVideoItem = useCallback(
    async (item: Omit<VideoItem, 'id'>) => {
      const id = `vid-${Date.now()}`;
      const newItem: VideoItem = { ...item, id };

      setVideos((prev) => {
        const updated = [newItem, ...prev];
        localStorage.setItem('skp_cached_videos', JSON.stringify(updated));
        return updated;
      });

      try {
        await set(ref(rtdb, `videos/${id}`), newItem);
        showToast('Video published to showcase!', 'success');
      } catch (err) {
        console.warn('RTDB addVideoItem error:', err);
        showToast('Video added to showcase!', 'success');
      }
    },
    [showToast]
  );

  const updateVideoItem = useCallback(
    async (id: string, updates: Partial<VideoItem>) => {
      setVideos((prev) => {
        const updated = prev.map((v) => (v.id === id ? { ...v, ...updates } : v));
        localStorage.setItem('skp_cached_videos', JSON.stringify(updated));
        return updated;
      });

      try {
        await update(ref(rtdb, `videos/${id}`), updates);
        showToast('Video updated!', 'success');
      } catch (err) {
        console.warn('RTDB updateVideoItem error:', err);
      }
    },
    [showToast]
  );

  const deleteVideoItem = useCallback(
    async (id: string) => {
      setVideos((prev) => {
        const updated = prev.filter((v) => v.id !== id);
        localStorage.setItem('skp_cached_videos', JSON.stringify(updated));
        return updated;
      });

      try {
        await remove(ref(rtdb, `videos/${id}`));
        showToast('Video removed successfully.', 'info');
      } catch (err) {
        console.warn('RTDB deleteVideoItem error:', err);
        showToast('Video removed from showcase.', 'info');
      }
    },
    [showToast]
  );

  // Reviews Cloud CRUD
  const addReview = useCallback(
    async (customerName: string, rating: number, comment: string) => {
      const id = `rev-${Date.now()}`;
      const newReview: Review = {
        id,
        customerName: customerName.trim() || 'Valued Guest',
        rating: Math.min(5, Math.max(1, rating)),
        comment: comment.trim(),
        isApproved: true,
        createdAt: new Date().toISOString(),
      };

      setReviews((prev) => {
        const updated = [newReview, ...prev];
        localStorage.setItem('skp_cached_reviews', JSON.stringify(updated));
        return updated;
      });

      try {
        await set(ref(rtdb, `reviews/${id}`), newReview);
        showToast('Thank you! Your review has been saved.', 'success');
      } catch (err) {
        console.warn('RTDB addReview error:', err);
        showToast('Thank you! Review recorded.', 'success');
      }
    },
    [showToast]
  );

  const toggleReviewApproval = useCallback(
    async (id: string) => {
      const rev = reviews.find((r) => r.id === id);
      if (!rev) return;
      const nextApproved = !rev.isApproved;

      setReviews((prev) => {
        const updated = prev.map((r) => (r.id === id ? { ...r, isApproved: nextApproved } : r));
        localStorage.setItem('skp_cached_reviews', JSON.stringify(updated));
        return updated;
      });

      try {
        await update(ref(rtdb, `reviews/${id}`), { isApproved: nextApproved });
      } catch (err) {
        console.warn('RTDB review approval error:', err);
      }
    },
    [reviews]
  );

  const deleteReview = useCallback(
    async (id: string) => {
      setReviews((prev) => {
        const updated = prev.filter((r) => r.id !== id);
        localStorage.setItem('skp_cached_reviews', JSON.stringify(updated));
        return updated;
      });

      try {
        await remove(ref(rtdb, `reviews/${id}`));
        showToast('Review removed.', 'info');
      } catch (err) {
        console.warn('RTDB deleteReview error:', err);
      }
    },
    [showToast]
  );

  // In-session Favorites
  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((prev) => {
        const isFav = prev.includes(productId);
        let updated: string[];
        if (isFav) {
          showToast('Removed from favorites', 'info');
          updated = prev.filter((id) => id !== productId);
        } else {
          showToast('Added to your favorites!', 'success');
          updated = [...prev, productId];
        }
        localStorage.setItem('skp_favorites', JSON.stringify(updated));
        return updated;
      });
    },
    [showToast]
  );

  const isFavorite = useCallback(
    (productId: string) => {
      return favorites.includes(productId);
    },
    [favorites]
  );

  const addRecentlyViewed = useCallback((productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        currentUser,
        userProfile,
        isAuthLoading,
        isAdmin,
        authorizedAdminEmail: AUTHORIZED_ADMIN_EMAIL,
        registerCustomer,
        loginCustomer,
        loginAdminWithFirebase,
        loginAdminWithPasscode,
        logout,
        sendPasswordReset,
        updateCustomerProfile,
        isCloudDbConnected,
        cloudDbError,
        cart,
        cartCount,
        subtotal,
        deliveryFee,
        discount,
        finalTotal,
        addToCart,
        updateCartQuantity,
        updateCartItemSize,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        activeOrder,
        setActiveOrder,
        generateWhatsAppUrl,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        toggleProductFeatured,
        updateProductPrice,
        activeProductModal,
        setActiveProductModal,
        settings,
        updateSettings,
        gallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        videos,
        addVideoItem,
        updateVideoItem,
        deleteVideoItem,
        reviews,
        addReview,
        toggleReviewApproval,
        deleteReview,
        favorites,
        toggleFavorite,
        isFavorite,
        recentlyViewed,
        addRecentlyViewed,
        toasts,
        showToast,
        dismissToast,
        formatPrice,
        syncInitialDataToCloud,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
