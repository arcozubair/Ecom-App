import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { fetchProductById } from '../api/client';
import { Feather } from '@expo/vector-icons';
import { EmptyState } from '../components/ui/EmptyState';
import { colors, typography, spacing, radius, shadows } from '../theme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';

const WishlistItem = ({ id }: { id: number }) => {
  const router = useRouter();
  const { removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const heartScale = useSharedValue(1);
  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: heartScale.value }] }));

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id.toString()),
  });

  const handleRemove = () => {
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 8, stiffness: 400 }),
      withSpring(0, { damping: 10, stiffness: 300 })
    );
    setTimeout(() => removeFromWishlist(id), 250);
  };

  if (isLoading || !product) return (
    <View style={styles.itemSkeleton}>
      <View style={styles.skeletonImg} />
      <View style={{ flex: 1, gap: 8, padding: spacing.md }}>
        <View style={[styles.skLine, { width: '80%' }]} />
        <View style={[styles.skLine, { width: '50%' }]} />
      </View>
    </View>
  );

  const inStock = product.stock_status === 'instock';

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardImageWrap}
        onPress={() => router.push(`/products/${product.id}` as any)}
        activeOpacity={0.85}
      >
        {product.images?.[0]?.src ? (
          <Image source={{ uri: product.images[0].src }} style={styles.cardImage} />
        ) : (
          <View style={styles.cardImagePlaceholder}>
            <Feather name="image" size={24} color={colors.border} />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.cardPrice}>₹{product.sale_price || product.price}</Text>
        <View style={[styles.stockBadge, { backgroundColor: inStock ? colors.successTint : colors.errorTint }]}>
          <Text style={[styles.stockText, { color: inStock ? colors.success : colors.error }]}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.addToCartBtn, !inStock && styles.addToCartDisabled]}
            onPress={() => inStock && addToCart(product, 'Default')}
            disabled={!inStock}
          >
            <Feather name="shopping-bag" size={14} color={inStock ? colors.primary : colors.textMuted} />
            <Text style={[styles.addToCartText, !inStock && { color: colors.textMuted }]}>
              Add to Bag
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
            <Animated.View style={heartStyle}>
              <Feather name="heart" size={18} color={colors.error} />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function WishlistScreen() {
  const { items } = useWishlistStore();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={styles.headerBack}
        >
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Wishlist</Text>
        {items.length > 0 && (
          <Text style={styles.headerCount}>{items.length} saved</Text>
        )}
      </View>

      {items.length === 0 ? (
        <EmptyState
          icon="heart"
          title="Your wishlist is empty"
          subtitle="Save the items you love and come back to them anytime."
          actionLabel="Explore Products"
          onAction={() => router.push('/')}
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(id) => id.toString()}
          renderItem={({ item }) => <WishlistItem id={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  headerBack: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: { ...typography.h2, fontSize: 22 },
  headerCount: { ...typography.bodySmall, color: colors.textMuted },

  list: { padding: spacing.base, gap: spacing.md, paddingBottom: 100 },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardImageWrap: { width: 110, height: 140, flexShrink: 0 },
  cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  cardName: {
    ...typography.bodySmall,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textPrimary,
    lineHeight: 18,
  },
  cardPrice: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 16,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  stockBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  stockText: { fontFamily: 'Montserrat_700Bold', fontSize: 10, letterSpacing: 0.3 },

  cardActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  addToCartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  addToCartDisabled: { borderColor: colors.border },
  addToCartText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  removeBtn: { padding: spacing.sm },

  // Skeleton
  itemSkeleton: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    height: 130,
    marginBottom: spacing.md,
  },
  skeletonImg: { width: 110, backgroundColor: colors.skeleton },
  skLine: { height: 12, backgroundColor: colors.skeleton, borderRadius: radius.xs },
});
