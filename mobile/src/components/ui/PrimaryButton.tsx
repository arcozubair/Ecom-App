import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'filled' | 'outlined' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'filled',
  size = 'md',
  style,
  textStyle,
  icon,
}: PrimaryButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const isDisabled = disabled || loading;

  const sizeStyles = {
    sm: { paddingVertical: 10, paddingHorizontal: 20 },
    md: { paddingVertical: 16, paddingHorizontal: 24 },
    lg: { paddingVertical: 20, paddingHorizontal: 32 },
  };

  const getContainerStyle = (): ViewStyle => {
    if (variant === 'filled') {
      return {
        backgroundColor: isDisabled ? colors.border : colors.primary,
        borderWidth: 0,
      };
    }
    if (variant === 'outlined') {
      return {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: isDisabled ? colors.border : colors.primary,
      };
    }
    return { backgroundColor: 'transparent', borderWidth: 0 };
  };

  const getTextColor = (): string => {
    if (variant === 'filled') return colors.textInverse;
    if (variant === 'outlined') return isDisabled ? colors.textMuted : colors.primary;
    return isDisabled ? colors.textMuted : colors.primary;
  };

  return (
    <AnimatedTouchable
      style={[
        styles.base,
        sizeStyles[size],
        getContainerStyle(),
        animatedStyle,
        style,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={1}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'filled' ? '#FFF' : colors.primary} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.label, { color: getTextColor() }, textStyle]}>{label}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    gap: 8,
    ...shadows.xs,
  },
  label: {
    ...typography.button,
  },
});
