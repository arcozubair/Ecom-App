import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel = 'See All', onAction }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {onAction && (
        <TouchableOpacity style={styles.action} onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Feather name="arrow-right" size={14} color={colors.primary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    marginBottom: spacing.base,
  },
  title: {
    ...typography.h3,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    ...typography.label,
    fontSize: 12,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
