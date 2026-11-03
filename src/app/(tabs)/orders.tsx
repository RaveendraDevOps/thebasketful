import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '@/components/ui';
import { useAppStore } from '@/store/AppStore';
import { useAuthStore } from '@/store/AuthStore';
import { listOrders } from '@/services/commerce';
import { colors, radius, spacing } from '@/theme';
import { Order } from '@/types';

export default function OrdersScreen() {
  const { orders: demoOrders } = useAppStore();
  const { configured, user } = useAuthStore();
  const [remoteOrders, setRemoteOrders] = useState<Order[]>([]);
  useEffect(() => {
    if (configured && user) listOrders().then(setRemoteOrders).catch(() => setRemoteOrders([]));
  }, [configured, user]);
  const orders = configured ? remoteOrders : demoOrders;
  return (
    <View style={styles.page}>
      <View style={styles.header}><Text style={styles.eyebrow}>YOUR PURCHASES</Text><Text style={styles.title}>Orders</Text></View>
      {orders.length ? <ScrollView contentContainerStyle={styles.content}>{orders.map((order) => <OrderCard key={order.id} order={order} />)}</ScrollView> : <EmptyState icon="receipt-outline" title="No orders yet" message="Your completed orders will appear here." />}
    </View>
  );
}

function OrderCard({ order }: { order: Order }) {
  const active = order.status !== 'Delivered';
  return (
    <Pressable onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })} style={styles.card}>
      <View style={styles.cardTop}><View><Text style={styles.id}>#{order.id}</Text><Text style={styles.date}>{order.date}</Text></View><View style={[styles.badge, active && styles.badgeActive]}><Text style={[styles.badgeText, active && styles.badgeTextActive]}>{order.status}</Text></View></View>
      <View style={styles.divider} />
      <View style={styles.cardBottom}><View><Text style={styles.items}>{order.itemCount} items</Text><Text style={styles.total}>₹{order.total}</Text></View><View style={styles.view}><Text style={styles.viewText}>{active ? 'Track order' : 'View details'}</Text><Ionicons name="chevron-forward" size={17} color={colors.primary} /></View></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingTop: 38, backgroundColor: colors.surface },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  content: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  id: { color: colors.text, fontWeight: '900', fontSize: 16 },
  date: { color: colors.muted, fontSize: 11, marginTop: 4 },
  badge: { borderRadius: radius.pill, paddingVertical: 6, paddingHorizontal: 10, backgroundColor: colors.background },
  badgeActive: { backgroundColor: colors.primarySoft },
  badgeText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  badgeTextActive: { color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  items: { color: colors.muted, fontSize: 11 },
  total: { color: colors.text, fontSize: 19, fontWeight: '900', marginTop: 3 },
  view: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewText: { color: colors.primary, fontWeight: '800', fontSize: 12 },
});
