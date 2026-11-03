import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AppButton, QuantityControl } from '@/components/ui';
import { priceFor, useAppStore } from '@/store/AppStore';
import { useCatalogStore } from '@/store/CatalogStore';
import { colors, radius, spacing } from '@/theme';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { mode, isFavorite, toggleFavorite, quantityFor } = useAppStore();
  const { products } = useCatalogStore();
  const product = products.find((item) => item.id === id);
  if (!product) return <View style={styles.center}><Text>Product not found.</Text></View>;
  const quantity = quantityFor(product.id);
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} contentFit="cover" />
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={[styles.roundButton, styles.back]}><Ionicons name="chevron-back" size={24} color={colors.text} /></Pressable>
          <Pressable accessibilityLabel="Toggle favorite" onPress={() => toggleFavorite(product.id)} style={[styles.roundButton, styles.heart]}><Ionicons name={isFavorite(product.id) ? 'heart' : 'heart-outline'} size={23} color={isFavorite(product.id) ? colors.danger : colors.text} /></Pressable>
        </View>
        <View style={styles.body}>
          {!!product.discount && <Text style={styles.offer}>{product.discount}% SAVINGS</Text>}
          <Text style={styles.name}>{product.name}</Text>
          <View style={styles.rating}><Ionicons name="star" size={15} color={colors.accent} /><Text style={styles.ratingText}>{product.rating} · Quality checked</Text></View>
          <View style={styles.priceRow}>
            <View><Text style={styles.price}>₹{priceFor(product, mode)}</Text><Text style={styles.unit}>{mode === 'business' ? product.businessUnit : product.unit}</Text></View>
            {product.inStock ? <QuantityControl productId={product.id} /> : <Text style={styles.unavailable}>Currently unavailable</Text>}
          </View>
          <View style={styles.divider} />
          <Text style={styles.heading}>About this product</Text>
          <Text style={styles.description}>{product.description}</Text>
          <View style={styles.origin}><View style={styles.originIcon}><Ionicons name="location-outline" size={21} color={colors.primary} /></View><View><Text style={styles.originLabel}>SOURCED FROM</Text><Text style={styles.originText}>{product.origin}</Text></View></View>
          <View style={styles.features}>
            <Feature icon="leaf-outline" title="Freshly sourced" />
            <Feature icon="shield-checkmark-outline" title="Quality checked" />
            <Feature icon="refresh-outline" title="Easy replacement" />
          </View>
        </View>
      </ScrollView>
      {!!quantity && <View style={styles.footer}><View><Text style={styles.footerLabel}>{quantity} in basket</Text><Text style={styles.footerPrice}>₹{quantity * priceFor(product, mode)}</Text></View><View style={styles.footerButton}><AppButton title="View basket" onPress={() => router.push('/cart')} /></View></View>}
    </View>
  );
}

function Feature({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return <View style={styles.feature}><Ionicons name={icon} size={22} color={colors.primary} /><Text style={styles.featureText}>{title}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: 96 },
  imageWrap: { height: 360, backgroundColor: colors.background },
  image: { width: '100%', height: '100%' },
  roundButton: { position: 'absolute', top: 18, width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,.94)', alignItems: 'center', justifyContent: 'center' },
  back: { left: spacing.lg },
  heart: { right: spacing.lg },
  body: { padding: spacing.xl },
  offer: { alignSelf: 'flex-start', color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: 9, paddingVertical: 5, borderRadius: radius.pill, fontWeight: '900', fontSize: 10 },
  name: { color: colors.text, fontWeight: '900', fontSize: 27, marginTop: spacing.md },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm },
  ratingText: { color: colors.muted, fontSize: 12 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: spacing.xl },
  price: { fontSize: 26, color: colors.text, fontWeight: '900' },
  unit: { color: colors.muted, marginTop: 3 },
  unavailable: { color: colors.danger, fontWeight: '800' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xl },
  heading: { color: colors.text, fontWeight: '900', fontSize: 17 },
  description: { color: colors.muted, lineHeight: 22, marginTop: spacing.sm },
  origin: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.primarySoft, marginTop: spacing.lg },
  originIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  originLabel: { color: colors.primary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  originText: { color: colors.text, fontWeight: '800', marginTop: 3 },
  features: { flexDirection: 'row', marginTop: spacing.xl, gap: spacing.sm },
  feature: { flex: 1, alignItems: 'center', padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md },
  featureText: { fontSize: 9, color: colors.muted, textAlign: 'center', marginTop: 6, fontWeight: '700' },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center' },
  footerLabel: { color: colors.muted, fontSize: 11 },
  footerPrice: { color: colors.text, fontWeight: '900', fontSize: 19 },
  footerButton: { flex: 1, marginLeft: spacing.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
