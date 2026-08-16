import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, ImageBackground, Dimensions,
  FlatList, ActivityIndicator, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../api/client';
import apiClient from '../../api/client';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { ProductCard, CARD_WIDTH } from '../../components/ui/ProductCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SkeletonRow } from '../../components/ui/SkeletonCard';
import { colors, typography, spacing, radius, shadows, BOTTOM_INSET } from '../../theme';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { items: cartItems } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const { data: newArrivals, isLoading: loadingNew } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: () => fetchProducts({ per_page: 8, orderby: 'date', order: 'desc' }),
  });

  const { data: featured, isLoading: loadingFeatured } = useQuery({
    queryKey: ['featured'],
    queryFn: () => fetchProducts({ per_page: 4, featured: true }),
  });

  const { data: products, isFetching } = useQuery({
    queryKey: ['products-home', page],
    queryFn: () => fetchProducts({ page, per_page: 20 }),
  });

  useEffect(() => {
    if (products && products.length > 0) {
      if (page === 1) setAllProducts(products);
      else setAllProducts(prev => [...prev, ...products]);
    }
  }, [products]);

  const loadMore = useCallback(() => {
    if (!isFetching && products?.length === 20) {
      setPage(p => p + 1);
    }
  }, [isFetching, products]);

  const renderProduct = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => router.push(`/products/${item.id}` as any)}
      onWishlistToggle={() =>
        isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)
      }
      isWishlisted={isInWishlist(item.id)}
    />
  ), [isInWishlist]);

  const ListHeader = useCallback(() => (
    <View>
      {/* ─── Hero ─────────────────────────────────────────── */}
      <View style={styles.heroWrap}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop' }}
          style={styles.heroBg}
        >
          <View style={styles.heroOverlay}>
            {/* Header Row */}
            <View style={[styles.headerRow, { paddingTop: insets.top + spacing.md }]}>
              <Text style={styles.brandName}>PINE</Text>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/search' as any)}>
                  <Feather name="search" size={20} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(tabs)/cart' as any)}>
                  <Feather name="shopping-bag" size={20} color="#FFF" />
                  {cartItems.length > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Hero Content */}
            <View style={styles.heroContent}>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>S / S 2026 COLLECTION</Text>
              </View>
              <Text style={styles.heroTitle}>Dress for{'\n'}Every Moment</Text>
              <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/products' as any)}>
                <Text style={styles.heroBtnText}>Shop Now</Text>
                <Feather name="arrow-right" size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* ─── Quick Links ──────────────────────────────────── */}
      <View style={styles.quickLinks}>
        {[
          { icon: 'tag', label: 'New In', route: '/products?orderby=date' },
          { icon: 'star', label: 'Featured', route: '/products?featured=true' },
          { icon: 'grid', label: 'Collections', route: '/(tabs)/categories' },
          { icon: 'percent', label: 'On Sale', route: '/products?on_sale=true' },
        ].map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.quickLink}
            onPress={() => router.push(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={styles.quickLinkIcon}>
              <Feather name={item.icon as any} size={18} color={colors.primary} />
            </View>
            <Text style={styles.quickLinkLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── Just Dropped ─────────────────────────────────── */}
      <View style={styles.section}>
        <SectionHeader
          title="Just Dropped"
          actionLabel="Shop All"
          onAction={() => router.push('/products' as any)}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {loadingNew
            ? Array(4).fill(null).map((_, i) => (
                <View key={i} style={styles.carouselCard}>
                  <View style={styles.carouselImageSkeleton} />
                  <View style={{ padding: spacing.md }}>
                    <View style={[styles.skeletonLine, { width: '80%', marginBottom: 6 }]} />
                    <View style={[styles.skeletonLine, { width: '50%' }]} />
                  </View>
                </View>
              ))
            : (newArrivals || []).map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.carouselCard}
                  onPress={() => router.push(`/products/${item.id}` as any)}
                  activeOpacity={0.92}
                >
                  <View style={styles.carouselImageWrap}>
                    {item.images?.[0]?.src ? (
                      <Image source={{ uri: item.images[0].src }} style={styles.carouselImage} />
                    ) : (
                      <View style={styles.carouselImagePlaceholder}>
                        <Feather name="image" size={24} color={colors.border} />
                      </View>
                    )}
                    {item.sale_price && (
                      <View style={styles.saleBadge}>
                        <Text style={styles.saleBadgeText}>SALE</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.carouselInfo}>
                    <Text style={styles.carouselName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.carouselPrice}>₹{item.sale_price || item.price || '—'}</Text>
                  </View>
                </TouchableOpacity>
              ))
          }
        </ScrollView>
      </View>

      {/* ─── Featured Banner ──────────────────────────────── */}
      {!loadingFeatured && featured && featured.length > 0 && (
        <View style={styles.section}>
          <SectionHeader title="Editorial Picks" />
          <View style={styles.masonryGrid}>
            {featured.slice(0, 4).map((item: any, idx: number) => {
              const isLarge = idx === 0;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.masonryItem, isLarge ? styles.masonryLarge : styles.masonrySmall]}
                  onPress={() => router.push(`/products/${item.id}` as any)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.masonryImageWrap, { height: isLarge ? 300 : 200 }]}>
                    {item.images?.[0]?.src ? (
                      <Image source={{ uri: item.images[0].src }} style={styles.masonryImage} />
                    ) : (
                      <View style={[styles.masonryImage, styles.imagePlaceholder]}>
                        <Feather name="image" size={28} color={colors.border} />
                      </View>
                    )}
                    <View style={styles.masonryOverlay}>
                      <Text style={styles.masonryName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.masonryPrice}>₹{item.sale_price || item.price}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ─── All Products Header ──────────────────────────── */}
      <View style={[styles.section, { marginBottom: 0, paddingBottom: 0 }]}>
        <SectionHeader title="All Products" />
      </View>
    </View>
  ), [newArrivals, featured, loadingNew, loadingFeatured, cartItems.length, insets.top]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={allProducts}
        keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
        renderItem={renderProduct}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={11}
        removeClippedSubviews={true}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <ActivityIndicator color={colors.primary} style={{ margin: spacing.xl }} />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  listContent: { paddingBottom: BOTTOM_INSET },
  row: { paddingHorizontal: spacing.base, gap: spacing.md, marginBottom: spacing.md },

  // Hero
  heroWrap: { height: height * 0.55, width: '100%' },
  heroBg: { flex: 1 },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,20,15,0.55)',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandName: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 28,
    color: '#FFF',
    letterSpacing: 6,
  },
  headerActions: { flexDirection: 'row', gap: spacing.sm },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  cartBadgeText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 8,
    color: '#FFF',
  },
  heroContent: { gap: spacing.base },
  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  heroPillText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: '#FFF',
    letterSpacing: 2,
  },
  heroTitle: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 40,
    color: '#FFF',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    gap: 8,
    ...shadows.sm,
  },
  heroBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.primary,
    letterSpacing: 0.5,
  },

  // Quick Links
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  quickLink: { alignItems: 'center', gap: spacing.sm },
  quickLinkIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryUltraLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLinkLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },

  // Sections
  section: {
    marginTop: spacing['2xl'],
    marginBottom: spacing.md,
  },

  // Carousel
  carousel: { paddingHorizontal: spacing.base, gap: spacing.md },
  carouselCard: {
    width: width * 0.45,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.sm,
  },
  carouselImageWrap: {
    width: '100%',
    height: width * 0.45 * 1.2,
    backgroundColor: colors.background,
  },
  carouselImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  carouselImagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  carouselImageSkeleton: {
    width: '100%',
    height: width * 0.45 * 1.2,
    backgroundColor: colors.skeleton,
  },
  carouselInfo: { padding: spacing.md, paddingTop: spacing.sm },
  carouselName: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  carouselPrice: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 14,
    color: colors.primary,
  },
  saleBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.error,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.xs,
  },
  saleBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 9,
    color: '#FFF',
    letterSpacing: 0.5,
  },

  // Skeleton
  skeletonLine: {
    height: 10,
    backgroundColor: colors.skeleton,
    borderRadius: radius.xs,
  },

  // Masonry
  masonryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.md,
  },
  masonryItem: { borderRadius: radius.md, overflow: 'hidden' },
  masonryLarge: { width: '100%' },
  masonrySmall: { width: (width - spacing.base * 2 - spacing.md) / 2 },
  masonryImageWrap: { backgroundColor: colors.background, position: 'relative' },
  masonryImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  masonryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  masonryName: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  masonryPrice: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 14,
    color: colors.primary,
  },
});
