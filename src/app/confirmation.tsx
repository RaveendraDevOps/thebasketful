import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AppButton } from '@/components/ui';
import { colors, radius, spacing } from '@/theme';

export default function ConfirmationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.ring}><View style={styles.check}><Ionicons name="checkmark" size={42} color="#FFF" /></View></View>
        <Text style={styles.title}>Order confirmed!</Text>
        <Text style={styles.message}>Thanks for choosing Basketful. We’re preparing your fresh picks now.</Text>
        <View style={styles.orderCard}><Text style={styles.label}>ORDER NUMBER</Text><Text style={styles.orderId}>{id}</Text><View style={styles.divider} /><View style={styles.status}><Ionicons name="time-outline" size={20} color={colors.primary} /><Text style={styles.statusText}>We’ll notify you when your order is packed.</Text></View></View>
      </View>
      <View style={styles.actions}><AppButton title="Track order" onPress={() => router.replace({ pathname: '/order/[id]', params: { id: id ?? '' } })} /><View style={styles.spacer} /><AppButton title="Continue shopping" variant="secondary" onPress={() => router.replace('/(tabs)')} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, padding: spacing.xl },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  check: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 29, fontWeight: '900', marginTop: spacing.xl },
  message: { color: colors.muted, textAlign: 'center', lineHeight: 22, marginTop: spacing.sm, maxWidth: 320 },
  orderCard: { width: '100%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, alignItems: 'center', marginTop: spacing.xxl, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.muted, fontSize: 10, letterSpacing: 1.3, fontWeight: '800' },
  orderId: { color: colors.text, fontSize: 23, fontWeight: '900', marginTop: 5 },
  divider: { height: 1, width: '100%', backgroundColor: colors.border, marginVertical: spacing.lg },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusText: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  actions: { paddingBottom: spacing.sm },
  spacer: { height: spacing.md },
});
