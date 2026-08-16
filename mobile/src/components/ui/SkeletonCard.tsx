import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withRepeat, withTiming, interpolate
} from 'react-native-reanimated';
import { colors, radius, spacing } from '../../theme';
import { CARD_WIDTH } from './ProductCard';

function ShimmerBox({ width, height, style }: { width?: DimensionValue; height: number; style?: ViewStyle }) {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.6, 1]),
  }));

  return (
    <Animated.View
      style={[
        {
          width: width ?? '100%',
          height,
          backgroundColor: colors.skeleton,
          borderRadius: radius.sm,
        },
        animStyle,
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <ShimmerBox height={CARD_WIDTH * 1.3} style={{ borderRadius: radius.md, marginBottom: 0 }} />
      <View style={styles.info}>
        <ShimmerBox height={12} width="80%" style={{ marginBottom: spacing.xs }} />
        <ShimmerBox height={12} width="50%" />
      </View>
    </View>
  );
}

export function SkeletonRow() {
  return (
    <View style={styles.row}>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  info: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
});
