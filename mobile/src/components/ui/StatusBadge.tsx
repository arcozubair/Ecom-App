import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, radius } from '../../theme';

type StatusType = 'pending' | 'processing' | 'on-hold' | 'completed' | 'cancelled' | 'refunded' | string;

interface StatusBadgeProps {
  status: StatusType;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: colors.warning, bg: colors.warningTint },
  processing: { label: 'Processing', color: colors.info, bg: colors.infoTint },
  'on-hold': { label: 'On Hold', color: '#8B5CF6', bg: '#F5F3FF' },
  completed: { label: 'Completed', color: colors.success, bg: colors.successTint },
  cancelled: { label: 'Cancelled', color: colors.error, bg: colors.errorTint },
  refunded: { label: 'Refunded', color: colors.textSecondary, bg: colors.divider },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: colors.textMuted,
    bg: colors.background,
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    ...typography.label,
    fontSize: 11,
    letterSpacing: 0.3,
    textTransform: 'capitalize',
  },
});
