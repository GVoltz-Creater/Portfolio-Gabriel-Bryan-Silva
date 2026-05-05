import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import { ScreenContainer } from '@/components/screen-container';
import { useApp } from '@/context/AppContext';
import { MOCK_SELLERS, DEFAULT_BUYER } from '@/data/mock';
import { UserRole } from '@/types';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { setCurrentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('buyer');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'role' | 'name'>('role');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Pulse animation for live badge
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRole(role);
    if (role === 'buyer') setName(DEFAULT_BUYER.name);
    else setName(MOCK_SELLERS[0].name);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (step === 'role') {
      setStep('name');
      return;
    }
    if (!name.trim()) return;

    if (selectedRole === 'buyer') {
      setCurrentUser({ ...DEFAULT_BUYER, name: name.trim() });
    } else {
      setCurrentUser({ ...MOCK_SELLERS[0], name: name.trim() });
    }
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0000', '#0D0D0D', '#0D0D0D']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Background decorative circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />

      <ScreenContainer containerClassName="bg-transparent" className="px-6 justify-center">
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Logo area */}
          <View style={styles.logoArea}>
            <Animated.View style={[styles.liveBadge, { transform: [{ scale: pulseAnim }] }]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>AO VIVO</Text>
            </Animated.View>
            <Text style={styles.appName}>Call in Buy</Text>
            <Text style={styles.tagline}>Compre ao vivo, sem pausar</Text>
          </View>

          {step === 'role' ? (
            <>
              <Text style={styles.sectionTitle}>Como você quer entrar?</Text>

              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'buyer' && styles.roleCardActive]}
                  onPress={() => handleRoleSelect('buyer')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>🛍️</Text>
                  <Text style={[styles.roleLabel, selectedRole === 'buyer' && styles.roleLabelActive]}>Comprador</Text>
                  <Text style={styles.roleDesc}>Assista lives e compre</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleCard, selectedRole === 'seller' && styles.roleCardActive]}
                  onPress={() => handleRoleSelect('seller')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roleEmoji}>📡</Text>
                  <Text style={[styles.roleLabel, selectedRole === 'seller' && styles.roleLabelActive]}>Vendedor</Text>
                  <Text style={styles.roleDesc}>Transmita e venda</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Como quer ser chamado?</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome ou apelido"
                placeholderTextColor="#555"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.ctaButton, (!name.trim() && step === 'name') && styles.ctaDisabled]}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={['#E63946', '#c0392b']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.ctaText}>
                {step === 'role' ? 'Continuar' : 'Entrar na Call in Buy →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Ao entrar, você concorda com os Termos de Uso e Política de Privacidade.
          </Text>
        </Animated.View>
      </ScreenContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D' },
  content: { alignItems: 'center', gap: 24 },
  decorCircle1: {
    position: 'absolute', top: -100, right: -80,
    width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(230,57,70,0.08)',
  },
  decorCircle2: {
    position: 'absolute', bottom: 100, left: -120,
    width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(230,57,70,0.05)',
  },
  logoArea: { alignItems: 'center', gap: 8, marginBottom: 8 },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#E63946', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff' },
  liveText: { color: '#fff', fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  appName: { fontSize: 48, fontWeight: '900', color: '#FFFFFF', letterSpacing: -1 },
  tagline: { fontSize: 15, color: '#9BA1A6', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', alignSelf: 'flex-start' },
  roleRow: { flexDirection: 'row', gap: 12, width: '100%' },
  roleCard: {
    flex: 1, backgroundColor: '#1A1A1A', borderRadius: 16,
    padding: 20, alignItems: 'center', gap: 6,
    borderWidth: 2, borderColor: '#2A2A2A',
  },
  roleCardActive: { borderColor: '#E63946', backgroundColor: 'rgba(230,57,70,0.08)' },
  roleEmoji: { fontSize: 32 },
  roleLabel: { fontSize: 16, fontWeight: '700', color: '#9BA1A6' },
  roleLabelActive: { color: '#E63946' },
  roleDesc: { fontSize: 12, color: '#555', textAlign: 'center' },
  input: {
    width: '100%', backgroundColor: '#1A1A1A',
    borderRadius: 12, padding: 16, fontSize: 16,
    color: '#FFFFFF', borderWidth: 1, borderColor: '#2A2A2A',
  },
  ctaButton: { width: '100%', borderRadius: 14, overflow: 'hidden' },
  ctaDisabled: { opacity: 0.5 },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaText: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  disclaimer: { fontSize: 11, color: '#444', textAlign: 'center', lineHeight: 16 },
});
