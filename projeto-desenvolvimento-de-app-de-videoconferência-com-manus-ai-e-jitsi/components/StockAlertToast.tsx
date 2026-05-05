import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface StockAlertToastProps {
  productName: string;
  stock: number;
  onDismiss: () => void;
}

export default function StockAlertToast({ productName, stock, onDismiss }: StockAlertToastProps) {
  const translateX = useRef(new Animated.Value(-300)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -300, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start(onDismiss);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const isUrgent = stock <= 1;
  const bgColor = isUrgent ? 'rgba(239,68,68,0.95)' : 'rgba(245,158,11,0.95)';
  const icon = isUrgent ? 'exclamationmark.triangle.fill' : 'exclamationmark.triangle.fill';

  return (
    <Animated.View style={[styles.toast, { backgroundColor: bgColor, transform: [{ translateX }], opacity }]}>
      <IconSymbol name={icon} size={16} color="#fff" />
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle} numberOfLines={1}>
          {isUrgent ? '🚨 Último item!' : '⚠️ Estoque baixo!'}
        </Text>
        <Text style={styles.toastProduct} numberOfLines={1}>{productName}</Text>
        <Text style={styles.toastStock}>
          {stock <= 0 ? 'Esgotado' : `Apenas ${stock} restante${stock !== 1 ? 's' : ''}!`}
        </Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.dismissBtn}>
        <IconSymbol name="xmark" size={12} color="rgba(255,255,255,0.8)" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    marginBottom: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  toastContent: { flex: 1 },
  toastTitle: { fontSize: 12, fontWeight: '800', color: '#FFFFFF' },
  toastProduct: { fontSize: 11, color: 'rgba(255,255,255,0.85)', marginTop: 1 },
  toastStock: { fontSize: 11, color: '#FFFFFF', fontWeight: '700', marginTop: 1 },
  dismissBtn: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
});
