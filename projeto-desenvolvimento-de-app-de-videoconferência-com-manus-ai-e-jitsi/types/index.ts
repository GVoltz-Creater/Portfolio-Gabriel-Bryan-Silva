// ============================================================
// Call in Buy — Tipos compartilhados
// ============================================================

export type UserRole = 'seller' | 'buyer';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  savedAddress?: Address;
  savedPayment?: PaymentMethod;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'pix';
  last4?: string;
  brand?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  maxStock: number;
  featured?: boolean;
  discount?: number;
}

export interface LiveSession {
  id: string;
  title: string;
  description: string;
  seller: User;
  roomName: string;
  thumbnail: string;
  category: string;
  viewerCount: number;
  status: 'live' | 'scheduled' | 'ended';
  startedAt: Date;
  scheduledAt?: Date;
  products: Product[];
  featuredProductId?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
  type: 'message' | 'purchase' | 'join';
}

export interface Order {
  id: string;
  product: Product;
  liveSession: LiveSession;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
  address: Address;
  paymentMethod: PaymentMethod;
}

export interface StockAlert {
  productId: string;
  productName: string;
  stockLeft: number;
  percentage: number;
}

export interface Reaction {
  id: string;
  emoji: string;
  x: number;
}
