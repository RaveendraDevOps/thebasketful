import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useAppStore, priceFor } from '@/store/AppStore';
import { colors, radius, shadow, spacing } from '@/theme';
import { Product } from '@/types';

export function AppButton({ title, onPress, variant = 'primary', disabled = false }: {
  title: string; onPress: () => void; variant?: 'primary' | 'secondary'; disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, variant === 'secondary' && styles.buttonSecondary, (pressed || disabled) && styles.buttonMuted]}
    >
      <Text style={[styles.buttonText, variant === 'secondary' && styles.buttonSecondaryText]}>{title}</Text>
    </Pressable>
  );
}

export function Surface({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.surface, style]}>{children}</View>;
}

export function ScreenHeader({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.iconButton}>
        <Ionicons name="chevron-back" size={24} color={colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionTitle}>
      <Text style={styles.sectionText}>{title}</Text>
      {action && <Pressable onPress={onAction}><Text style={styles.sectionAction}>{action}</Text></Pressable>}
    </View>
  );
}

export function QuantityControl({ productId, compact = false }: { productId: string; compact?: boolean }) {
  const { quantityFor, updateQuantity } = useAppStore();
  const quantity = quantityFor(productId);
  if (!quantity) {
    return (
      <Pressable accessibilityLabel="Add item to cart" onPress={() => updateQuantity(productId, 1)} style={[styles.addButton, compact && styles.addCompact]}>
        <Text style={styles.addText}>ADD</Text>
        <Ionicons name="add" size={16} color={colors.primary} />
      </Pressable>
    );
  }
  return (
    <View style={[styles.stepper, compact && styles.addCompact]}>
      <Pressable accessibilityLabel="Remove one" onPress={() => updateQuantity(productId, -1)}><Ionicons name="remove" size={18} color="#FFF" /></Pressable>
      <Text style={styles.stepperText}>{quantity}</Text>
      <Pressable accessibilityLabel="Add one" onPress={() => updateQuantity(productId, 1)}><Ionicons name="add" size={18} color="#FFF" /></Pressable>
    </View>
  );
}

export function ProductCard({ product, wide = false }: { product: Product; wide?: boolean }) {
  const { mode, isFavorite, toggleFavorite } = useAppStore();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}
      style={[styles.productCard, wide && styles.productCardWide]}
    >
      <View style={styles.imageWrap}>
        <Image source={{ uri: product.image }} style={styles.productImage} contentFit="cover" transition={250} />
        {!!product.discount && <View style={styles.discount}><Text style={styles.discountText}>{product.discount}% OFF</Text></View>}
        <Pressable accessibilityLabel="Toggle favorite" onPress={(event) => { event.stopPropagation(); toggleFavorite(product.id); }} style={styles.favorite}>
          <Ionicons name={isFavorite(product.id) ? 'heart' : 'heart-outline'} size={19} color={isFavorite(product.id) ? colors.danger : colors.text} />
        </Pressable>
      </View>
      <View style={styles.productBody}>
        <Text numberOfLines={2} style={styles.productName}>{product.name}</Text>
        <Text style={styles.unit}>{mode === 'business' ? product.businessUnit : product.unit}</Text>
        <View style={styles.productBottom}>
          <View>
            <Text style={styles.price}>₹{priceFor(product, mode)}</Text>
            {mode === 'business' && <Text style={styles.taxLabel}>wholesale</Text>}
          </View>
          {product.inStock ? <QuantityControl productId={product.id} compact /> : <Text style={styles.outOfStock}>OUT</Text>}
        </View>
      </View>
    </Pressable>
  );
}

export function CartBar() {
  const { cartCount, total } = useAppStore();
  if (!cartCount) return null;
  return (
    <Pressable accessibilityRole="button" onPress={() => router.push('/cart')} style={styles.cartBar}>
      <View><Text style={styles.cartBarCount}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</Text><Text style={styles.cartBarTotal}>₹{total}</Text></View>
      <View style={styles.cartBarAction}><Text style={styles.cartBarText}>View basket</Text><Ionicons name="arrow-forward" size={18} color="#FFF" /></View>
    </Pressable>
  );
}

export function EmptyState({ icon, title, message, action, onAction }: { icon: keyof typeof Ionicons.glyphMap; title: string; message: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}><Ionicons name={icon} size={34} color={colors.primary} /></View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {action && onAction && <AppButton title={action} onPress={onAction} />}
    </View>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  buttonSecondary: { backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.primary },
  buttonMuted: { opacity: 0.6 },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  buttonSecondaryText: { color: colors.primary },
  surface: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  header: { height: 58, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  iconButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 19, fontWeight: '800', color: colors.text, textAlign: 'center' },
  headerRight: { width: 42, alignItems: 'center' },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  sectionText: { fontSize: 20, fontWeight: '800', color: colors.text },
  sectionAction: { color: colors.primary, fontWeight: '700' },
  addButton: { height: 34, minWidth: 80, paddingHorizontal: 9, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  addCompact: { minWidth: 70 },
  addText: { color: colors.primary, fontWeight: '900', fontSize: 12 },
  stepper: { height: 34, minWidth: 80, paddingHorizontal: 9, borderRadius: radius.sm, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepperText: { color: '#FFF', fontWeight: '800', marginHorizontal: 7 },
  productCard: { width: 174, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, ...shadow },
  productCardWide: { flex: 1, width: 'auto', minWidth: 150 },
  imageWrap: { height: 132, backgroundColor: colors.background },
  productImage: { width: '100%', height: '100%' },
  discount: { position: 'absolute', left: 0, top: 10, backgroundColor: colors.orange, paddingHorizontal: 7, paddingVertical: 4, borderTopRightRadius: radius.sm, borderBottomRightRadius: radius.sm },
  discountText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  favorite: { position: 'absolute', right: 8, top: 8, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,.92)', alignItems: 'center', justifyContent: 'center' },
  productBody: { padding: spacing.md },
  productName: { color: colors.text, fontWeight: '800', fontSize: 14, minHeight: 36 },
  unit: { color: colors.muted, fontSize: 12, marginTop: 3 },
  productBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: spacing.md },
  price: { color: colors.text, fontWeight: '900', fontSize: 17 },
  taxLabel: { color: colors.primary, fontSize: 9, fontWeight: '700' },
  outOfStock: { color: colors.danger, fontSize: 11, fontWeight: '900' },
  cartBar: { position: 'absolute', left: 14, right: 14, bottom: 10, minHeight: 62, borderRadius: radius.md, paddingHorizontal: spacing.lg, backgroundColor: colors.primaryDark, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', ...shadow },
  cartBarCount: { color: '#C9E8D3', fontSize: 11, fontWeight: '700' },
  cartBarTotal: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  cartBarAction: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  cartBarText: { color: '#FFF', fontSize: 15, fontWeight: '800' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl, gap: spacing.md },
  emptyIcon: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 21, fontWeight: '900', color: colors.text, textAlign: 'center' },
  emptyMessage: { color: colors.muted, textAlign: 'center', lineHeight: 21, marginBottom: spacing.sm },
});
