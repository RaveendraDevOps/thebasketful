import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartBar } from '@/components/ui';
import { categories, products } from '@/data/catalog';
import { colors, radius, spacing } from '@/theme';

export default function CategoriesScreen() {
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>EXPLORE</Text>
        <Text style={styles.title}>Shop categories</Text>
        <Text style={styles.subtitle}>Everything you need, sourced with care.</Text>
        <View style={styles.grid}>
          {categories.map((category) => {
            const count = products.filter((product) => product.category === category.id).length;
            return (
              <Pressable key={category.id} onPress={() => router.push({ pathname: '/category/[id]', params: { id: category.id } })} style={styles.card}>
                <View style={[styles.icon, { backgroundColor: category.color }]}><Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={38} color={colors.primaryDark} /></View>
                <View style={styles.cardCopy}><Text style={styles.cardTitle}>{category.name}</Text><Text style={styles.count}>{count} products</Text></View>
                <Ionicons name="arrow-forward-circle" size={25} color={colors.primary} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <CartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingTop: 38, paddingBottom: 100 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '900', marginTop: 4 },
  subtitle: { color: colors.muted, marginTop: 4, marginBottom: spacing.xl },
  grid: { gap: spacing.md },
  card: { minHeight: 104, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: spacing.md, flexDirection: 'row', alignItems: 'center' },
  icon: { width: 78, height: 78, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center' },
  cardCopy: { flex: 1, marginLeft: spacing.lg },
  cardTitle: { fontSize: 17, fontWeight: '900', color: colors.text },
  count: { fontSize: 12, color: colors.muted, marginTop: 5 },
});
