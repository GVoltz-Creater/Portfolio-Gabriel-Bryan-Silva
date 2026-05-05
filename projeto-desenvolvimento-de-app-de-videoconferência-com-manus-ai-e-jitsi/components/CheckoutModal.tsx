import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  Animated, Dimensions, Modal
} from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import { Product, LiveSession, User, Order } from '@/types';
import * as Haptics from 'expo-haptics';

const { height } = Dimensions.get('window');

interface CheckoutModalProps {
  product: Product;
  live: LiveSession;
  user: User;
  onClose: () => void;
}

type CheckoutStep = 'confirm' | 'processing' | 'success';

export default function CheckoutModal({ product, live, user, onClose }: CheckoutModalProps) {
  const { addOrder } = useApp();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const [step, setStep] = useState<CheckoutStep>('confirm');

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 65,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 280,
      useNativeDriver: true,
    }).start(onClose);
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      const newOrder: Order = {
        id: `order-${Date.now()}`,
        product,
        liveSession: live,
        quantity: 1,
        totalPrice: product.price,
        status: 'confirmed',
        createdAt: new Date(),
        address: user.savedAddress ?? {
          street: 'Endereço não configurado', city: '', state: '', zip: '',
        },
        paymentMethod: user.savedPayment ?? { type: 'pix' },
      };
      addOrder(newOrder);
      setStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      Animated.spring(successScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Auto-close after success
      setTimeout(handleClose, 3000);
    }, 1800);
  };

  const paymentLabel = user.savedPayment?.type === 'pix'
    ? 'PIX'
    : `${user.savedPayment?.brand ?? 'Cartão'} •••• ${user.savedPayment?.last4 ?? '****'}`;

  return (
    <Modal transparent animationType="none" visible onRequestClose={handleClose}>
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={step === 'confirm' ? handleClose : undefined}
      />

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {step === 'confirm' && (
          <>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Confirmar Compra</Text>
              <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                <IconSymbol name="xmark" size={16} color="#9BA1A6" />
              </TouchableOpacity>
            </View>

            {/* Product Preview */}
            <View style={styles.productRow}>
              <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <Text style={styles.liveLabel}>📡 {live.title}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.productPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
                  {product.originalPrice && (
                    <Text style={styles.originalPrice}>
                      R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Delivery Info */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Entrega</Text>
              <View style={styles.infoRow}>
                <IconSymbol name="location.fill" size={14} color="#E63946" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {user.savedAddress
                    ? `${user.savedAddress.street}, ${user.savedAddress.city}`
                    : 'Endereço não configurado'}
                </Text>
              </View>
            </View>

            {/* Payment Info */}
            <View style={styles.infoSection}>
              <Text style={styles.infoSectionTitle}>Pagamento</Text>
              <View style={styles.infoRow}>
                <IconSymbol name="creditcard.fill" size={14} color="#E63946" />
                <Text style={styles.infoText}>{paymentLabel}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.85}>
              <IconSymbol name="bolt.fill" size={18} color="#fff" />
              <Text style={styles.confirmBtnText}>COMPRAR AGORA — 1 CLIQUE</Text>
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Ao confirmar, você concorda com os Termos de Compra. Pagamento seguro e criptografado.
            </Text>
          </>
        )}

        {step === 'processing' && (
          <View style={styles.processingContainer}>
            <ProcessingSpinner />
            <Text style={styles.processingTitle}>Processando pagamento...</Text>
            <Text style={styles.processingText}>Aguarde um momento</Text>
          </View>
        )}

        {step === 'success' && (
          <View style={styles.successContainer}>
            <Animated.View style={[styles.successIcon, { transform: [{ scale: successScale }] }]}>
              <IconSymbol name="checkmark.circle.fill" size={64} color="#22C55E" />
            </Animated.View>
            <Text style={styles.successTitle}>Compra Confirmada! 🎉</Text>
            <Text style={styles.successProduct} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.successPrice}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
            <Text style={styles.successNote}>
              Você receberá uma confirmação por e-mail. Continue assistindo a live!
            </Text>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
}

function ProcessingSpinner() {
  const rotation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, { toValue: 1, duration: 800, useNativeDriver: true })
    ).start();
  }, []);
  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ transform: [{ rotate }] }}>
      <IconSymbol name="arrow.counterclockwise" size={48} color="#E63946" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingBottom: 36, paddingTop: 12,
    minHeight: 400,
  },
  handle: {
    width: 36, height: 4, borderRadius: 2, backgroundColor: '#2A2A2A',
    alignSelf: 'center', marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  closeBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#2A2A2A', justifyContent: 'center', alignItems: 'center',
  },
  productRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  productImage: { width: 80, height: 80, borderRadius: 10 },
  productInfo: { flex: 1, gap: 4 },
  productName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', lineHeight: 20 },
  liveLabel: { fontSize: 11, color: '#9BA1A6' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productPrice: { fontSize: 18, fontWeight: '900', color: '#22C55E' },
  originalPrice: { fontSize: 12, color: '#555', textDecorationLine: 'line-through' },
  divider: { height: 1, backgroundColor: '#2A2A2A', marginVertical: 12 },
  infoSection: { marginBottom: 10 },
  infoSectionTitle: { fontSize: 11, color: '#9BA1A6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: '#FFFFFF', flex: 1 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#9BA1A6' },
  totalValue: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: '#E63946', borderRadius: 16, paddingVertical: 18,
    shadowColor: '#E63946', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 8, marginBottom: 12,
  },
  confirmBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },
  disclaimer: { fontSize: 11, color: '#555', textAlign: 'center', lineHeight: 16 },
  processingContainer: { alignItems: 'center', paddingVertical: 40, gap: 16 },
  processingTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  processingText: { fontSize: 14, color: '#9BA1A6' },
  successContainer: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  successIcon: { marginBottom: 8 },
  successTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  successProduct: { fontSize: 15, color: '#9BA1A6', textAlign: 'center', maxWidth: 260 },
  successPrice: { fontSize: 24, fontWeight: '900', color: '#22C55E' },
  successNote: { fontSize: 13, color: '#9BA1A6', textAlign: 'center', maxWidth: 280, lineHeight: 19 },
});
