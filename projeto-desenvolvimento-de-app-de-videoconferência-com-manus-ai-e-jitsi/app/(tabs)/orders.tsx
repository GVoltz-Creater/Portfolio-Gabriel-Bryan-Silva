import {
  View, Text, FlatList, StyleSheet, Image, TouchableOpacity
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import { Order } from '@/types';

const STATUS_CONFIG = {
  pending: { label: 'Aguardando', color: '#F59E0B', icon: 'clock.fill' as const },
  confirmed: { label: 'Confirmado', color: '#0a7ea4', icon: 'checkmark.circle.fill' as const },
  shipped: { label: 'Enviado', color: '#8B5CF6', icon: 'paperplane.fill' as const },
  delivered: { label: 'Entregue', color: '#22C55E', icon: 'checkmark.circle.fill' as const },
};

function OrderCard({ order }: { order: Order }) {
  const statusCfg = STATUS_CONFIG[order.status];
  const dateStr = order.createdAt.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <View style={styles.orderCard}>
      <Image source={{ uri: order.product.image }} style={styles.orderImage} resizeMode="cover" />
      <View style={styles.orderInfo}>
        <Text style={styles.orderProductName} numberOfLines={2}>{order.product.name}</Text>
        <Text style={styles.orderLive} numberOfLines={1}>📡 {order.liveSession.title}</Text>
        <View style={styles.orderMeta}>
          <Text style={styles.orderPrice}>R$ {order.totalPrice.toFixed(2).replace('.', ',')}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${statusCfg.color}20`, borderColor: statusCfg.color }]}>
            <IconSymbol name={statusCfg.icon} size={10} color={statusCfg.color} />
            <Text style={[styles.statusText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>{dateStr}</Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const { orders } = useApp();

  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Compras</Text>
        <Text style={styles.headerSub}>{orders.length} pedido{orders.length !== 1 ? 's' : ''}</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🛍️</Text>
            <Text style={styles.emptyTitle}>Nenhuma compra ainda</Text>
            <Text style={styles.emptyDesc}>Assista uma live e faça sua primeira compra!</Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: '#9BA1A6', marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  orderCard: {
    flexDirection: 'row', backgroundColor: '#1A1A1A',
    borderRadius: 14, overflow: 'hidden',
    marginBottom: 12, borderWidth: 1, borderColor: '#2A2A2A',
  },
  orderImage: { width: 90, height: 100 },
  orderInfo: { flex: 1, padding: 12, gap: 4 },
  orderProductName: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', lineHeight: 19 },
  orderLive: { fontSize: 11, color: '#9BA1A6' },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  orderPrice: { fontSize: 16, fontWeight: '900', color: '#22C55E' },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 1,
  },
  statusText: { fontSize: 10, fontWeight: '700' },
  orderDate: { fontSize: 11, color: '#555' },
  emptyState: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyEmoji: { fontSize: 56 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  emptyDesc: { fontSize: 14, color: '#9BA1A6', textAlign: 'center' },
});
