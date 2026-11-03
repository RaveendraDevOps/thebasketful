import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppStore } from '@/store/AppStore';
import { useAuthStore } from '@/store/AuthStore';
import { colors, radius, spacing } from '@/theme';
import { CustomerMode } from '@/types';

export default function AccountScreen() {
  const { mode, setMode } = useAppStore();
  const { configured, user, signOut } = useAuthStore();
  const displayName = user?.user_metadata?.full_name || (configured ? 'Basketful customer' : 'Raveendra Bandi');
  const displayPhone = user?.phone || '+91 98••• ••210';
  const initials = displayName.split(' ').map((part: string) => part[0]).join('').slice(0, 2).toUpperCase();
  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>MY BASKETFUL</Text>
      <Text style={styles.title}>Account</Text>
      <View style={styles.profile}><View style={styles.avatar}><Text style={styles.initial}>{initials}</Text></View><View style={styles.profileCopy}><Text style={styles.name}>{displayName}</Text><Text style={styles.phone}>{displayPhone}</Text></View><Ionicons name="create-outline" size={20} color={colors.primary} /></View>
      <Text style={styles.sectionLabel}>SHOPPING MODE</Text>
      <View style={styles.modeRow}><ModeButton mode="household" current={mode} icon="home-outline" title="Household" onPress={setMode} /><ModeButton mode="business" current={mode} icon="storefront-outline" title="Business" onPress={setMode} /></View>
      <Text style={styles.sectionLabel}>YOUR DETAILS</Text>
      <View style={styles.menu}>
        <MenuItem icon="location-outline" title="Saved addresses" onPress={() => configured && router.push('/address/new' as never)} />
        <MenuItem icon="heart-outline" title="Saved items" onPress={() => router.push('/favorites')} />
        <MenuItem icon="receipt-outline" title="Your orders" onPress={() => router.push('/(tabs)/orders')} />
        <MenuItem icon="notifications-outline" title="Notifications" />
      </View>
      <Text style={styles.sectionLabel}>SUPPORT</Text>
      <View style={styles.menu}><MenuItem icon="help-circle-outline" title="Help centre" /><MenuItem icon="chatbubble-ellipses-outline" title="Chat with us" /><MenuItem icon="document-text-outline" title="Terms & privacy" /></View>
      {configured && user && <Pressable onPress={() => signOut()} style={styles.signOut}><Ionicons name="log-out-outline" size={19} color={colors.danger} /><Text style={styles.signOutText}>Sign out</Text></Pressable>}
      <Text style={styles.version}>Basketful MVP · Version 1.0.0</Text>
    </ScrollView>
  );
}

function ModeButton({ mode, current, icon, title, onPress }: { mode: CustomerMode; current: CustomerMode; icon: keyof typeof Ionicons.glyphMap; title: string; onPress: (mode: CustomerMode) => void }) {
  const active = current === mode;
  return <Pressable onPress={() => onPress(mode)} style={[styles.modeButton, active && styles.modeActive]}><Ionicons name={icon} size={23} color={active ? colors.primary : colors.muted} /><Text style={[styles.modeText, active && styles.modeTextActive]}>{title}</Text>{active && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}</Pressable>;
}

function MenuItem({ icon, title, onPress }: { icon: keyof typeof Ionicons.glyphMap; title: string; onPress?: () => void }) {
  return <Pressable onPress={onPress} style={styles.menuItem}><View style={styles.menuIcon}><Ionicons name={icon} size={21} color={colors.primary} /></View><Text style={styles.menuText}>{title}</Text><Ionicons name="chevron-forward" size={18} color={colors.muted} /></Pressable>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 38, paddingBottom: spacing.xxl },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  profile: { minHeight: 92, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primaryDark, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  avatar: { width: 55, height: 55, borderRadius: 28, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  initial: { color: colors.primaryDark, fontWeight: '900', fontSize: 18 },
  profileCopy: { flex: 1, marginLeft: spacing.md },
  name: { color: '#FFF', fontWeight: '900', fontSize: 17 },
  phone: { color: '#C6DDCE', fontSize: 11, marginTop: 4 },
  sectionLabel: { color: colors.muted, fontSize: 10, fontWeight: '900', letterSpacing: 1.3, marginTop: spacing.xl, marginBottom: spacing.sm },
  modeRow: { flexDirection: 'row', gap: spacing.sm },
  modeButton: { flex: 1, height: 58, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  modeActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  modeText: { color: colors.muted, fontWeight: '800', fontSize: 12 },
  modeTextActive: { color: colors.primaryDark },
  menu: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  menuItem: { minHeight: 62, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 13, marginLeft: spacing.md },
  signOut: { height: 52, marginTop: spacing.xl, borderWidth: 1, borderColor: colors.danger, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  signOutText: { color: colors.danger, fontWeight: '800' },
  version: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: spacing.xl },
});
