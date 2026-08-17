import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/login', { username: email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Brand */}
          <View style={styles.brandWrap}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 220, height: 48, marginBottom: spacing.md }}
              resizeMode="contain"
            />
            <Text style={styles.brandSub}>Your fashion destination</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Email */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <View style={[styles.inputRow, focused === 'email' && styles.inputFocused]}>
                <Feather name="mail" size={16} color={focused === 'email' ? colors.primary : colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={[styles.inputRow, focused === 'password' && styles.inputFocused]}>
                <Feather name="lock" size={16} color={focused === 'password' ? colors.primary : colors.textMuted} />
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textMuted}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <PrimaryButton
              label="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
              style={styles.signInBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/register')}>
              <Text style={styles.createBtnText}>Create an Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: spacing.xl, justifyContent: 'center' },

  brandWrap: { alignItems: 'center', marginBottom: spacing['2xl'] },
  brandIcon: {
    width: 72,
    height: 72,
    marginBottom: spacing.md,
  },
  brand: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 36,
    color: colors.primary,
    letterSpacing: 8,
  },
  brandSub: { ...typography.bodySmall, color: colors.textMuted, marginTop: 4, letterSpacing: 0.5 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.md,
  },
  title: { ...typography.h2, fontSize: 24, marginBottom: spacing.xs },
  subtitle: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xl },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorTint,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.base,
  },
  errorText: { ...typography.bodySmall, color: colors.error, flex: 1 },

  fieldWrap: { marginBottom: spacing.base },
  fieldLabel: { ...typography.label, fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.background,
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: colors.primaryUltraLight },
  input: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },

  signInBtn: { borderRadius: radius.pill, marginTop: spacing.sm },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginVertical: spacing.xl,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { ...typography.bodySmall, color: colors.textMuted },

  createBtn: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  createBtnText: { ...typography.button, color: colors.textPrimary, letterSpacing: 0.5 },
});
