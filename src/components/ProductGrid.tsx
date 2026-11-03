import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ProductCard } from '@/components/ui';
import { spacing } from '@/theme';
import { Product } from '@/types';

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.content}
      renderItem={({ item }) => <ProductCard product={item} wide />}
      ListEmptyComponent={<View style={styles.empty}><Text>No matching products found.</Text></View>}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: 100, gap: spacing.md },
  row: { gap: spacing.md },
  empty: { padding: spacing.xxl, alignItems: 'center' },
});
