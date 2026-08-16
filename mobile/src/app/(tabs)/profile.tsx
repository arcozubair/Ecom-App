import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { Feather } from '@expo/vector-icons';
import { EmptyState } from '../../components/ui/EmptyState';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { colors, typography, spacing, radius, shadows, BOTTOM_INSET } from '../../theme';

const MENU_SECTIONS = (cartCount: number, wishlistCount: number, router: any, logout: () => void) => [
  {
    title: 'Shopping',
    items: [
      { icon: 'box', label: 'My Orders', route: '/orders', badge: null },
      { icon: 'heart', label: 'Wishlist', route: '/wishlist', badge: wishlistCount > 0 ? wishlistCount : null },
      { icon: 'shopping-bag', label: 'Shopping Bag', route: '/(tabs)/cart', badge: cartCount > 0 ? cartCount : null },
    ],
  },
  {
    title: 'Account',
    items: [
      { icon: 'map-pin', label: 'Address Book', route: null, badge: null },
      { icon: 'settings', label: 'Account Settings', route: null, badge: null },
    ],
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Account</Text>
        </View>
        <EmptyState
          icon="user"
          title="Sign in to your account"
          subtitle="Access your orders, wishlist, and profile by signing in."
          actionLabel="Sign In"
          onAction={() => router.push('/login')}
        />
      </View>
    );
  }

  const sections = MENU_SECTIONS(cartItems.length, wishlistItems.length, router, logout);
  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Account</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: BOTTOM_INSET }}>
        {/* Profile Hero */}
        <View style={styles.profileHero}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.first_name} {user.last_name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Feather name="edit-2" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemDivider]}
                  onPress={() => item.route && router.push(item.route as any)}
                  disabled={!item.route}
                  activeOpacity={item.route ? 0.7 : 1}
                >
                  <View style={styles.menuLeft}>
                    <View style={[styles.menuIconWrap, !item.route && styles.menuIconWrapDisabled]}>
                      <Feather
                        name={item.icon as any}
                        size={17}
                        color={item.route ? colors.primary : colors.textMuted}
                      />
                    </View>
                    <Text style={[styles.menuLabel, !item.route && { color: colors.textMuted }]}>
                      {item.label}
                    </Text>
                  </View>
                  <View style={styles.menuRight}>
                    {item.badge && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Feather
                      name="chevron-right"
                      size={18}
                      color={item.route ? colors.textMuted : colors.border}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => { logout(); router.replace('/'); }}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={18} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  pageTitle: { ...typography.h2, fontSize: 22 },

  profileHero: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.xs,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryTint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 22,
    color: colors.primary,
  },
  profileInfo: { flex: 1 },
  profileName: {
    ...typography.subtitle,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  profileEmail: { ...typography.bodySmall, color: colors.textMuted },
  editBtn: { padding: spacing.sm },

  section: { marginBottom: spacing.xl, paddingHorizontal: spacing.base },
  sectionTitle: {
    ...typography.label,
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.xs,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  menuItemDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryUltraLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIconWrapDisabled: { backgroundColor: colors.background },
  menuLabel: { ...typography.body, fontFamily: 'Montserrat_600SemiBold', color: colors.textPrimary },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 10,
    color: '#FFF',
  },

  logoutBtn: {
    backgroundColor: colors.errorTint,
    borderRadius: radius.lg,
    padding: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logoutText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: colors.error,
  },
});
