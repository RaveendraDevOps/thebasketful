import { Href, router, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppStoreProvider, useAppStore } from '@/store/AppStore';
import { AuthStoreProvider, useAuthStore } from '@/store/AuthStore';
import { CatalogStoreProvider } from '@/store/CatalogStore';
import { colors } from '@/theme';

function Navigator() {
  const { hydrated } = useAppStore();
  const { loading: authLoading, configured, user } = useAuthStore();
  const segments = useSegments();
  useEffect(() => {
    if (authLoading || !configured) return;
    const onAuthScreen = String(segments[0]) === 'auth';
    if (!user && !onAuthScreen) router.replace('/auth' as Href);
    if (user && onAuthScreen) router.replace('/');
  }, [authLoading, configured, segments, user]);
  if (!hydrated || authLoading) {
    return <View style={styles.loading}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="category/[id]" />
        <Stack.Screen name="search" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="address/new" />
        <Stack.Screen name="confirmation" options={{ gestureEnabled: false }} />
        <Stack.Screen name="order/[id]" />
        <Stack.Screen name="favorites" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return <SafeAreaProvider><AuthStoreProvider><CatalogStoreProvider><AppStoreProvider><Navigator /></AppStoreProvider></CatalogStoreProvider></AuthStoreProvider></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
});
