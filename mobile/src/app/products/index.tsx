import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../../api/client';
import { ProductCard } from '../../components/ui/ProductCard';
import { SkeletonRow } from '../../components/ui/SkeletonCard';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useWishlistStore } from '../../store/useWishlistStore';
import { colors, spacing, BOTTOM_INSET } from '../../theme';

export default function ProductListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.category ? Number(params.category) : undefined;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const { data: products, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ['products', categoryId, page],
    queryFn: () => fetchProducts({ category: categoryId, page, per_page: 20 }),
  });

  useEffect(() => {
    if (products && products.length > 0) {
      if (page === 1) setAllProducts(products);
      else setAllProducts(prev => [...prev, ...products]);
    }
  }, [products]);

  const loadMore = () => {
    if (!isFetching && products?.length === 20) setPage(p => p + 1);
  };

  if (isLoading && page === 1) {
    return (
      <View style={styles.container}>
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </View>
    );
  }

  if (error && page === 1) {
    return <ErrorState onRetry={refetch} />;
  }

  if (!isLoading && allProducts.length === 0) {
    return (
      <EmptyState
        icon="package"
        title="No products found"
        subtitle="We couldn't find any products in this category."
        actionLabel="Go Back"
        onAction={() => router.back()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allProducts}
        keyExtractor={(item, idx) => item.id?.toString() || idx.toString()}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/products/${item.id || item.slug}` as any)}
            onWishlistToggle={() =>
              isInWishlist(item.id) ? removeFromWishlist(item.id) : addToWishlist(item)
            }
            isWishlisted={isInWishlist(item.id)}
          />
        )}
        numColumns={2}
        contentContainerStyle={styles.list}
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
  list: { padding: spacing.base, paddingBottom: BOTTOM_INSET },
  row: { gap: spacing.md, marginBottom: spacing.md },
});
