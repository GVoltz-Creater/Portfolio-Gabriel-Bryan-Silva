import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Image, Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import { MOCK_PRODUCTS } from '@/data/mock';
import { Product, LiveSession } from '@/types';
import * as Haptics from 'expo-haptics';

const CATEGORIES = ['Moda', 'Eletrônicos', 'Beleza', 'Casa & Decor', 'Calçados', 'Acessórios'];

export default function CreateLiveScreen() {
  const router = useRouter();
  const { currentUser, setActiveLive } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Moda');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleStartLive = () => {
    if (!title.trim()) {
      Alert.alert('Título obrigatório', 'Dê um título para sua live!');
      return;
    }
    if (selectedProducts.length === 0) {
      Alert.alert('Produtos obrigatórios', 'Selecione pelo menos 1 produto para destacar!');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const roomName = `liveshop-${currentUser?.id}-${Date.now()}`;
    const products = MOCK_PRODUCTS.filter(p => selectedProducts.includes(p.id));

    const newLive: LiveSession = {
      id: `live-new-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      seller: currentUser!,
      roomName,
      thumbnail: products[0]?.image ?? 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
      category,
      viewerCount: 0,
      status: 'live',
      startedAt: new Date(),
      products,
      featuredProductId: products[0]?.id,
    };

    setActiveLive(newLive);
    router.replace(`/live/${newLive.id}` as any);
  };

  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <IconSymbol name="xmark" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Live</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Live Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações da Live</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Título *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Liquidação de Verão — 50% OFF!"
              placeholderTextColor="#555"
              maxLength={60}
            />
            <Text style={styles.charCount}>{title.length}/60</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Conte o que vai rolar na sua live..."
              placeholderTextColor="#555"
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Categoria</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoryRow}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
                    onPress={() => { setCategory(cat); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                  >
                    <Text style={[styles.categoryText, category === cat && styles.categoryTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Product Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Produtos em Destaque</Text>
            <Text style={styles.selectedCount}>{selectedProducts.length} selecionados</Text>
          </View>
          <Text style={styles.sectionHint}>Selecione os produtos que aparecerão no overlay da live</Text>

          {MOCK_PRODUCTS.map(product => {
            const isSelected = selectedProducts.includes(product.id);
            return (
              <TouchableOpacity
                key={product.id}
                style={[styles.productRow, isSelected && styles.productRowSelected]}
                onPress={() => toggleProduct(product.id)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: product.image }} style={styles.productThumb} resizeMode="cover" />
                <View style={styles.productMeta}>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                  <Text style={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                  <Text style={[styles.productStock, product.stock <= 3 && styles.stockLow]}>
                    {product.stock <= 3 ? `⚠️ ${product.stock} restantes` : `${product.stock} em estoque`}
                  </Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                  {isSelected && <IconSymbol name="checkmark" size={14} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Start Button */}
        <TouchableOpacity
          style={[styles.startBtn, (!title.trim() || selectedProducts.length === 0) && styles.startBtnDisabled]}
          onPress={handleStartLive}
          activeOpacity={0.85}
        >
          <IconSymbol name="video.fill" size={20} color="#fff" />
          <Text style={styles.startBtnText}>Iniciar Live Agora</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#FFFFFF', marginBottom: 12 },
  sectionHint: { fontSize: 12, color: '#9BA1A6', marginBottom: 12, marginTop: -8 },
  selectedCount: {
    fontSize: 12, color: '#E63946', fontWeight: '700',
    backgroundColor: 'rgba(230,57,70,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, color: '#9BA1A6', fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 14,
    fontSize: 15, color: '#FFFFFF', borderWidth: 1, borderColor: '#2A2A2A',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: '#555', textAlign: 'right', marginTop: 4 },
  categoryRow: { flexDirection: 'row', gap: 8 },
  categoryChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#1A1A1A', borderWidth: 1, borderColor: '#2A2A2A',
  },
  categoryChipActive: { backgroundColor: '#E63946', borderColor: '#E63946' },
  categoryText: { fontSize: 13, color: '#9BA1A6', fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  productRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1A1A1A', borderRadius: 12, padding: 10,
    marginBottom: 8, borderWidth: 1.5, borderColor: '#2A2A2A',
  },
  productRowSelected: { borderColor: '#E63946', backgroundColor: 'rgba(230,57,70,0.06)' },
  productThumb: { width: 56, height: 56, borderRadius: 8 },
  productMeta: { flex: 1, gap: 2 },
  productName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  productPrice: { fontSize: 13, fontWeight: '800', color: '#22C55E' },
  productStock: { fontSize: 11, color: '#9BA1A6' },
  stockLow: { color: '#EF4444', fontWeight: '700' },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#555',
    justifyContent: 'center', alignItems: 'center',
  },
  checkboxActive: { backgroundColor: '#E63946', borderColor: '#E63946' },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#E63946', borderRadius: 16, paddingVertical: 18,
    shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 8,
  },
  startBtnDisabled: { opacity: 0.4 },
  startBtnText: { color: '#fff', fontSize: 17, fontWeight: '900' },
});
