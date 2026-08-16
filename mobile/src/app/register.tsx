import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const handleRegister = async () => {
    if (!firstName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      const loginRes = await apiClient.post('/auth/login', { username: email, password });
      setToken(loginRes.data.token);
      setUser(loginRes.data.user);
      router.replace('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ id, label, value, onChangeText, placeholder, keyboardType, autoCapitalize, icon, secure }: any) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputRow, focused === id && styles.inputFocused]}>
        <Feather name={icon} size={16} color={focused === id ? colors.primary : colors.textMuted} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secure && !showPassword}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
        />
        {secure && (
          <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
            <Feather name={showPassword ? 'eye-off' : 'eye'} size={16} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brandWrap}>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={styles.brandIcon}
              resizeMode="contain"
            />
            <Text style={styles.brand}>PINE</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Join us and start shopping</Text>

            {error ? (
              <View style={styles.errorBanner}>
                <Feather name="alert-circle" size={14} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.nameRow}>
              <View style={{ flex: 1 }}>
                <InputField id="firstName" label="First Name *" value={firstName} onChangeText={setFirstName} placeholder="John" icon="user" />
              </View>
              <View style={{ flex: 1 }}>
                <InputField id="lastName" label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Doe" icon="user" />
              </View>
            </View>

            <InputField id="email" label="Email Address *" value={email} onChangeText={setEmail} placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" icon="mail" />
            <InputField id="password" label="Password *" value={password} onChangeText={setPassword} placeholder="Create a password" autoCapitalize="none" icon="lock" secure />

            <PrimaryButton
              label="Create Account"
              onPress={handleRegister}
              loading={loading}
              size="lg"
              style={styles.createBtn}
            />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
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
    width: 64,
    height: 64,
    marginBottom: spacing.sm,
  },
  brand: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 32,
    color: colors.primary,
    letterSpacing: 8,
  },

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

  nameRow: { flexDirection: 'row', gap: spacing.md },
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

  createBtn: { borderRadius: radius.pill, marginTop: spacing.sm },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: { ...typography.body, color: colors.textMuted },
  loginLink: { ...typography.body, fontFamily: 'Montserrat_700Bold', color: colors.primary },
});
