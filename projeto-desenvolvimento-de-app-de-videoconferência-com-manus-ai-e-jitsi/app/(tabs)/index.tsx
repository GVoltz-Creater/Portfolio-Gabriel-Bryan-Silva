import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, Dimensions, Animated
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRef, useEffect, useState, useCallback } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import { MOCK_LIVES } from '@/data/mock';
import { LiveSession } from '@/types';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const IS_SMALL_SCREEN = width < 375;
const CARD_WIDTH = width - 32;

function LiveBadge({ count }: { count: number }) {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  return (
    <View style={styles.liveBadgeRow}>
      <Animated.View style={[styles.liveDot, { transform: [{ scale: pulse }] }]} />
      <Text style={styles.liveBadgeText}>AO VIVO</Text>
      <View style={styles.viewerBadge}>
        <IconSymbol name="eye.fill" size={10} color="#fff" />
        <Text style={styles.viewerText}>{count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count}</Text>
      </View>
    </View>
  );
}

function LiveCard({ item, onPress }: { item: LiveSession; onPress: () => void }) {
  const isLive = item.status === 'live';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: item.thumbnail }} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardGradient} />

      {isLive && <LiveBadge count={item.viewerCount} />}
      {item.status === 'scheduled' && (
        <View style={styles.scheduledBadge}>
          <IconSymbol name="clock.fill" size={10} color="#F59E0B" />
          <Text style={styles.scheduledText}>Em breve</Text>
        </View>
      )}

      <View style={styles.cardInfo}>
        <View style={styles.sellerRow}>
          <Image source={{ uri: item.seller.avatar }} style={styles.sellerAvatar} />
          <Text style={styles.sellerName}>{item.seller.name}</Text>
        </View>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.productCountRow}>
          <IconSymbol name="tag.fill" size={12} color="#E63946" />
          <Text style={styles.productCount}>{item.products.length} produtos em destaque</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { currentUser, setActiveLive } = useApp();
  const [lives] = useState(MOCK_LIVES);
  const liveLives = lives.filter(l => l.status === 'live');
  const scheduledLives = lives.filter(l => l.status === 'scheduled');

  const handleLivePress = useCallback((live: LiveSession) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveLive(live);
    router.push(`/live/${live.id}` as any);
  }, [setActiveLive, router]);

  const handleStartLive = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/create-live' as any);
  }, [router]);



  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Call in Buy</Text>
          <Text style={styles.headerSub}>
            Olá, {currentUser?.name ?? 'visitante'} 👋
          </Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
          <IconSymbol name="bell.fill" size={22} color="#fff" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={[...liveLives, ...scheduledLives]}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionDot} />
              <Text style={styles.sectionTitle}>Lives Ativas</Text>
              <Text style={styles.sectionCount}>{liveLives.length}</Text>
            </View>
          </View>
        )}
        renderItem={({ item, index }) => {
          const isFirstScheduled = item.status === 'scheduled' &&
            (index === 0 || lives[index - 1]?.status === 'live');
          return (
            <>
              {isFirstScheduled && (
                <View style={[styles.sectionHeader, { marginTop: 8 }]}>
                  <View style={styles.sectionTitleRow}>
                    <IconSymbol name="clock.fill" size={14} color="#F59E0B" />
                    <Text style={[styles.sectionTitle, { color: '#F59E0B' }]}>Em Breve</Text>
                  </View>
                </View>
              )}
              <LiveCard item={item} onPress={() => handleLivePress(item)} />
            </>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📡</Text>
            <Text style={styles.emptyText}>Nenhuma live ativa agora</Text>
          </View>
        )}
      />

      {/* FAB para vendedores */}
      {currentUser?.role === 'seller' && (
        <TouchableOpacity style={styles.fab} onPress={handleStartLive} activeOpacity={0.85}>
          <IconSymbol name="video.fill" size={22} color="#fff" />
          <Text style={styles.fabText}>Iniciar Live</Text>
        </TouchableOpacity>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#0D0D0D',
  },
  headerTitle: { fontSize: IS_SMALL_SCREEN ? 22 : 24, fontWeight: '900', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: '#9BA1A6', marginTop: 2 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#E63946',
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  sectionHeader: { marginBottom: 12 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E63946' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  sectionCount: {
    fontSize: 12, color: '#E63946', backgroundColor: 'rgba(230,57,70,0.15)',
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, fontWeight: '700',
  },
  card: {
    width: CARD_WIDTH, height: IS_SMALL_SCREEN ? 180 : 220, borderRadius: 16, overflow: 'hidden',
    marginBottom: 16, backgroundColor: '#1A1A1A',
  },
  cardImage: { width: '100%', height: '100%', position: 'absolute' },
  cardGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
    backgroundColor: 'transparent',
    // gradient simulation via opacity
  },
  liveBadgeRow: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#E63946', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  viewerBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 10,
  },
  viewerText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  scheduledBadge: {
    position: 'absolute', top: 12, left: 12,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(245,158,11,0.2)', borderWidth: 1, borderColor: '#F59E0B',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  scheduledText: { color: '#F59E0B', fontSize: 10, fontWeight: '700' },
  cardInfo: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 14, backgroundColor: 'rgba(0,0,0,0.75)',
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  sellerAvatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#E63946' },
  sellerName: { fontSize: 12, color: '#ccc', fontWeight: '600' },
  cardTitle: { fontSize: IS_SMALL_SCREEN ? 13 : 15, fontWeight: '800', color: '#FFFFFF', lineHeight: 20, marginBottom: 6 },
  productCountRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  productCount: { fontSize: 11, color: '#E63946', fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#555', fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 90, right: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#E63946', paddingHorizontal: 18, paddingVertical: 12,
    borderRadius: 28, elevation: 8,
    shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    minHeight: 48,
  },
  fabText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
