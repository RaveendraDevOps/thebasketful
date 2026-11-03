import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ProductGrid } from '@/components/ProductGrid';
import { CartBar } from '@/components/ui';
import { products } from '@/data/catalog';
import { colors, radius, spacing } from '@/theme';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return needle ? products.filter((product) => `${product.name} ${product.category} ${product.origin}`.toLowerCase().includes(needle)) : products;
  }, [query]);
  return (
    <View style={styles.page}>
      <View style={styles.top}>
        <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="chevron-back" size={25} color={colors.text} /></Pressable>
        <View style={styles.search}><Ionicons name="search" size={20} color={colors.muted} /><TextInput autoFocus placeholder="Search Basketful" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} style={styles.input} returnKeyType="search" />{!!query && <Pressable onPress={() => setQuery('')}><Ionicons name="close-circle" size={19} color={colors.muted} /></Pressable>}</View>
      </View>
      <ProductGrid products={filtered} />
      <CartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  back: { width: 42, height: 48, alignItems: 'center', justifyContent: 'center' },
  search: { flex: 1, height: 48, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.background, borderRadius: radius.md, paddingHorizontal: spacing.md },
  input: { flex: 1, color: colors.text, fontSize: 15 },
});
