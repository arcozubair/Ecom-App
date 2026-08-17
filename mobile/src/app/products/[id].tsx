import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Dimensions, Platform, Alert
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ErrorState } from '../../components/ui/ErrorState';
import { colors, typography, spacing, radius, shadows } from '../../theme';

const { width } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const heartScale = useSharedValue(1);
  const cartBtnScale = useSharedValue(1);

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));

  const { data: product, isLoading, error, refetch } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id as string),
  });

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.imageSkeleton} />
        <View style={styles.contentSkeleton}>
          <View style={[styles.skLine, { width: '70%', height: 24, marginBottom: 16 }]} />
          <View style={[styles.skLine, { width: '40%', height: 20, marginBottom: 32 }]} />
          <View style={[styles.skLine, { width: '90%', height: 14, marginBottom: 8 }]} />
          <View style={[styles.skLine, { width: '75%', height: 14 }]} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return <ErrorState onRetry={refetch} />;
  }

  const images: any[] = product.images || [];
  const attributes: any[] = product.attributes || [];
  const wishlisted = isInWishlist(product.id);

  const sizeAttr = attributes.find(
    (a: any) => a.name?.toLowerCase() === 'size' || a.slug?.toLowerCase() === 'pa_size'
  );
  const sizes: string[] = sizeAttr?.options || [];
  const displayPrice = product.sale_price || product.price;
  const regularPrice = product.regular_price;
  const hasDiscount = regularPrice && regularPrice !== displayPrice;
  const discountPct = hasDiscount
    ? Math.round(((parseFloat(regularPrice) - parseFloat(displayPrice)) / parseFloat(regularPrice)) * 100)
    : 0;
  const inStock = product.stock_status === 'instock';

  const handleWishlist = () => {
    heartScale.value = withSequence(
      withSpring(1.4, { damping: 8, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 300 })
    );
    wishlisted ? removeFromWishlist(product.id) : addToWishlist(product);
  };

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      Alert.alert('Size Required', 'Please select a size before adding to bag.');
      return;
    }
    addToCart(product, selectedSize || 'Default');
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            <Image source={{ uri: images[currentImageIdx]?.src }} style={styles.mainImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Feather name="image" size={48} color={colors.border} />
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + spacing.sm }]}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Wishlist */}
          <TouchableOpacity
            style={[styles.wishlistOverlayBtn, { top: insets.top + spacing.sm }]}
            onPress={handleWishlist}
            activeOpacity={0.9}
          >
            <Animated.View style={heartStyle}>
              <Feather name="heart" size={20} color={wishlisted ? colors.error : colors.textPrimary} />
            </Animated.View>
          </TouchableOpacity>

          {/* Discount Badge */}
          {hasDiscount && discountPct > 0 && (
            <View style={styles.discountOverlay}>
              <Text style={styles.discountOverlayText}>-{discountPct}%</Text>
            </View>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.thumbnailRow}
              contentContainerStyle={{ paddingHorizontal: spacing.base, gap: spacing.sm }}
            >
              {images.map((img: any, idx: number) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setCurrentImageIdx(idx)}
                  style={[styles.thumbnail, currentImageIdx === idx && styles.thumbnailActive]}
                >
                  <Image source={{ uri: img.src }} style={styles.thumbnailImg} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Stock */}
          <View style={[styles.stockBadge, { backgroundColor: inStock ? colors.successTint : colors.errorTint }]}>
            <View style={[styles.stockDot, { backgroundColor: inStock ? colors.success : colors.error }]} />
            <Text style={[styles.stockText, { color: inStock ? colors.success : colors.error }]}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{displayPrice || '—'}</Text>
            {hasDiscount && (
              <>
                <Text style={styles.originalPrice}>₹{regularPrice}</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>{discountPct}% OFF</Text>
                </View>
              </>
            )}
          </View>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <View style={styles.sizeSection}>
              <Text style={styles.sizeLabel}>SELECT SIZE</Text>
              <View style={styles.sizeRow}>
                {sizes.map((s: string) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.sizeChip, selectedSize === s && styles.sizeChipActive]}
                    onPress={() => setSelectedSize(s)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.sizeChipText, selectedSize === s && styles.sizeChipTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Other Attributes */}
          {attributes.filter((a: any) =>
            a.name?.toLowerCase() !== 'size' && a.slug?.toLowerCase() !== 'pa_size'
          ).map((attr: any) => (
            <View key={attr.id} style={styles.attrRow}>
              <Text style={styles.attrKey}>{attr.name}</Text>
              <Text style={styles.attrValue}>{(attr.options || []).join(', ')}</Text>
            </View>
          ))}

          {/* Description */}
          {product.short_description ? (
            <View style={styles.descSection}>
              <TouchableOpacity
                style={styles.descHeader}
                onPress={() => setDescExpanded(v => !v)}
                activeOpacity={0.7}
              >
                <Text style={styles.descTitle}>Description</Text>
                <Feather name={descExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
              </TouchableOpacity>
              {descExpanded && (
                <Text style={styles.descText}>
                  {product.short_description.replace(/<[^>]*>/g, '')}
                </Text>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.base }]}>
        <PrimaryButton
          label={addedToCart ? '✓ Added to Bag' : inStock ? 'Add to Bag' : 'Out of Stock'}
          onPress={handleAddToCart}
          disabled={!inStock}
          size="lg"
          style={[styles.addBtn, addedToCart && styles.addedBtn]}
          icon={!addedToCart && inStock ? <Feather name="shopping-bag" size={18} color="#FFF" /> : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  // Loading Skeleton
  loadingContainer: { flex: 1, backgroundColor: colors.surface },
  imageSkeleton: { width: '100%', height: width * 1.1, backgroundColor: colors.skeleton },
  contentSkeleton: { padding: spacing.xl },
  skLine: { backgroundColor: colors.skeleton, borderRadius: radius.xs },

  // Image
  imageContainer: { width: '100%', backgroundColor: colors.background },
  mainImage: { width: '100%', height: width * 1.1, resizeMode: 'cover' },
  imagePlaceholder: {
    width: '100%',
    height: width * 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  backBtn: {
    position: 'absolute',
    left: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  wishlistOverlayBtn: {
    position: 'absolute',
    right: spacing.base,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  discountOverlay: {
    position: 'absolute',
    top: spacing['5xl'],
    left: spacing.base,
    backgroundColor: colors.error,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  discountOverlayText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 11,
    color: '#FFF',
  },
  thumbnailRow: {
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
  },
  thumbnail: {
    width: 64,
    height: 80,
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  thumbnailActive: { borderColor: colors.primary, borderWidth: 2 },
  thumbnailImg: { width: '100%', height: '100%', resizeMode: 'cover' },

  // Content
  content: { padding: spacing.xl },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    gap: 6,
    marginBottom: spacing.md,
  },
  stockDot: { width: 6, height: 6, borderRadius: 3 },
  stockText: { fontFamily: 'Montserrat_700Bold', fontSize: 11, letterSpacing: 0.5 },
  productTitle: { ...typography.h2, marginBottom: spacing.base, lineHeight: 32 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  price: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  originalPrice: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: colors.primaryTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xs,
  },
  discountBadgeText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.3,
  },

  // Size
  sizeSection: { marginBottom: spacing.xl },
  sizeLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.md },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  sizeChip: {
    minWidth: 52,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  sizeChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryTint },
  sizeChipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.textSecondary },
  sizeChipTextActive: { color: colors.primary, fontFamily: 'Montserrat_700Bold' },

  // Attributes
  attrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  attrKey: { ...typography.label, fontSize: 11, color: colors.textMuted },
  attrValue: { ...typography.bodySmall, fontFamily: 'Montserrat_600SemiBold', color: colors.textPrimary },

  // Description
  descSection: {
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.base,
  },
  descHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  descTitle: { ...typography.h3, fontSize: 16 },
  descText: { ...typography.body, color: colors.textSecondary, marginTop: spacing.md, lineHeight: 24 },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    ...shadows.md,
  },
  addBtn: { borderRadius: radius.pill, width: '100%' },
  addedBtn: { backgroundColor: colors.success },
});
