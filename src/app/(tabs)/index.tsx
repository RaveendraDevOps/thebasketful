import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CartBar, ProductCard, SectionTitle } from '@/components/ui';
import { categories, products } from '@/data/catalog';
import { useAppStore } from '@/store/AppStore';
import { colors, radius, spacing } from '@/theme';

export default function HomeScreen() {
  const { mode } = useAppStore();
  const featured = products.filter((product) => product.featured);
  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topbar}>
          <View style={styles.locationIcon}><Ionicons name="location" size={20} color={colors.primary} /></View>
          <View style={styles.locationCopy}><Text style={styles.deliver}>DELIVER TO</Text><Text numberOfLines={1} style={styles.location}>{mode === 'business' ? 'My Store, Koramangala' : 'Home, Indiranagar'} <Ionicons name="chevron-down" size={13} /></Text></View>
          <Pressable onPress={() => router.push('/favorites')} style={styles.topIcon}><Ionicons name="heart-outline" size={23} color={colors.text} /></Pressable>
          <Pressable onPress={() => router.push('/cart')} style={styles.topIcon}><Ionicons name="basket-outline" size={24} color={colors.text} /></Pressable>
        </View>
        <Pressable accessibilityRole="search" onPress={() => router.push('/search')} style={styles.search}>
          <Ionicons name="search" size={21} color={colors.muted} /><Text style={styles.searchText}>Search fruits, vegetables and more</Text><Ionicons name="mic-outline" size={20} color={colors.primary} />
        </Pressable>

        <LinearGradient colors={mode === 'business' ? ['#173E2A', '#286544'] : ['#176B3A', '#4A9C63']} style={styles.banner}>
          <View style={styles.bannerCopy}>
            <View style={styles.badge}><Text style={styles.badgeText}>{mode === 'business' ? 'BUSINESS SAVINGS' : 'FARM TO HOME'}</Text></View>
            <Text style={styles.bannerTitle}>{mode === 'business' ? 'Wholesale prices,\nevery single day.' : 'Fresh harvest,\nfuller basket.'}</Text>
            <Text style={styles.bannerSub}>{mode === 'business' ? 'Save up to 25% on bulk produce' : 'Free delivery above ₹499'}</Text>
          </View>
          <Text style={styles.bannerEmoji}>{mode === 'business' ? '📦' : '🥬'}</Text>
        </LinearGradient>

        <SectionTitle title="Shop by category" action="See all" onAction={() => router.push('/(tabs)/categories')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categories.map((category) => (
            <Pressable key={category.id} onPress={() => router.push({ pathname: '/category/[id]', params: { id: category.id } })} style={styles.category}>
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}><Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={30} color={colors.primaryDark} /></View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <SectionTitle title={mode === 'business' ? 'Best wholesale rates' : 'Fresh picks for you'} action="View all" onAction={() => router.push('/search')} />
        <FlatList data={featured} keyExtractor={(item) => item.id} horizontal scrollEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productRow} renderItem={({ item }) => <ProductCard product={item} />} />

        <View style={styles.promise}>
          <Text style={styles.promiseTitle}>The Basketful promise</Text>
          <View style={styles.promiseRow}>
            <Promise icon="leaf" label="Farm fresh" />
            <Promise icon="shield-checkmark" label="Quality checked" />
            <Promise icon="time" label="On-time delivery" />
          </View>
        </View>
      </ScrollView>
      <CartBar />
    </View>
  );
}

function Promise({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return <View style={styles.promiseItem}><View style={styles.promiseIcon}><Ionicons name={icon} size={19} color={colors.primary} /></View><Text style={styles.promiseLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 100 },
  topbar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md, backgroundColor: colors.surface },
  locationIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  locationCopy: { flex: 1, marginLeft: 10 },
  deliver: { fontSize: 9, fontWeight: '900', color: colors.primary, letterSpacing: .8 },
  location: { fontWeight: '800', color: colors.text, marginTop: 2 },
  topIcon: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  search: { margin: spacing.lg, marginTop: spacing.sm, height: 50, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: 9 },
  searchText: { flex: 1, color: colors.muted, fontSize: 13 },
  banner: { marginHorizontal: spacing.lg, minHeight: 178, borderRadius: radius.lg, padding: spacing.xl, flexDirection: 'row', overflow: 'hidden', marginBottom: spacing.xl },
  bannerCopy: { flex: 1, zIndex: 1 },
  badge: { alignSelf: 'flex-start', backgroundColor: colors.accent, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 9, fontWeight: '900', color: colors.primaryDark },
  bannerTitle: { fontSize: 25, lineHeight: 29, fontWeight: '900', color: '#FFF', marginTop: spacing.md },
  bannerSub: { color: '#D8F1E1', fontSize: 12, marginTop: spacing.sm },
  bannerEmoji: { fontSize: 75, alignSelf: 'flex-end', marginRight: -18, marginBottom: -12 },
  categoryRow: { paddingHorizontal: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  category: { width: 68, alignItems: 'center' },
  categoryIcon: { width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  categoryName: { color: colors.text, fontSize: 11, fontWeight: '700', marginTop: 7, textAlign: 'center' },
  productRow: { paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  promise: { marginHorizontal: spacing.lg, backgroundColor: colors.primarySoft, borderRadius: radius.lg, padding: spacing.lg },
  promiseTitle: { textAlign: 'center', color: colors.primaryDark, fontWeight: '900', fontSize: 16, marginBottom: spacing.lg },
  promiseRow: { flexDirection: 'row', justifyContent: 'space-around' },
  promiseItem: { alignItems: 'center', flex: 1 },
  promiseIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  promiseLabel: { fontSize: 10, fontWeight: '700', color: colors.primaryDark, marginTop: 6, textAlign: 'center' },
});
