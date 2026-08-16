import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../theme';

const { width } = Dimensions.get('window');
export const CARD_WIDTH = (width - spacing.base * 2 - spacing.md) / 2;

interface ProductCardProps {
  product: any;
  onPress: () => void;
  onWishlistToggle?: () => void;
  isWishlisted?: boolean;
  style?: any;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function ProductCard({
  product,
  onPress,
  onWishlistToggle,
  isWishlisted = false,
  style,
}: ProductCardProps) {
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handleWishlist = () => {
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
    onWishlistToggle?.();
  };

  const imageUrl = product?.images?.[0]?.src;
  const hasDiscount = product?.sale_price && product?.regular_price && product.sale_price !== product.regular_price;
  const discountPct = hasDiscount
    ? Math.round(((parseFloat(product.regular_price) - parseFloat(product.sale_price)) / parseFloat(product.regular_price)) * 100)
    : 0;

  return (
    <AnimatedTouchable
      style={[styles.card, cardAnimStyle, style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      {/* Image */}
      <View style={styles.imageWrap}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="image" size={28} color={colors.border} />
          </View>
        )}

        {/* Discount Badge */}
        {hasDiscount && discountPct > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discountPct}%</Text>
          </View>
        )}

        {/* Wishlist Button */}
        {onWishlistToggle && (
          <TouchableOpacity style={styles.wishlistBtn} onPress={handleWishlist} activeOpacity={0.8}>
            <Animated.View style={heartAnimStyle}>
              <Feather
                name={isWishlisted ? 'heart' : 'heart'}
                size={16}
                color={isWishlisted ? colors.error : colors.textMuted}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product?.name || '—'}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>
            ₹{product?.sale_price || product?.price || '—'}
          </Text>
          {hasDiscount && (
            <Text style={styles.originalPrice}>₹{product?.regular_price}</Text>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 0.75,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  discountBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  discountText: {
    ...typography.label,
    fontSize: 10,
    color: colors.textInverse,
    letterSpacing: 0.5,
  },
  wishlistBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  info: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  name: {
    ...typography.bodySmall,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  price: {
    ...typography.priceSmall,
    color: colors.textPrimary,
  },
  originalPrice: {
    ...typography.caption,
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
});
