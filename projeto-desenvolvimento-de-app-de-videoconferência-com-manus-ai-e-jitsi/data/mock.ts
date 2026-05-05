import { User, Product, LiveSession, Order, ChatMessage } from '@/types';

// ============================================================
// Usuários Mock
// ============================================================
export const MOCK_SELLERS: User[] = [
  {
    id: 'seller-1',
    name: 'Ana Moda',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'seller',
    savedAddress: { street: 'Rua das Flores, 123', city: 'São Paulo', state: 'SP', zip: '01310-100' },
    savedPayment: { type: 'credit_card', last4: '4242', brand: 'Visa' },
  },
  {
    id: 'seller-2',
    name: 'Tech Store BR',
    avatar: 'https://i.pravatar.cc/150?img=68',
    role: 'seller',
    savedAddress: { street: 'Av. Paulista, 1000', city: 'São Paulo', state: 'SP', zip: '01310-200' },
    savedPayment: { type: 'pix' },
  },
  {
    id: 'seller-3',
    name: 'Casa & Decor',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'seller',
    savedAddress: { street: 'Rua Oscar Freire, 55', city: 'São Paulo', state: 'SP', zip: '01426-000' },
    savedPayment: { type: 'credit_card', last4: '1234', brand: 'Mastercard' },
  },
];

export const DEFAULT_BUYER: User = {
  id: 'buyer-1',
  name: 'João Silva',
  avatar: 'https://i.pravatar.cc/150?img=12',
  role: 'buyer',
  savedAddress: { street: 'Rua Consolação, 200', city: 'São Paulo', state: 'SP', zip: '01302-000' },
  savedPayment: { type: 'credit_card', last4: '5678', brand: 'Visa' },
};

// ============================================================
// Produtos Mock
// ============================================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Vestido Floral Verão',
    description: 'Vestido leve com estampa floral, perfeito para o verão. Tecido 100% algodão.',
    price: 89.90,
    originalPrice: 149.90,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80',
    category: 'Moda Feminina',
    stock: 3,
    maxStock: 20,
    discount: 40,
    featured: true,
  },
  {
    id: 'prod-2',
    name: 'Tênis Casual Branco',
    description: 'Tênis confortável para o dia a dia, solado antiderrapante.',
    price: 199.90,
    originalPrice: 299.90,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    category: 'Calçados',
    stock: 8,
    maxStock: 30,
    discount: 33,
  },
  {
    id: 'prod-3',
    name: 'Bolsa Couro Sintético',
    description: 'Bolsa espaçosa com alça regulável, couro sintético premium.',
    price: 159.90,
    originalPrice: 220.00,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
    category: 'Acessórios',
    stock: 5,
    maxStock: 15,
    discount: 27,
  },
  {
    id: 'prod-4',
    name: 'Fone Bluetooth Premium',
    description: 'Fone sem fio com cancelamento de ruído ativo, 30h de bateria.',
    price: 349.90,
    originalPrice: 599.90,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    category: 'Eletrônicos',
    stock: 12,
    maxStock: 50,
    discount: 42,
  },
  {
    id: 'prod-5',
    name: 'Smartwatch Fitness',
    description: 'Monitor cardíaco, GPS integrado, resistente à água. Compatível com Android e iOS.',
    price: 499.90,
    originalPrice: 799.90,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    category: 'Eletrônicos',
    stock: 2,
    maxStock: 20,
    discount: 37,
    featured: true,
  },
  {
    id: 'prod-6',
    name: 'Kit Skincare Completo',
    description: 'Kit com sérum, hidratante e protetor solar. Pele radiante em 30 dias.',
    price: 129.90,
    originalPrice: 189.90,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
    category: 'Beleza',
    stock: 7,
    maxStock: 25,
    discount: 32,
  },
  {
    id: 'prod-7',
    name: 'Luminária LED Decorativa',
    description: 'Luminária com 16 cores RGB, controle por app. Perfeita para home office.',
    price: 79.90,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80',
    category: 'Casa & Decor',
    stock: 15,
    maxStock: 40,
    discount: 33,
  },
  {
    id: 'prod-8',
    name: 'Mochila Impermeável 30L',
    description: 'Mochila para notebook até 15", compartimentos organizados, impermeável.',
    price: 179.90,
    originalPrice: 249.90,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    category: 'Acessórios',
    stock: 6,
    maxStock: 20,
    discount: 28,
  },
];

// ============================================================
// Lives Mock
// ============================================================
export const MOCK_LIVES: LiveSession[] = [
  {
    id: 'live-1',
    title: '🔥 Liquidação de Verão — Até 50% OFF!',
    description: 'Melhores peças da coleção verão com preços imperdíveis ao vivo!',
    seller: MOCK_SELLERS[0],
    roomName: 'liveshop-ana-moda-001',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    category: 'Moda',
    viewerCount: 1247,
    status: 'live',
    startedAt: new Date(Date.now() - 25 * 60 * 1000),
    products: [MOCK_PRODUCTS[0], MOCK_PRODUCTS[1], MOCK_PRODUCTS[2]],
    featuredProductId: 'prod-1',
  },
  {
    id: 'live-2',
    title: '📱 Tech Day — Eletrônicos com Frete Grátis',
    description: 'Os melhores gadgets do momento com preços exclusivos para quem está ao vivo!',
    seller: MOCK_SELLERS[1],
    roomName: 'liveshop-techstore-002',
    thumbnail: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=600&q=80',
    category: 'Eletrônicos',
    viewerCount: 892,
    status: 'live',
    startedAt: new Date(Date.now() - 10 * 60 * 1000),
    products: [MOCK_PRODUCTS[3], MOCK_PRODUCTS[4]],
    featuredProductId: 'prod-4',
  },
  {
    id: 'live-3',
    title: '🏠 Decora Seu Lar — Novidades Casa & Decor',
    description: 'Transforme sua casa com produtos lindos e acessíveis!',
    seller: MOCK_SELLERS[2],
    roomName: 'liveshop-casadecor-003',
    thumbnail: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
    category: 'Casa & Decor',
    viewerCount: 456,
    status: 'live',
    startedAt: new Date(Date.now() - 45 * 60 * 1000),
    products: [MOCK_PRODUCTS[6], MOCK_PRODUCTS[7]],
    featuredProductId: 'prod-7',
  },
  {
    id: 'live-4',
    title: '💄 Beauty Night — Skincare e Maquiagem',
    description: 'Dicas de skincare e produtos de beleza com desconto especial!',
    seller: MOCK_SELLERS[0],
    roomName: 'liveshop-beauty-004',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    category: 'Beleza',
    viewerCount: 0,
    status: 'scheduled',
    startedAt: new Date(),
    scheduledAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    products: [MOCK_PRODUCTS[5]],
  },
];

// ============================================================
// Chat Messages Mock
// ============================================================
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'msg-1', userId: 'u1', userName: 'Maria S.', text: 'Amei esse vestido! 😍', timestamp: new Date(Date.now() - 120000), type: 'message' },
  { id: 'msg-2', userId: 'u2', userName: 'Carlos M.', text: 'Tem no tamanho P?', timestamp: new Date(Date.now() - 90000), type: 'message' },
  { id: 'msg-3', userId: 'u3', userName: 'Fernanda L.', text: 'Comprei! Chegou em 2 dias da última vez 🚀', timestamp: new Date(Date.now() - 60000), type: 'purchase' },
  { id: 'msg-4', userId: 'u4', userName: 'Pedro R.', text: 'Qual o material?', timestamp: new Date(Date.now() - 45000), type: 'message' },
  { id: 'msg-5', userId: 'u5', userName: 'Julia A.', text: 'Entrou na live! 👋', timestamp: new Date(Date.now() - 30000), type: 'join' },
  { id: 'msg-6', userId: 'u6', userName: 'Roberto K.', text: 'Preço incrível! Vou comprar pra minha esposa', timestamp: new Date(Date.now() - 15000), type: 'message' },
  { id: 'msg-7', userId: 'u7', userName: 'Ana P.', text: '❤️❤️❤️', timestamp: new Date(Date.now() - 5000), type: 'message' },
];

// ============================================================
// Pedidos Mock
// ============================================================
export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    product: MOCK_PRODUCTS[0],
    liveSession: MOCK_LIVES[0],
    quantity: 1,
    totalPrice: 89.90,
    status: 'delivered',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    address: DEFAULT_BUYER.savedAddress!,
    paymentMethod: DEFAULT_BUYER.savedPayment!,
  },
  {
    id: 'order-2',
    product: MOCK_PRODUCTS[3],
    liveSession: MOCK_LIVES[1],
    quantity: 1,
    totalPrice: 349.90,
    status: 'shipped',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    address: DEFAULT_BUYER.savedAddress!,
    paymentMethod: DEFAULT_BUYER.savedPayment!,
  },
];
