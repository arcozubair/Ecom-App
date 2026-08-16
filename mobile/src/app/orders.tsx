import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuthStore } from '../store/useAuthStore';
import { Feather } from '@expo/vector-icons';
import { StatusBadge } from '../components/ui/StatusBadge';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { colors, typography, spacing, radius, shadows } from '../theme';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: orders, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      const res = await apiClient.get('/orders', { params: { customer: user?.id } });
      return res.data;
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Orders</Text>
        </View>
        <EmptyState
          icon="lock"
          title="Sign in to view orders"
          subtitle="Your order history will appear here once you sign in."
          actionLabel="Sign In"
          onAction={() => router.push('/login')}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>My Orders</Text>
        </View>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return <ErrorState onRetry={refetch} />;
  }

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/orders/${item.id}` as any)}
      activeOpacity={0.85}
    >
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>Order #{item.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(item.date_created).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={styles.cardMid}>
        <View>
          <Text style={styles.itemCount}>
            {item.line_items.length} {item.line_items.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.itemNames} numberOfLines={1}>
            {item.line_items.slice(0, 2).map((i: any) => i.name).join(', ')}
            {item.line_items.length > 2 ? ` +${item.line_items.length - 2} more` : ''}
          </Text>
        </View>
        <Text style={styles.total}>₹{item.total}</Text>
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.viewDetails}>View Details</Text>
        <Feather name="arrow-right" size={14} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')}
          style={styles.headerBack}
        >
          <Feather name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>My Orders</Text>
      </View>

      {orders?.length === 0 ? (
        <EmptyState
          icon="box"
          title="No orders yet"
          subtitle="Your order history will appear here once you make a purchase."
          actionLabel="Start Shopping"
          onAction={() => router.push('/' as any)}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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

  list: { padding: spacing.base, gap: spacing.md, paddingBottom: 40 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    ...shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.base,
  },
  orderId: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  orderDate: { ...typography.bodySmall, color: colors.textMuted },

  cardMid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    marginBottom: spacing.md,
  },
  itemCount: { ...typography.bodySmall, color: colors.textMuted, marginBottom: 4 },
  itemNames: { ...typography.bodySmall, fontFamily: 'Montserrat_600SemiBold', color: colors.textPrimary, maxWidth: '70%' },
  total: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  viewDetails: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 0.3,
  },
});
