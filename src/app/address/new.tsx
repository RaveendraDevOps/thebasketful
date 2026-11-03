import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton, ScreenHeader } from '@/components/ui';
import { createAddress } from '@/services/commerce';
import { colors, radius, spacing } from '@/theme';

const initial = { label: 'Home', recipientName: '', phone: '', line1: '', line2: '', city: '', state: 'Karnataka', postalCode: '' };

export default function NewAddressScreen() {
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const field = (key: keyof typeof form) => (value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async () => {
    if (!form.recipientName || form.phone.length < 10 || !form.line1 || !form.city || !/^\d{6}$/.test(form.postalCode)) {
      return Alert.alert('Check address', 'Complete all required fields and enter a valid phone number and 6-digit PIN code.');
    }
    setBusy(true);
    try {
      await createAddress(form);
      router.replace('/checkout');
    } catch (error) {
      Alert.alert('Address not saved', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}>
      <ScreenHeader title="Add delivery address" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.note}>Delivery is currently configured for India.</Text>
        <Field label="Address label" value={form.label} onChangeText={field('label')} placeholder="Home or Work" />
        <Field label="Recipient name" value={form.recipientName} onChangeText={field('recipientName')} />
        <Field label="Mobile number" value={form.phone} onChangeText={field('phone')} keyboardType="phone-pad" />
        <Field label="House, building and street" value={form.line1} onChangeText={field('line1')} />
        <Field label="Area or landmark (optional)" value={form.line2} onChangeText={field('line2')} />
        <Field label="City" value={form.city} onChangeText={field('city')} />
        <View style={styles.row}><View style={styles.half}><Field label="State" value={form.state} onChangeText={field('state')} /></View><View style={styles.half}><Field label="PIN code" value={form.postalCode} onChangeText={field('postalCode')} keyboardType="number-pad" /></View></View>
        {busy ? <ActivityIndicator color={colors.primary} /> : <AppButton title="Save address" onPress={submit} />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...props }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; keyboardType?: 'default' | 'phone-pad' | 'number-pad' }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...props} placeholderTextColor={colors.muted} style={styles.input} /></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  note: { color: colors.primaryDark, backgroundColor: colors.primarySoft, padding: spacing.md, borderRadius: radius.md, fontSize: 12, marginBottom: spacing.lg },
  field: { marginBottom: spacing.md },
  label: { color: colors.text, fontWeight: '800', fontSize: 12, marginBottom: 6 },
  input: { height: 52, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface, paddingHorizontal: spacing.md, color: colors.text },
  row: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
});
