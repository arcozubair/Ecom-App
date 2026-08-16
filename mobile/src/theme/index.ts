/**
 * PINE Design System
 * Central token file for colors, typography, spacing, radius, and shadows.
 * Import from here instead of using hardcoded values anywhere.
 */

// ─── Colors ──────────────────────────────────────────────────────────────────
export const colors = {
  // Brand
  primary: '#137940',
  primaryDark: '#0D5C30',
  primaryLight: '#1DA857',
  primaryTint: '#EAF4EE',
  primaryUltraLight: '#F4FAF7',

  // Backgrounds
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: '#0F1923',
  textSecondary: '#4A5568',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  textBrand: '#137940',

  // Borders & Dividers
  border: '#E8ECF0',
  divider: '#F3F4F6',

  // Status
  success: '#10B981',
  successTint: '#ECFDF5',
  warning: '#F59E0B',
  warningTint: '#FFFBEB',
  error: '#EF4444',
  errorTint: '#FEF2F2',
  info: '#3B82F6',
  infoTint: '#EFF6FF',

  // Order Status
  statusPending: '#F59E0B',
  statusProcessing: '#3B82F6',
  statusCompleted: '#10B981',
  statusCancelled: '#EF4444',
  statusOnHold: '#8B5CF6',

  // Overlay
  overlay: 'rgba(0,0,0,0.4)',
  overlayLight: 'rgba(0,0,0,0.15)',
  overlayDark: 'rgba(0,0,0,0.7)',

  // Misc
  transparent: 'transparent',
  skeleton: '#E8ECF0',
  skeletonHighlight: '#F3F4F6',
};

// ─── Typography ───────────────────────────────────────────────────────────────
export const typography = {
  display: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 48,
    lineHeight: 52,
    letterSpacing: -1.5,
    color: colors.textPrimary,
  },
  h1: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  h2: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.25,
    color: colors.textPrimary,
  },
  h3: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  body: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  bodySmall: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  caption: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 0.3,
    color: colors.textMuted,
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1,
    color: colors.textPrimary,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  price: {
    fontFamily: 'Montserrat_800ExtraBold',
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.25,
    color: colors.textPrimary,
  },
  priceSmall: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary,
  },
};

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  pill: 100,
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  none: {},
  xs: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  tabBar: {
    shadowColor: '#0F1923',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
};

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_BOTTOM_IOS = 32;
export const TAB_BAR_BOTTOM_ANDROID = 24;
// Total bottom padding needed to clear the floating tab bar
export const BOTTOM_INSET = TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_IOS + 16;
