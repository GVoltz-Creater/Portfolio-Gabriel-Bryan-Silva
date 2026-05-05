import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, TextInput, Dimensions
} from 'react-native';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { MOCK_PRODUCTS } from '@/data/mock';
import { Product } from '@/types';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;

const CATEGORIES = ['Todos', 'Moda', 'Eletrônicos', 'Beleza', 'Casa & Decor', 'Calçados', 'Acessórios'];

function StockBar({ stock, maxStock }: { stock: number; maxStock: number }) {
  const pct = Math.max(0, Math.min(1, stock / maxStock));
  const color = pct < 0.2 ? '#EF4444' : pct < 0.5 ? '#F59E0B' : '#22C55E';
  return (
    <View style={styles.stockBarBg}>
      <View style={[styles.stockBarFill, { width: `${pct * 100}%` as any, backgroundColor: color }]} />
    </View>
  );
}

function ProductCard({ item }: { item: Product }) {
  const [liked, setLiked] = useState(false);
  const isLowStock = item.stock <= 3;

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.85}
      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.likeBtn}
          onPress={() => { setLiked(!liked); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
        >
          <IconSymbol name={liked ? "heart.fill" : "heart"} size={16} color={liked ? '#E63946' : '#fff'} />
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</Text>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>R$ {item.originalPrice.toFixed(2).replace('.', ',')}</Text>
          )}
        </View>

        <StockBar stock={item.stock} maxStock={item.maxStock} />
        <Text style={[styles.stockText, isLowStock && styles.stockTextLow]}>
          {isLowStock ? `⚠️ Apenas ${item.stock} restantes!` : `${item.stock} em estoque`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ExploreScreen() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'Todos' || p.category.includes(activeCategory);
    return matchSearch && matchCat;
  });

  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
        <Text style={styles.headerSub}>{MOCK_PRODUCTS.length} produtos disponíveis</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <IconSymbol name="magnifyingglass" size={18} color="#555" />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar produtos..."
          placeholderTextColor="#555"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <IconSymbol name="xmark" size={16} color="#555" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <FlatList
        horizontal
        data={CATEGORIES}
        keyExtractor={c => c}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.categoryChip, activeCategory === item && styles.categoryChipActive]}
            onPress={() => { setActiveCategory(item); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
          >
            <Text style={[styles.categoryText, activeCategory === item && styles.categoryTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Products Grid */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: '#9BA1A6', marginTop: 2 },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#1A1A1A', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#FFFFFF' },
  categoriesContent: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A',
  },
  categoryChipActive: { backgroundColor: '#E63946', borderColor: '#E63946' },
  categoryText: { fontSize: 13, color: '#9BA1A6', fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  gridContent: { paddingHorizontal: 16, paddingBottom: 100 },
  columnWrapper: { gap: 12, marginBottom: 12 },
  productCard: {
    width: CARD_W, backgroundColor: '#1A1A1A',
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  productImageContainer: { width: '100%', height: 150, position: 'relative' },
  productImage: { width: '100%', height: '100%' },
  discountBadge: {
    position: 'absolute', top: 8, left: 8,
    backgroundColor: '#E63946', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8,
  },
  discountText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  likeBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  productInfo: { padding: 10, gap: 4 },
  productCategory: { fontSize: 10, color: '#E63946', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  productName: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', lineHeight: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: '900', color: '#22C55E' },
  originalPrice: { fontSize: 11, color: '#555', textDecorationLine: 'line-through' },
  stockBarBg: { height: 3, backgroundColor: '#2A2A2A', borderRadius: 2, marginTop: 4 },
  stockBarFill: { height: 3, borderRadius: 2 },
  stockText: { fontSize: 10, color: '#9BA1A6', marginTop: 2 },
  stockTextLow: { color: '#EF4444', fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 16, color: '#555', fontWeight: '600' },
});
