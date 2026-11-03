import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, ScreenHeader, Surface } from '@/components/ui';
import { addresses, slots } from '@/data/catalog';
import { useAppStore } from '@/store/AppStore';
import { colors, radius, spacing } from '@/theme';
import { canCheckout } from '@/utils/cart';

type Payment = 'UPI' | 'Cash on delivery' | 'Card';

export default function CheckoutScreen() {
  const { cart, total, placeOrder } = useAppStore();
  const [addressId, setAddressId] = useState(addresses[0].id);
  const [slot, setSlot] = useState(slots[0]);
  const [payment, setPayment] = useState<Payment>('UPI');
  if (!cart.length) return null;
  const submit = () => {
    const address = addresses.find((item) => item.id === addressId);
    if (!address || !canCheckout(cart, address.detail, slot, payment)) return Alert.alert('Missing details', 'Select delivery and payment details.');
    const order = placeOrder(address.detail, slot);
    router.replace({ pathname: '/confirmation', params: { id: order.id } });
  };
  return (
    <View style={styles.page}>
      <ScreenHeader title="Checkout" />
      <ScrollView contentContainerStyle={styles.content}>
        <StepTitle number="1" title="Delivery address" />
        <View style={styles.stack}>
          {addresses.map((address) => <Choice key={address.id} active={addressId === address.id} icon={address.id === 'home' ? 'home-outline' : 'storefront-outline'} title={address.label} subtitle={address.detail} onPress={() => setAddressId(address.id)} />)}
        </View>
        <StepTitle number="2" title="Delivery slot" />
        <View style={styles.slotGrid}>
          {slots.map((item) => <Pressable key={item} onPress={() => setSlot(item)} style={[styles.slot, slot === item && styles.slotActive]}><Ionicons name="time-outline" size={18} color={slot === item ? colors.primary : colors.muted} /><Text style={[styles.slotText, slot === item && styles.slotTextActive]}>{item}</Text></Pressable>)}
        </View>
        <StepTitle number="3" title="Payment method" />
        <Surface style={styles.paymentBox}>
          <PaymentChoice title="UPI" subtitle="Google Pay, PhonePe, Paytm" icon="phone-portrait-outline" active={payment === 'UPI'} onPress={() => setPayment('UPI')} />
          <PaymentChoice title="Card" subtitle="Credit or debit card" icon="card-outline" active={payment === 'Card'} onPress={() => setPayment('Card')} />
          <PaymentChoice title="Cash on delivery" subtitle="Pay when your order arrives" icon="cash-outline" active={payment === 'Cash on delivery'} onPress={() => setPayment('Cash on delivery')} />
        </Surface>
        <Text style={styles.demo}>Demo checkout: no real payment will be processed.</Text>
      </ScrollView>
      <View style={styles.footer}><View><Text style={styles.payLabel}>TOTAL</Text><Text style={styles.pay}>₹{total}</Text></View><View style={styles.buttonWrap}><AppButton title={`Place order · ₹${total}`} onPress={submit} /></View></View>
    </View>
  );
}

function StepTitle({ number, title }: { number: string; title: string }) {
  return <View style={styles.stepTitle}><View style={styles.number}><Text style={styles.numberText}>{number}</Text></View><Text style={styles.stepText}>{title}</Text></View>;
}

function Choice({ active, icon, title, subtitle, onPress }: { active: boolean; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.choice, active && styles.choiceActive]}><View style={styles.choiceIcon}><Ionicons name={icon} size={22} color={colors.primary} /></View><View style={styles.choiceCopy}><Text style={styles.choiceTitle}>{title}</Text><Text style={styles.choiceSubtitle}>{subtitle}</Text></View><Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={21} color={active ? colors.primary : colors.muted} /></Pressable>;
}

function PaymentChoice({ active, icon, title, subtitle, onPress }: { active: boolean; icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={styles.payment}><Ionicons name={icon} size={24} color={colors.primary} /><View style={styles.choiceCopy}><Text style={styles.choiceTitle}>{title}</Text><Text style={styles.choiceSubtitle}>{subtitle}</Text></View><Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={21} color={active ? colors.primary : colors.muted} /></Pressable>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 110 },
  stepTitle: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, marginBottom: spacing.md },
  number: { width: 27, height: 27, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  numberText: { color: '#FFF', fontWeight: '900', fontSize: 12 },
  stepText: { color: colors.text, fontWeight: '900', fontSize: 17 },
  stack: { gap: spacing.sm, marginBottom: spacing.lg },
  choice: { minHeight: 80, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center' },
  choiceActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  choiceIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  choiceCopy: { flex: 1, marginHorizontal: spacing.md },
  choiceTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  choiceSubtitle: { color: colors.muted, fontSize: 11, marginTop: 4, lineHeight: 16 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  slot: { width: '48%', minHeight: 58, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 7 },
  slotActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  slotText: { flex: 1, color: colors.muted, fontSize: 11, fontWeight: '700' },
  slotTextActive: { color: colors.primaryDark },
  paymentBox: { paddingVertical: spacing.xs },
  payment: { minHeight: 70, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: spacing.sm },
  demo: { color: colors.muted, fontSize: 11, textAlign: 'center', marginTop: spacing.md },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, minHeight: 82, padding: spacing.md, paddingHorizontal: spacing.lg, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, flexDirection: 'row', alignItems: 'center' },
  payLabel: { color: colors.muted, fontWeight: '800', fontSize: 9 },
  pay: { color: colors.text, fontWeight: '900', fontSize: 21 },
  buttonWrap: { flex: 1, marginLeft: spacing.xl },
});
