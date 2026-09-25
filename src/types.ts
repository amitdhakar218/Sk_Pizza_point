export type ProductCategory = 'pizza' | 'burger' | 'sandwich';

export type PizzaSize = 'Small' | 'Medium' | 'Large';

export interface SizePrice {
  size: PizzaSize | 'Standard';
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  sizes: SizePrice[];
  availableAddOns?: AddOn[];
  isAvailable: boolean;
  isFeatured?: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item instance id
  productId: string;
  productName: string;
  category: ProductCategory;
  imageUrl: string;
  selectedSize: PizzaSize | 'Standard';
  unitPrice: number;
  quantity: number;
  selectedAddOns: AddOn[];
  specialInstructions?: string;
}

export type OrderStatus =
  | 'Draft'
  | 'Awaiting WhatsApp submission'
  | 'Received'
  | 'Confirmed by restaurant'
  | 'Preparing'
  | 'Ready'
  | 'Out for delivery'
  | 'Completed'
  | 'Cancelled';

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  category: ProductCategory;
  size: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  addOns: string[];
}

export interface Order {
  id: string; // e.g. SKP-20260919-482910
  userId?: string; // UID of customer or 'guest'
  customerEmail?: string;
  customerName: string;
  customerPhone: string;
  orderType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  city?: string;
  pinCode?: string;
  instructions?: string;
  items: OrderItemSnapshot[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  finalTotal: number;
  paymentMode?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  whatsAppOpenedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phone?: string;
  defaultAddress?: string;
  city?: string;
  pinCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  altText: string;
  category?: string;
  sortOrder: number;
  isPublished: boolean;
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  youtubeUrl: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  aspectRatio: '16:9' | '9:16';
  sortOrder: number;
  isPublished: boolean;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface RestaurantSettings {
  restaurantName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  heroMediaType: 'video' | 'image'; // Admin configurable: video or image background
  heroImageUrl: string;
  homepageVideoUrl: string;
  homepageVideoPosterUrl: string;
  offersText?: string;
  aboutStory: string;
  speciality: string;
  address: string;
  phone?: string;
  email?: string;
  heroVideoUrl?: string;
  googleMapsUrl: string;
  googleMapsEmbedUrl?: string;
  whatsAppNumber: string;
  whatsAppDirectLink: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  openingHours: string;
  isDeliveryAvailable: boolean;
  isPickupAvailable: boolean;
  deliveryFee: number;
  deliveryFeeNote: string;
  minOrderAmount: number;
  adminPasscode: string;
}
