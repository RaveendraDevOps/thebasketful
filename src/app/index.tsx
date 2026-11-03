import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, Redirect } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui';
import { useAppStore } from '@/store/AppStore';
import { useAuthStore } from '@/store/AuthStore';
import { colors, radius, spacing } from '@/theme';
import { CustomerMode } from '@/types';

export default function WelcomeScreen() {
  const { hasOnboarded, completeOnboarding } = useAppStore();
  const { configured, user } = useAuthStore();
  const [mode, setMode] = useState<CustomerMode>('household');
  if (configured && !user) return <Redirect href={'/auth' as Href} />;
  if (hasOnboarded) return <Redirect href="/(tabs)" />;

  return (
    <LinearGradient colors={['#E4F5E9', '#F8F9F4', '#FFF3D8']} style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}><Ionicons name="basket" size={42} color="#FFF" /></View>
        <Text style={styles.brand}>basketful</Text>
        <Text style={styles.tagline}>Farm-fresh goodness,{'\n'}delivered to your door.</Text>
        <Text style={styles.copy}>Direct from trusted farms. Fair prices. Reliable delivery.</Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.question}>How will you shop today?</Text>
        <View style={styles.options}>
          <ModeCard active={mode === 'household'} icon="home-outline" title="For my home" subtitle="Everyday packs & easy ordering" onPress={() => setMode('household')} />
          <ModeCard active={mode === 'business'} icon="storefront-outline" title="For my business" subtitle="Wholesale rates & bulk packs" onPress={() => setMode('business')} />
        </View>
        <AppButton title="Start shopping" onPress={() => completeOnboarding(mode)} />
        <Text style={styles.note}>You can switch shopping modes anytime.</Text>
      </View>
    </LinearGradient>
  );
}

function ModeCard({ active, icon, title, subtitle, onPress }: { active: boolean; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="radio" accessibilityState={{ checked: active }} onPress={onPress} style={[styles.mode, active && styles.modeActive]}>
      <View style={[styles.modeIcon, active && styles.modeIconActive]}><Ionicons name={icon} size={25} color={active ? '#FFF' : colors.primary} /></View>
      <View style={styles.modeCopy}><Text style={styles.modeTitle}>{title}</Text><Text style={styles.modeSubtitle}>{subtitle}</Text></View>
      <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? colors.primary : colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: 76, paddingBottom: spacing.xl },
  hero: { flex: 1, alignItems: 'center' },
  logo: { width: 78, height: 78, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-5deg' }] },
  brand: { fontSize: 39, fontWeight: '900', color: colors.primaryDark, letterSpacing: -1.5, marginTop: spacing.lg },
  tagline: { textAlign: 'center', fontSize: 27, lineHeight: 34, fontWeight: '900', color: colors.text, marginTop: spacing.xl },
  copy: { color: colors.muted, textAlign: 'center', lineHeight: 21, marginTop: spacing.md, maxWidth: 310 },
  panel: { backgroundColor: 'rgba(255,255,255,.88)', padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: '#FFF' },
  question: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  options: { gap: spacing.sm, marginBottom: spacing.lg },
  mode: { minHeight: 72, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, backgroundColor: '#FFF' },
  modeActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  modeIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  modeIconActive: { backgroundColor: colors.primary },
  modeCopy: { flex: 1, marginLeft: spacing.md },
  modeTitle: { color: colors.text, fontWeight: '800', fontSize: 15 },
  modeSubtitle: { color: colors.muted, fontSize: 11, marginTop: 3 },
  note: { textAlign: 'center', color: colors.muted, fontSize: 11, marginTop: spacing.md },
});
