import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ProductGrid } from '@/components/ProductGrid';
import { CartBar, ScreenHeader } from '@/components/ui';
import { useCatalogStore } from '@/store/CatalogStore';
import { colors } from '@/theme';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { categories, products } = useCatalogStore();
  const category = categories.find((item) => item.id === id);
  const filtered = products.filter((product) => product.category === id);
  return (
    <View style={styles.page}>
      <ScreenHeader title={category?.name ?? 'Products'} />
      <ProductGrid products={filtered} />
      <CartBar />
    </View>
  );
}

const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: colors.background } });
