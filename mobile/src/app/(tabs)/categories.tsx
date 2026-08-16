import React from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Image,
  StyleSheet, ActivityIndicator, Dimensions
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Feather } from '@expo/vector-icons';
import { ErrorState } from '../../components/ui/ErrorState';
import { colors, typography, spacing, radius, shadows, BOTTOM_INSET } from '../../theme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - spacing.base * 2 - spacing.md) / 2;

export default function CategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: categories, isLoading, error, refetch } = useQuery({
    queryKey: ['categories-all'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return (res.data as any[]).filter((c: any) => c.count > 0);
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + 60, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !categories) {
    return <ErrorState onRetry={refetch} />;
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/products?category=${item.id}` as any)}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrap}>
        {item.image?.src ? (
          <Image source={{ uri: item.image.src }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="grid" size={28} color={colors.border} />
          </View>
        )}
        <View style={styles.overlay}>
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <View style={styles.countRow}>
            <Text style={styles.count}>{item.count} items</Text>
            <Feather name="arrow-right" size={12} color="rgba(255,255,255,0.8)" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Collections</Text>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={[styles.list, { paddingBottom: BOTTOM_INSET }]}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  pageHeader: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  pageTitle: {
    ...typography.h2,
    fontSize: 22,
  },

  list: { padding: spacing.base },
  row: { gap: spacing.md, marginBottom: spacing.md },

  card: {
    width: ITEM_WIDTH,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  imageWrap: {
    width: '100%',
    height: ITEM_WIDTH * 1.25,
    backgroundColor: colors.background,
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    paddingTop: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  name: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 13,
    color: '#FFF',
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
});
