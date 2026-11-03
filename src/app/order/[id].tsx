import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader, Surface } from '@/components/ui';
import { useAppStore } from '@/store/AppStore';
import { useAuthStore } from '@/store/AuthStore';
import { getOrder } from '@/services/commerce';
import { colors, spacing } from '@/theme';
import { Order, OrderStatus } from '@/types';

const steps: { status: OrderStatus; icon: keyof typeof Ionicons.glyphMap }[] = [
  { status: 'Confirmed', icon: 'checkmark-circle-outline' },
  { status: 'Packed', icon: 'cube-outline' },
  { status: 'Out for delivery', icon: 'bicycle-outline' },
  { status: 'Delivered', icon: 'home-outline' },
];

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders } = useAppStore();
  const { configured } = useAuthStore();
  const [remoteOrder, setRemoteOrder] = useState<Order | null>(null);
  useEffect(() => {
    if (configured && id) getOrder(id).then(setRemoteOrder).catch(() => setRemoteOrder(null));
  }, [configured, id]);
  const order = configured ? remoteOrder : orders.find((item) => item.id === id);
  if (!order) return <View style={styles.page}><ScreenHeader title="Order" /><View style={styles.center}><Text>Order not found.</Text></View></View>;
  const currentIndex = steps.findIndex((step) => step.status === order.status);
  return (
    <View style={styles.page}>
      <ScreenHeader title={`Order #${order.id}`} />
      <ScrollView contentContainerStyle={styles.content}>
        <Surface>
          <Text style={styles.arriving}>{order.status === 'Delivered' ? 'Delivered' : order.status === 'Cancelled' || order.status === 'Payment failed' ? order.status : 'Arriving in your selected slot'}</Text>
          <Text style={styles.slot}>{order.slot}</Text>
          <View style={styles.timeline}>
            {steps.map((step, index) => {
              const done = index <= currentIndex;
              return <View key={step.status} style={styles.step}><View style={styles.markerCol}><View style={[styles.marker, done && styles.markerDone]}><Ionicons name={step.icon} size={18} color={done ? '#FFF' : colors.muted} /></View>{index < steps.length - 1 && <View style={[styles.line, index < currentIndex && styles.lineDone]} />}</View><View style={styles.stepCopy}><Text style={[styles.stepTitle, done && styles.stepTitleDone]}>{step.status}</Text><Text style={styles.stepSub}>{done ? 'Completed' : 'Waiting for update'}</Text></View></View>;
            })}
          </View>
        </Surface>
        <Surface>
          <Text style={styles.heading}>Order summary</Text>
          <Info label="Ordered on" value={order.date} />
          <Info label="Items" value={`${order.itemCount}`} />
          <Info label="Amount paid" value={`₹${order.total}`} />
        </Surface>
        <Surface>
          <Text style={styles.heading}>Delivery address</Text>
          <Text style={styles.address}>{order.address}</Text>
        </Surface>
      </ScrollView>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  arriving: { color: colors.primary, fontWeight: '800', fontSize: 12 },
  slot: { color: colors.text, fontWeight: '900', fontSize: 20, marginTop: 4, marginBottom: spacing.xl },
  timeline: { marginTop: spacing.sm },
  step: { minHeight: 70, flexDirection: 'row' },
  markerCol: { width: 38, alignItems: 'center' },
  marker: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  markerDone: { backgroundColor: colors.primary },
  line: { width: 2, flex: 1, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.primary },
  stepCopy: { paddingLeft: spacing.md, paddingTop: 5 },
  stepTitle: { color: colors.muted, fontWeight: '800' },
  stepTitleDone: { color: colors.text },
  stepSub: { color: colors.muted, fontSize: 10, marginTop: 4 },
  heading: { color: colors.text, fontWeight: '900', fontSize: 17, marginBottom: spacing.md },
  info: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7 },
  infoLabel: { color: colors.muted, fontSize: 13 },
  infoValue: { color: colors.text, fontWeight: '800', fontSize: 13 },
  address: { color: colors.muted, lineHeight: 21 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
