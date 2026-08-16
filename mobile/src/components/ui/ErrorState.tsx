import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing, radius } from '../../theme';

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

export function ErrorState({ onRetry, message }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Feather name="wifi-off" size={36} color={colors.textMuted} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.subtitle}>
        {message || 'Please check your connection and try again.'}
      </Text>
      {onRetry && (
        <TouchableOpacity style={styles.btn} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.btnText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
    backgroundColor: colors.background,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.xl,
    maxWidth: 260,
  },
  btn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['2xl'],
    borderRadius: radius.sm,
  },
  btnText: {
    ...typography.button,
    color: colors.primary,
  },
});
