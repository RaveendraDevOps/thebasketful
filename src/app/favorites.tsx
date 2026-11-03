import { StyleSheet, View } from 'react-native';
import { ProductGrid } from '@/components/ProductGrid';
import { EmptyState, ScreenHeader } from '@/components/ui';
import { products } from '@/data/catalog';
import { useAppStore } from '@/store/AppStore';
import { colors } from '@/theme';

export default function FavoritesScreen() {
  const { favorites } = useAppStore();
  const items = products.filter((product) => favorites.includes(product.id));
  return (
    <View style={styles.page}>
      <ScreenHeader title="Saved items" />
      {items.length ? <ProductGrid products={items} /> : <EmptyState icon="heart-outline" title="Nothing saved yet" message="Tap the heart on products you want to find quickly later." />}
    </View>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background } });
