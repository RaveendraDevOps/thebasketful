import { Ionicons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { AppButton } from '@/components/ui';
import { useAuthStore } from '@/store/AuthStore';
import { colors, radius, spacing } from '@/theme';

export default function AuthScreen() {
  const { user, sendOtp, verifyOtp } = useAuthStore();
  const [number, setNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  if (user) return <Redirect href="/" />;

  const phone = `+91${number.replace(/\D/g, '')}`;
  const submit = async () => {
    if (number.replace(/\D/g, '').length !== 10) return Alert.alert('Invalid number', 'Enter a valid 10-digit Indian mobile number.');
    if (sent && otp.length !== 6) return Alert.alert('Invalid OTP', 'Enter the 6-digit code sent to your phone.');
    setBusy(true);
    try {
      if (sent) {
        await verifyOtp(phone, otp);
        router.replace('/');
      } else {
        await sendOtp(phone);
        setSent(true);
      }
    } catch (error) {
      Alert.alert('Could not continue', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.page}>
      <View style={styles.content}>
        <View style={styles.logo}><Ionicons name="basket" size={39} color="#FFF" /></View>
        <Text style={styles.brand}>basketful</Text>
        <Text style={styles.title}>{sent ? 'Verify your number' : 'Welcome'}</Text>
        <Text style={styles.subtitle}>{sent ? `Enter the OTP sent to ${phone}` : 'Sign in securely with your mobile number.'}</Text>
        {!sent ? (
          <View style={styles.inputRow}><Text style={styles.prefix}>+91</Text><TextInput value={number} onChangeText={setNumber} keyboardType="phone-pad" maxLength={10} placeholder="Mobile number" placeholderTextColor={colors.muted} style={styles.input} /></View>
        ) : (
          <TextInput value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} placeholder="6-digit OTP" placeholderTextColor={colors.muted} style={[styles.inputRow, styles.otp]} />
        )}
        {busy ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : <AppButton title={sent ? 'Verify and continue' : 'Send OTP'} onPress={submit} />}
        {sent && <Text onPress={() => { setSent(false); setOtp(''); }} style={styles.change}>Change mobile number</Text>}
        <Text style={styles.legal}>By continuing, you agree to Basketful’s Terms and Privacy Policy.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.background, justifyContent: 'center' },
  content: { padding: spacing.xl },
  logo: { width: 72, height: 72, borderRadius: 22, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' },
  brand: { color: colors.primaryDark, fontSize: 32, fontWeight: '900', textAlign: 'center', marginTop: spacing.md },
  title: { color: colors.text, fontSize: 27, fontWeight: '900', marginTop: spacing.xxl },
  subtitle: { color: colors.muted, lineHeight: 21, marginTop: spacing.sm, marginBottom: spacing.xl },
  inputRow: { height: 56, flexDirection: 'row', alignItems: 'center', borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface, marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  prefix: { color: colors.text, fontWeight: '800', paddingRight: spacing.md, borderRightWidth: 1, borderRightColor: colors.border },
  input: { flex: 1, height: '100%', color: colors.text, fontSize: 16, paddingLeft: spacing.md },
  otp: { width: '100%', color: colors.text, fontSize: 23, fontWeight: '800', letterSpacing: 8, textAlign: 'center' },
  loader: { height: 52 },
  change: { color: colors.primary, fontWeight: '800', textAlign: 'center', marginTop: spacing.lg },
  legal: { color: colors.muted, fontSize: 10, lineHeight: 16, textAlign: 'center', marginTop: spacing.xl },
});
