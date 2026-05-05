import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useApp } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';

function MenuItem({ icon, label, value, onPress }: {
  icon: any; label: string; value?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconWrap}>
        <IconSymbol name={icon} size={18} color="#E63946" />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        {value && <Text style={styles.menuValue}>{value}</Text>}
      </View>
      <IconSymbol name="chevron.right" size={16} color="#555" />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, orders, logout } = useApp();

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    logout();
    router.replace('/');
  };

  if (!currentUser) {
    return (
      <ScreenContainer containerClassName="bg-background" className="bg-background items-center justify-center">
        <Text style={styles.noUserText}>Faça login para ver seu perfil</Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.replace('/')}>
          <Text style={styles.loginBtnText}>Entrar</Text>
        </TouchableOpacity>
      </ScreenContainer>
    );
  }

  const isSeller = currentUser.role === 'seller';

  return (
    <ScreenContainer containerClassName="bg-background" className="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            <View style={[styles.roleBadge, isSeller && styles.roleBadgeSeller]}>
              <IconSymbol name={isSeller ? "video.fill" : "bag.fill"} size={10} color="#fff" />
            </View>
          </View>
          <Text style={styles.userName}>{currentUser.name}</Text>
          <View style={styles.roleChip}>
            <Text style={styles.roleChipText}>{isSeller ? '📡 Vendedor' : '🛍️ Comprador'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{orders.length}</Text>
            <Text style={styles.statLabel}>Compras</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>R$ {orders.reduce((s, o) => s + o.totalPrice, 0).toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total gasto</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{isSeller ? '3' : '12'}</Text>
            <Text style={styles.statLabel}>{isSeller ? 'Lives' : 'Assistidas'}</Text>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Conta</Text>
        <View style={styles.menuGroup}>
          <MenuItem
            icon="location.fill"
            label="Endereço de entrega"
            value={currentUser.savedAddress?.city ?? 'Não configurado'}
          />
          <MenuItem
            icon="creditcard.fill"
            label="Pagamento"
            value={currentUser.savedPayment?.type === 'pix' ? 'PIX' :
  currentUser.savedPayment?.last4 ? `${currentUser.savedPayment?.brand} •••• ${currentUser.savedPayment?.last4}` : 'Não configurado'}
          />
          <MenuItem icon="bell.fill" label="Notificações" />
        </View>

        {/* App Section */}
        <Text style={styles.sectionTitle}>App</Text>
        <View style={styles.menuGroup}>
          <MenuItem icon="gear" label="Configurações" />
          <MenuItem icon="info.circle.fill" label="Sobre o Call in Buy" value="v1.0.0" />
          <MenuItem icon="share" label="Compartilhar app" />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 100 },
  profileHeader: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: '#E63946',
  },
  roleBadge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#0a7ea4', justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#0D0D0D',
  },
  roleBadgeSeller: { backgroundColor: '#E63946' },
  userName: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  roleChip: {
    backgroundColor: 'rgba(230,57,70,0.15)', paddingHorizontal: 14, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(230,57,70,0.3)',
  },
  roleChipText: { fontSize: 13, color: '#E63946', fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', marginHorizontal: 16, marginBottom: 24,
    backgroundColor: '#1A1A1A', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#2A2A2A',
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: '#9BA1A6' },
  statDivider: { width: 1, backgroundColor: '#2A2A2A' },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: '#9BA1A6',
    paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.8,
  },
  menuGroup: {
    marginHorizontal: 16, marginBottom: 20,
    backgroundColor: '#1A1A1A', borderRadius: 14,
    borderWidth: 1, borderColor: '#2A2A2A', overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderBottomWidth: 1, borderBottomColor: '#2A2A2A',
  },
  menuIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: 'rgba(230,57,70,0.1)', justifyContent: 'center', alignItems: 'center',
  },
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
  menuValue: { fontSize: 12, color: '#9BA1A6', marginTop: 1 },
  logoutBtn: {
    marginHorizontal: 16, marginTop: 8,
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 14,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
  },
  logoutText: { fontSize: 16, color: '#EF4444', fontWeight: '700' },
  noUserText: { fontSize: 16, color: '#9BA1A6', marginBottom: 16 },
  loginBtn: {
    backgroundColor: '#E63946', paddingHorizontal: 32, paddingVertical: 12,
    borderRadius: 12,
  },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
