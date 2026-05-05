import React, {
  useState, useEffect, useRef, useCallback
} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Dimensions, Animated, FlatList, ScrollView,
  Platform, StatusBar as RNStatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { MOCK_LIVES, MOCK_CHAT_MESSAGES } from '@/data/mock';
import { Product, ChatMessage, Reaction, LiveSession } from '@/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import CheckoutModal from '@/components/CheckoutModal';
import StockAlertToast from '@/components/StockAlertToast';
import JitsiMeetView from '@/components/JitsiMeetView';

const { width, height } = Dimensions.get('window');
const EMOJIS = ['❤️', '🔥', '😍', '👏', '💯', '🎉', '⚡', '💸'];
const IS_SMALL_SCREEN = width < 375;
const IS_LARGE_SCREEN = width > 430;

//// ─── Jitsi Meet View ────────────────────────────────────────────────────────
function JitsiWebView({ roomName, displayName }: { roomName: string; displayName: string }) {
  return (
    <JitsiMeetView
      roomName={roomName}
      displayName={displayName}
      onConferenceJoined={() => console.log('Conferência iniciada')}
      onConferenceTerminated={() => console.log('Conferência encerrada')}
      onConferenceWillJoin={() => console.log('Entrando na conferência')}
    />
  );
}

// ─── Floating Reaction ────────────────────────────────────────────────────────
function FloatingReaction({ reaction, onDone }: { reaction: Reaction; onDone: () => void }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: -180, duration: 2000, useNativeDriver: true }),
      Animated.sequence([
        Animated.delay(1200),
        Animated.timing(opacity, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    ]).start(onDone);
  }, []);

  return (
    <Animated.Text
      style={[styles.floatingEmoji, {
        left: reaction.x,
        transform: [{ translateY }],
        opacity,
      }]}
    >
      {reaction.emoji}
    </Animated.Text>
  );
}

// ─── Chat Bubble ──────────────────────────────────────────────────────────────
function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isPurchase = msg.type === 'purchase';
  const isJoin = msg.type === 'join';
  return (
    <View style={[styles.chatBubble, isPurchase && styles.chatBubblePurchase]}>
      {isPurchase && <Text style={styles.chatPurchaseIcon}>🛍️</Text>}
      {isJoin && <Text style={styles.chatJoinIcon}>👋</Text>}
      <Text style={styles.chatUser} numberOfLines={1}>{msg.userName}</Text>
      <Text style={styles.chatText} numberOfLines={2}>{msg.text}</Text>
    </View>
  );
}

// ─── Product Carousel Item ────────────────────────────────────────────────────
function ProductCarouselItem({
  product, isActive, onPress
}: { product: Product; isActive: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.carouselItem, isActive && styles.carouselItemActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: product.image }} style={styles.carouselImage} resizeMode="cover" />
      {isActive && <View style={styles.carouselActiveDot} />}
      <View style={styles.carouselInfo}>
        <Text style={styles.carouselPrice}>R$ {product.price.toFixed(0)}</Text>
        {product.stock <= 3 && (
          <View style={styles.carouselLowStock}>
            <Text style={styles.carouselLowStockText}>⚠️ {product.stock}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Live Screen ─────────────────────────────────────────────────────────
export default function LiveScreen() {
  useKeepAwake();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { activeLive, currentUser } = useApp();
  const insets = useSafeAreaInsets();

  // Find the live session
  const live: LiveSession | undefined = activeLive ??
    MOCK_LIVES.find(l => l.id === id);

  const [featuredProductId, setFeaturedProductId] = useState(
    live?.featuredProductId ?? live?.products[0]?.id ?? ''
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [viewerCount, setViewerCount] = useState(live?.viewerCount ?? 0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [stockAlerts, setStockAlerts] = useState<{ id: string; productName: string; stock: number }[]>([]);
  const [productStocks, setProductStocks] = useState<Record<string, number>>(
    Object.fromEntries((live?.products ?? []).map(p => [p.id, p.stock]))
  );
  const [showChat, setShowChat] = useState(!IS_SMALL_SCREEN);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const chatRef = useRef<ScrollView>(null);
  const reactionIdRef = useRef(0);

  const featuredProduct = live?.products.find(p => p.id === featuredProductId);

  // ── Simulated real-time events ──────────────────────────────────────────────
  useEffect(() => {
    if (!live) return;

    // Viewer count fluctuation
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => Math.max(1, prev + Math.floor(Math.random() * 20) - 8));
    }, 4000);

    // Incoming chat messages
    const chatMessages2 = [
      { userName: 'Beatriz C.', text: 'Que produto incrível! 🤩', type: 'message' as const },
      { userName: 'Lucas M.', text: 'Tem parcelamento?', type: 'message' as const },
      { userName: 'Camila R.', text: 'Comprei! Chegou rapidinho da última vez 🚀', type: 'purchase' as const },
      { userName: 'Thiago P.', text: '❤️❤️❤️', type: 'message' as const },
      { userName: 'Mariana S.', text: 'Entrou na live! 👋', type: 'join' as const },
      { userName: 'Felipe A.', text: 'Qual o prazo de entrega?', type: 'message' as const },
      { userName: 'Renata K.', text: 'Esse preço é real?? 😱', type: 'message' as const },
    ];
    let msgIdx = 0;
    const chatInterval = setInterval(() => {
      const msg = chatMessages2[msgIdx % chatMessages2.length];
      setChatMessages(prev => [...prev.slice(-20), {
        id: `msg-rt-${Date.now()}`,
        userId: `u-rt-${msgIdx}`,
        ...msg,
        timestamp: new Date(),
      }]);
      msgIdx++;
      setTimeout(() => chatRef.current?.scrollToEnd({ animated: true }), 100);
    }, 3500);

    // Stock alerts
    const stockInterval = setInterval(() => {
      if (!live.products.length) return;
      const product = live.products[Math.floor(Math.random() * live.products.length)];
      setProductStocks(prev => {
        const current = prev[product.id] ?? product.stock;
        if (current <= 1) return prev;
        const newStock = current - 1;
        if (newStock <= 3) {
          setStockAlerts(alerts => [
            ...alerts.slice(-2),
            { id: `alert-${Date.now()}`, productName: product.name, stock: newStock }
          ]);
        }
        return { ...prev, [product.id]: newStock };
      });
    }, 8000);

    // Auto-rotate featured product
    let productIdx = 0;
    const rotateInterval = setInterval(() => {
      if (live.products.length > 1) {
        productIdx = (productIdx + 1) % live.products.length;
        setFeaturedProductId(live.products[productIdx].id);
      }
    }, 15000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
      clearInterval(stockInterval);
      clearInterval(rotateInterval);
    };
  }, [live]);

  const handleReaction = useCallback((emoji: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const id = reactionIdRef.current++;
    setReactions(prev => [...prev, {
      id: `r-${id}`,
      emoji,
      x: 20 + Math.random() * (width - 80),
    }]);
  }, []);

  const handleBuyNow = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCheckout(true);
  }, []);

  const handleDismissAlert = useCallback((alertId: string) => {
    setStockAlerts(prev => prev.filter(a => a.id !== alertId));
  }, []);

  const handleToggleChat = useCallback(() => {
    setShowChat(prev => !prev);
  }, []);

  const handleToggleOverlay = useCallback(() => {
    setOverlayVisible(prev => !prev);
  }, []);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!live) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Live não encontrada</Text>
        <TouchableOpacity onPress={handleGoBack} style={styles.errorBtn}>
          <Text style={styles.errorBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStock = featuredProduct ? (productStocks[featuredProduct.id] ?? featuredProduct.stock) : 0;
  const stockPct = featuredProduct ? currentStock / featuredProduct.maxStock : 0;

  return (
    <View style={styles.container}>
      <RNStatusBar hidden />

      {/* Layer 1: Jitsi WebView */}
      <View style={StyleSheet.absoluteFillObject}>
        <JitsiWebView
          roomName={live.roomName}
          displayName={currentUser?.name ?? 'Visitante'}
        />
      </View>

      {/* Layer 2: Overlay UI */}
      {overlayVisible && (
        <View style={[StyleSheet.absoluteFillObject, styles.overlay]} pointerEvents="box-none">

          {/* Stock Alerts - Top Left */}
          <View style={[styles.alertsContainer, { top: insets.top + 60 }]} pointerEvents="box-none">
            {stockAlerts.map(alert => (
              <StockAlertToast
                key={alert.id}
                productName={alert.productName}
                stock={alert.stock}
                onDismiss={() => handleDismissAlert(alert.id)}
              />
            ))}
          </View>

          {/* Top Bar */}
          <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
            <LiveBadgeAnimated count={viewerCount} />
            <View style={styles.topActions}>
              <TouchableOpacity
                style={styles.topActionBtn}
                onPress={handleToggleChat}
                activeOpacity={0.7}
              >
                <IconSymbol name="paperplane.fill" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.topActionBtn}
                onPress={handleToggleOverlay}
                activeOpacity={0.7}
              >
                <IconSymbol name="xmark" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chat (left side, responsive) */}
          {showChat && (
            <View style={[styles.chatContainer, { bottom: IS_SMALL_SCREEN ? 240 : 280 }]} pointerEvents="box-none">
              <ScrollView
                ref={chatRef}
                style={styles.chatScroll}
                showsVerticalScrollIndicator={false}
                pointerEvents="none"
              >
                {chatMessages.slice(-12).map(msg => (
                  <ChatBubble key={msg.id} msg={msg} />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Floating Reactions */}
          <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
            {reactions.map(r => (
              <FloatingReaction
                key={r.id}
                reaction={r}
                onDone={() => setReactions(prev => prev.filter(x => x.id !== r.id))}
              />
            ))}
          </View>

          {/* Reaction Buttons - Right side, responsive */}
          <View style={[styles.reactionBar, { bottom: IS_SMALL_SCREEN ? 240 : 280 }]}>
            {EMOJIS.map(emoji => (
              <TouchableOpacity
                key={emoji}
                style={styles.reactionBtn}
                onPress={() => handleReaction(emoji)}
                activeOpacity={0.7}
              >
                <Text style={styles.reactionEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom Panel */}
          <View style={[styles.bottomPanel, { paddingBottom: insets.bottom + 8 }]}>
            {/* Product Carousel */}
            <FlatList
              horizontal
              data={live.products}
              keyExtractor={p => p.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContent}
              scrollEnabled={live.products.length > 3}
              renderItem={({ item }) => (
                <ProductCarouselItem
                  product={item}
                  isActive={item.id === featuredProductId}
                  onPress={() => setFeaturedProductId(item.id)}
                />
              )}
            />

            {/* Featured Product Card */}
            {featuredProduct && (
              <View style={styles.featuredCard}>
                <Image
                  source={{ uri: featuredProduct.image }}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredInfo}>
                  <View style={styles.featuredBadgeRow}>
                    <View style={styles.featuredBadge}>
                      <IconSymbol name="sparkles" size={10} color="#fff" />
                      <Text style={styles.featuredBadgeText}>EM DESTAQUE</Text>
                    </View>
                    {featuredProduct.discount && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{featuredProduct.discount}%</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.featuredName} numberOfLines={1}>
                    {featuredProduct.name}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.featuredPrice}>
                      R$ {featuredProduct.price.toFixed(2).replace('.', ',')}
                    </Text>
                    {featuredProduct.originalPrice && (
                      <Text style={styles.originalPrice}>
                        R$ {featuredProduct.originalPrice.toFixed(2).replace('.', ',')}
                      </Text>
                    )}
                  </View>

                  {/* Stock Bar */}
                  <View style={styles.stockRow}>
                    <View style={styles.stockBarBg}>
                      <View style={[
                        styles.stockBarFill,
                        {
                          width: `${stockPct * 100}%` as any,
                          backgroundColor: stockPct < 0.2 ? '#EF4444' : stockPct < 0.5 ? '#F59E0B' : '#22C55E',
                        }
                      ]} />
                    </View>
                    <Text style={[styles.stockText, currentStock <= 3 && styles.stockTextLow]}>
                      {currentStock <= 3 ? `⚠️ ${currentStock}!` : `${currentStock}`}
                    </Text>
                  </View>
                </View>

                {/* Buy Button */}
                <TouchableOpacity
                  style={styles.buyBtn}
                  onPress={handleBuyNow}
                  activeOpacity={0.85}
                >
                  <IconSymbol name="bolt.fill" size={16} color="#fff" />
                  <Text style={styles.buyBtnText}>COMPRAR</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Show overlay button when hidden */}
      {!overlayVisible && (
        <TouchableOpacity
          style={[styles.showOverlayBtn, { top: insets.top + 8 }]}
          onPress={handleToggleOverlay}
          activeOpacity={0.8}
        >
          <IconSymbol name="tag.fill" size={16} color="#fff" />
          <Text style={styles.showOverlayText}>Ver produtos</Text>
        </TouchableOpacity>
      )}

      {/* Checkout Modal */}
      {showCheckout && featuredProduct && currentUser && (
        <CheckoutModal
          product={featuredProduct}
          live={live}
          user={currentUser}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </View>
  );
}

// ─── Live Badge Animated ──────────────────────────────────────────────────────
function LiveBadgeAnimated({ count }: { count: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={styles.liveBadgeContainer}>
      <Animated.View style={[styles.liveDot, { transform: [{ scale: pulse }] }]} />
      <Text style={styles.liveBadgeText}>AO VIVO</Text>
      <View style={styles.viewerBadge}>
        <IconSymbol name="eye.fill" size={10} color="#fff" />
        <Text style={styles.viewerCount}>
          {count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  webview: { flex: 1 },
  webviewLoading: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center', gap: 12,
  },
  webviewLoadingText: { color: '#9BA1A6', fontSize: 16 },
  jitsiPlaceholder: {
    flex: 1, backgroundColor: '#0D0D0D',
    justifyContent: 'center', alignItems: 'center',
  },
  jitsiPlaceholderInner: { alignItems: 'center', gap: 12 },
  jitsiPlaceholderTitle: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  jitsiPlaceholderSub: { fontSize: 14, color: '#E63946', fontWeight: '600' },
  jitsiPlaceholderNote: { fontSize: 13, color: '#9BA1A6', textAlign: 'center', maxWidth: 260, lineHeight: 20 },
  overlay: { pointerEvents: 'box-none', zIndex: 50 },
  alertsContainer: {
    position: 'absolute', left: 0, right: 0, zIndex: 100,
    paddingHorizontal: 12, gap: 6,
  },
  topBar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 12, zIndex: 30, paddingVertical: 4,
  },
  liveBadgeContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#E63946', paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  viewerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10,
  },
  viewerCount: { color: '#fff', fontSize: 10, fontWeight: '700' },
  topActions: { flexDirection: 'row', gap: 8 },
  topActionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  chatContainer: {
    position: 'absolute', left: 0, width: width * 0.65,
    maxHeight: 200, paddingLeft: 12, zIndex: 20,
  },
  chatScroll: { flex: 1 },
  chatBubble: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 6, marginBottom: 4,
    alignSelf: 'flex-start', maxWidth: '95%',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  chatBubblePurchase: { backgroundColor: 'rgba(34,197,94,0.25)', borderWidth: 1.5, borderColor: 'rgba(34,197,94,0.5)' },
  chatPurchaseIcon: { fontSize: 12 },
  chatJoinIcon: { fontSize: 12 },
  chatUser: { fontSize: 11, color: '#E63946', fontWeight: '700' },
  chatText: { fontSize: 11, color: '#FFFFFF', lineHeight: 15 },
  floatingEmoji: {
    position: 'absolute', bottom: 260, fontSize: 28, zIndex: 15,
  },
  reactionBar: {
    position: 'absolute', right: 8,
    flexDirection: 'column', gap: 4, zIndex: 20,
  },
  reactionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  reactionEmoji: { fontSize: 18 },
  bottomPanel: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(13,13,13,0.95)',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingTop: 12, zIndex: 40,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  carouselContent: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  carouselItem: {
    width: 68, height: 68, borderRadius: 12, overflow: 'hidden',
    borderWidth: 2, borderColor: '#2A2A2A',
  },
  carouselItemActive: { borderColor: '#E63946', borderWidth: 3 },
  carouselImage: { width: '100%', height: '100%' },
  carouselActiveDot: {
    position: 'absolute', bottom: 4, left: '50%', marginLeft: -3,
    width: 6, height: 6, borderRadius: 3, backgroundColor: '#E63946',
  },
  carouselInfo: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 4,
  },
  carouselPrice: { fontSize: 9, color: '#fff', fontWeight: '800', textAlign: 'center' },
  carouselLowStock: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#EF4444', borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2,
  },
  carouselLowStockText: { fontSize: 8, color: '#fff', fontWeight: '800' },
  featuredCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 12, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  featuredImage: { width: 76, height: 76, borderRadius: 12 },
  featuredInfo: { flex: 1, gap: 4 },
  featuredBadgeRow: { flexDirection: 'row', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  featuredBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E63946', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6,
  },
  featuredBadgeText: { fontSize: 8, color: '#fff', fontWeight: '800', letterSpacing: 0.5 },
  discountBadge: {
    backgroundColor: 'rgba(34,197,94,0.2)', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1, borderColor: '#22C55E',
  },
  discountText: { fontSize: 9, color: '#22C55E', fontWeight: '800' },
  featuredName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  featuredPrice: { fontSize: 17, fontWeight: '900', color: '#22C55E' },
  originalPrice: { fontSize: 11, color: '#555', textDecorationLine: 'line-through' },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stockBarBg: { flex: 1, height: 4, backgroundColor: '#2A2A2A', borderRadius: 2 },
  stockBarFill: { height: 4, borderRadius: 2 },
  stockText: { fontSize: 9, color: '#9BA1A6', fontWeight: '600', minWidth: 35 },
  stockTextLow: { color: '#EF4444', fontWeight: '800' },
  buyBtn: {
    backgroundColor: '#E63946', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', gap: 4,
    shadowColor: '#E63946', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.5, shadowRadius: 8,
    elevation: 8, minHeight: 50,
  },
  buyBtnText: { color: '#fff', fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  showOverlayBtn: {
    position: 'absolute', right: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: 'rgba(230,57,70,0.95)', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 24, zIndex: 35,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
  },
  showOverlayText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  errorContainer: { flex: 1, backgroundColor: '#0D0D0D', justifyContent: 'center', alignItems: 'center', gap: 16 },
  errorText: { fontSize: 18, color: '#FFFFFF', fontWeight: '700' },
  errorBtn: { backgroundColor: '#E63946', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  errorBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
