import React from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, Animated as RNAnimated
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCartStore } from '../../store/useCartStore';
import { Feather } from '@expo/vector-icons';
import { EmptyState } from '../../components/ui/EmptyState';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { colors, typography, spacing, radius, shadows, BOTTOM_INSET } from '../../theme';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const insets = useSafeAreaInsets();
  const total = getTotalPrice();

  if (items.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Bag</Text>
        </View>
        <EmptyState
          icon="shopping-bag"
          title="Your bag is empty"
          subtitle="Looks like you haven't added anything yet. Start exploring our collection."
          actionLabel="Start Shopping"
          onAction={() => router.push('/')}
        />
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => {
    const imageUrl = item.product.images?.[0]?.src || null;
    const itemPrice = parseFloat(item.product.sale_price || item.product.price || '0');
    const lineTotal = (itemPrice * item.quantity).toFixed(0);

    return (
      <View style={styles.cartItem}>
        <TouchableOpacity
          style={styles.itemImageWrap}
          onPress={() => router.push(`/products/${item.product.id}` as any)}
          activeOpacity={0.85}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.itemImage} />
          ) : (
            <View style={[styles.itemImage, styles.imagePlaceholder]}>
              <Feather name="image" size={20} color={colors.border} />
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.itemDetails}>
          <View style={styles.itemTop}>
            <Text style={styles.itemName} numberOfLines={2}>{item.product.name}</Text>
            <TouchableOpacity
              onPress={() => removeFromCart(item.product.id, item.size)}
              style={styles.removeBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Feather name="trash-2" size={15} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {item.size && item.size !== 'Default' && (
            <View style={styles.sizePill}>
              <Text style={styles.sizePillText}>Size: {item.size}</Text>
            </View>
          )}

          <View style={styles.itemBottom}>
            {/* Quantity Selector */}
            <View style={styles.qtyControl}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                style={styles.qtyBtn}
              >
                <Feather name="minus" size={14} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                style={styles.qtyBtn}
              >
                <Feather name="plus" size={14} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.lineTotal}>₹{lineTotal}</Text>
          </View>
        </View>
      </View>
    );
  };

  const Footer = () => (
    <View style={styles.footer}>
      {/* Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{total.toFixed(0)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Shipping</Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>Free</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
        </View>
        <Text style={styles.taxNote}>Taxes included · Shipping calculated at checkout</Text>
      </View>

      <PrimaryButton
        label="Proceed to Checkout"
        onPress={() => router.push('/checkout' as any)}
        size="lg"
        style={styles.checkoutBtn}
        icon={<Feather name="lock" size={16} color="#FFF" />}
      />
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Bag</Text>
        <Text style={styles.itemCount}>{items.length} {items.length === 1 ? 'item' : 'items'}</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => `${item.product.id}-${item.size}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<Footer />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  pageHeader: {
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
    flexShrink: 0,
  },
  pageTitle: { ...typography.h2, fontSize: 22 },
  itemCount: { ...typography.bodySmall, color: colors.textMuted },

  list: { padding: spacing.base },

  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.xs,
  },
  itemImageWrap: {
    width: 100,
    height: 130,
    backgroundColor: colors.background,
    flexShrink: 0,
  },
  itemImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: { justifyContent: 'center', alignItems: 'center', flex: 1 },

  itemDetails: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  itemName: {
    ...typography.bodySmall,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
  },
  removeBtn: {
    padding: 4,
  },
  sizePill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  sizePillText: {
    ...typography.caption,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textSecondary,
  },

  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  qtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  lineTotal: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 16,
    color: colors.textPrimary,
  },

  // Footer / Summary
  footer: { marginTop: spacing.sm },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.base,
    ...shadows.xs,
  },
  summaryTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryLabel: { ...typography.body, color: colors.textSecondary },
  summaryValue: { ...typography.body, fontFamily: 'Montserrat_600SemiBold', color: colors.textPrimary },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.md,
    marginTop: spacing.xs,
  },
  totalLabel: { ...typography.h3, fontSize: 16 },
  totalValue: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 22,
    color: colors.textPrimary,
  },
  taxNote: {
    ...typography.caption,
    marginTop: spacing.sm,
    color: colors.textMuted,
  },

  checkoutBtn: {
    borderRadius: radius.pill,
    marginBottom: BOTTOM_INSET,
  },
});
