import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, EmptyState, QuantityControl, ScreenHeader, Surface } from '@/components/ui';
import { products } from '@/data/catalog';
import { priceFor, useAppStore } from '@/store/AppStore';
import { colors, radius, spacing } from '@/theme';

export default function CartScreen() {
  const { cart, mode, subtotal, deliveryFee, total } = useAppStore();
  if (!cart.length) {
    return <View style={styles.page}><ScreenHeader title="Your basket" /><EmptyState icon="basket-outline" title="Your basket is empty" message="Fresh produce and great prices are waiting for you." action="Start shopping" onAction={() => router.replace('/(tabs)')} /></View>;
  }
  return (
    <View style={styles.page}>
      <ScreenHeader title={`Your basket (${cart.reduce((sum, line) => sum + line.quantity, 0)})`} />
      <ScrollView contentContainerStyle={styles.content}>
        <Surface>
          {cart.map((line, index) => {
            const product = products.find((item) => item.id === line.productId);
            if (!product) return null;
            return (
              <View key={line.productId} style={[styles.line, index > 0 && styles.lineBorder]}>
                <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
                <View style={styles.lineCopy}><Text numberOfLines={2} style={styles.name}>{product.name}</Text><Text style={styles.unit}>{mode === 'business' ? product.businessUnit : product.unit}</Text><Text style={styles.price}>₹{priceFor(product, mode) * line.quantity}</Text></View>
                <QuantityControl productId={product.id} compact />
              </View>
            );
          })}
        </Surface>
        <View style={styles.freeDelivery}>
          <Ionicons name={deliveryFee ? 'bicycle-outline' : 'checkmark-circle'} size={23} color={colors.primary} />
          <Text style={styles.freeText}>{deliveryFee ? `Add ₹${(mode === 'business' ? 1500 : 499) - subtotal} more for free delivery` : 'You unlocked free delivery!'}</Text>
        </View>
        <Surface>
          <Text style={styles.billTitle}>Bill details</Text>
          <BillRow label="Item total" value={`₹${subtotal}`} />
          <BillRow label="Delivery fee" value={deliveryFee ? `₹${deliveryFee}` : 'FREE'} highlight={!deliveryFee} />
          <View style={styles.totalDivider} />
          <BillRow label="To pay" value={`₹${total}`} total />
        </Surface>
        <View style={styles.safety}><Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} /><Text style={styles.safetyText}>Every item is quality checked before dispatch.</Text></View>
      </ScrollView>
      <View style={styles.footer}><View><Text style={styles.payLabel}>TO PAY</Text><Text style={styles.pay}>₹{total}</Text></View><View style={styles.buttonWrap}><AppButton title="Proceed to checkout" onPress={() => router.push('/checkout')} /></View></View>
    </View>
  );
}

function BillRow({ label, value, highlight, total }: { label: string; value: string; highlight?: boolean; total?: boolean }) {
  return <View style={styles.billRow}><Text style={[styles.billLabel, total && styles.billTotal]}>{label}</Text><Text style={[styles.billValue, highlight && styles.highlight, total && styles.billTotal]}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 110, gap: spacing.md },
  line: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm },
  lineBorder: { borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.sm, paddingTop: spacing.lg },
  image: { width: 68, height: 68, borderRadius: radius.md, backgroundColor: colors.background },
  lineCopy: { flex: 1, marginHorizontal: spacing.md },
  name: { fontWeight: '800', color: colors.text, fontSize: 14 },
  unit: { color: colors.muted, fontSize: 11, marginTop: 3 },
  price: { color: colors.text, fontWeight: '900', marginTop: 7 },
  freeDelivery: { minHeight: 52, backgroundColor: colors.primarySoft, borderRadius: radius.md, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 10 },
  freeText: { color: colors.primaryDark, fontWeight: '700', fontSize: 12 },
  billTitle: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  billLabel: { color: colors.muted, fontSize: 13 },
  billValue: { color: colors.text, fontWeight: '700', fontSize: 13 },
  highlight: { color: colors.success },
  totalDivider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  billTotal: { color: colors.text, fontWeight: '900', fontSize: 16 },
  safety: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: spacing.sm },
  safetyText: { flex: 1, color: colors.muted, fontSize: 11 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 82, padding: spacing.md, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center' },
  payLabel: { color: colors.muted, fontWeight: '800', fontSize: 9 },
  pay: { color: colors.text, fontWeight: '900', fontSize: 21 },
  buttonWrap: { flex: 1, marginLeft: spacing.xl },
});
