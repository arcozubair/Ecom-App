import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { colors, typography, spacing, radius } from '../theme';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  // Prevent android hardware back button from going back to checkout
  useEffect(() => {
    const onBackPress = () => {
      router.replace('/');
      return true;
    };
    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="check" size={48} color="#FFF" />
        </View>
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase.{'\n'}Your order #{orderId} has been successfully placed.
        </Text>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Track Order"
          onPress={() => router.replace('/orders')}
          size="lg"
          style={styles.trackBtn}
        />
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.homeBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    padding: spacing.xl,
    gap: spacing.md,
  },
  trackBtn: {
    borderRadius: radius.pill,
  },
  homeBtn: {
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  homeBtnText: {
    ...typography.button,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
});
