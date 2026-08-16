import React, { useState } from 'react';
import {
  View, Text, TextInput, FlatList, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, Keyboard
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/client';
import { Feather } from '@expo/vector-icons';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { colors, typography, spacing, radius, shadows } from '../theme';

const RECENT_SEARCHES = ['Shirt', 'Dress', 'Trousers', 'Jacket'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['search', submitted],
    queryFn: () => fetchProducts({ search: submitted }),
    enabled: !!submitted,
  });

  const handleSearch = (q: string) => {
    Keyboard.dismiss();
    setSubmitted(q);
    if (q !== query) setQuery(q);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => router.push(`/products/${item.id}` as any)}
      activeOpacity={0.8}
    >
      <View style={styles.resultImage}>
        {item.images?.[0]?.src ? (
          <Image source={{ uri: item.images[0].src }} style={styles.resultImg} />
        ) : (
          <View style={styles.resultImgPlaceholder}>
            <Feather name="image" size={20} color={colors.border} />
          </View>
        )}
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.resultPrice}>₹{item.sale_price || item.price || '—'}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.border} />
    </TouchableOpacity>
  );

  /* ── Search Bar ─────────────────────────────────── */
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.searchWrap}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchBox}>
          <Feather name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, brands..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => handleSearch(query)}
            returnKeyType="search"
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setSubmitted(''); }}>
              <Feather name="x" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch(query)} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {/* Error */}
      {error && !isLoading && <ErrorState onRetry={refetch} message="Search failed. Please try again." />}

      {/* No Results */}
      {!isLoading && !error && submitted && products?.length === 0 && (
        <EmptyState
          icon="search"
          title={`No results for "${submitted}"`}
          subtitle="Try a different keyword or browse our collections."
          actionLabel="Browse Collections"
          onAction={() => router.push('/(tabs)/categories' as any)}
        />
      )}

      {/* Results */}
      {!isLoading && !error && products && products.length > 0 && (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>{products.length} results for "{submitted}"</Text>
          </View>
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderProduct}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Default State — Recent + Suggestions */}
      {!submitted && !isLoading && (
        <View style={styles.defaultContent}>
          <Text style={styles.defaultSectionTitle}>Popular Searches</Text>
          <View style={styles.chipRow}>
            {RECENT_SEARCHES.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.chip}
                onPress={() => handleSearch(term)}
                activeOpacity={0.7}
              >
                <Feather name="trending-up" size={12} color={colors.primary} />
                <Text style={styles.chipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.base,
    height: 48,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: colors.textPrimary,
  },
  searchBtn: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  searchBtnText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.primary,
  },

  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  resultsHeader: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  resultsCount: { ...typography.bodySmall, color: colors.textMuted },

  resultsList: { paddingHorizontal: spacing.base, paddingVertical: spacing.sm },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  resultImage: {
    width: 64,
    height: 80,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.background,
    flexShrink: 0,
  },
  resultImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  resultImgPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resultInfo: { flex: 1 },
  resultName: { ...typography.bodySmall, fontFamily: 'Montserrat_600SemiBold', color: colors.textPrimary, marginBottom: 6 },
  resultPrice: { fontFamily: 'Montserrat_800ExtraBold', fontSize: 15, color: colors.primary },

  defaultContent: { padding: spacing.xl },
  defaultSectionTitle: { ...typography.label, color: colors.textMuted, marginBottom: spacing.base },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryUltraLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.base,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primaryTint,
  },
  chipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textPrimary },
});
