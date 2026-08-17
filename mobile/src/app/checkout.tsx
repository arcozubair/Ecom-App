import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Feather } from '@expo/vector-icons';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { colors, typography, spacing, radius, shadows } from '../theme';

function FormField({
  label, value, onChangeText, placeholder, keyboardType, autoCapitalize, secureTextEntry,
}: any) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fieldStyles.wrap}>
      <Text style={fieldStyles.label}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, focused && fieldStyles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: { marginBottom: spacing.base },
  label: { ...typography.label, fontSize: 11, color: colors.textMuted, marginBottom: spacing.xs },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.base,
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputFocused: { borderColor: colors.primary, backgroundColor: colors.primaryUltraLight },
});

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    address: user?.billing?.address_1 || '',
    city: user?.billing?.city || '',
    state: user?.billing?.state || '',
    postcode: user?.billing?.postcode || '',
    email: user?.email || '',
    phone: user?.billing?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async () => {
    if (!shippingInfo.firstName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.email) {
      Alert.alert('Missing Details', 'Please fill in all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      const orderData = {
        customer_id: user?.id || 0,
        payment_method: paymentMethod,
        payment_method_title: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment',
        set_paid: false,
        billing: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          address_1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postcode: shippingInfo.postcode,
          country: 'IN',
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        },
        shipping: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          address_1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          postcode: shippingInfo.postcode,
          country: 'IN',
        },
        line_items: items.map((item: any) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };
      const response = await apiClient.post('/orders', orderData);
      clearCart();
      
      // Navigate to beautiful success screen instead of Alert
      router.replace({ pathname: '/order-success', params: { orderId: response.data.id } } as any);
      
    } catch (error: any) {
      Alert.alert('Something went wrong', error.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const total = getTotalPrice();
  const update = (key: string) => (text: string) => setShippingInfo(prev => ({ ...prev, [key]: text }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {items.map((item: any, idx: number) => (
              <View key={idx} style={styles.orderItem}>
                <Text style={styles.orderItemName} numberOfLines={1}>
                  {item.quantity}× {item.product.name}
                  {item.size && item.size !== 'Default' ? ` (${item.size})` : ''}
                </Text>
                <Text style={styles.orderItemPrice}>
                  ₹{(parseFloat(item.product.sale_price || item.product.price || '0') * item.quantity).toFixed(0)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(0)}</Text>
            </View>
          </View>

          {/* Delivery Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FormField label="First Name *" value={shippingInfo.firstName} onChangeText={update('firstName')} placeholder="John" />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label="Last Name" value={shippingInfo.lastName} onChangeText={update('lastName')} placeholder="Doe" />
              </View>
            </View>
            <FormField label="Email Address *" value={shippingInfo.email} onChangeText={update('email')} placeholder="john@example.com" keyboardType="email-address" autoCapitalize="none" />
            <FormField label="Phone Number" value={shippingInfo.phone} onChangeText={update('phone')} placeholder="9876543210" keyboardType="phone-pad" />
            <FormField label="Street Address *" value={shippingInfo.address} onChangeText={update('address')} placeholder="123 Main Street" />
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <FormField label="City *" value={shippingInfo.city} onChangeText={update('city')} placeholder="Mumbai" />
              </View>
              <View style={{ flex: 1 }}>
                <FormField label="State" value={shippingInfo.state} onChangeText={update('state')} placeholder="Maharashtra" />
              </View>
            </View>
            <FormField label="PIN Code" value={shippingInfo.postcode} onChangeText={update('postcode')} placeholder="400001" keyboardType="number-pad" />
          </View>

          {/* Payment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity
              style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]}
              onPress={() => setPaymentMethod('cod')}
            >
              <View style={[styles.radio, paymentMethod === 'cod' && styles.radioActive]}>
                {paymentMethod === 'cod' && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.paymentLabel}>Cash on Delivery</Text>
                <Text style={styles.paymentSub}>Pay when your order arrives</Text>
              </View>
              <Feather name="truck" size={20} color={paymentMethod === 'cod' ? colors.primary : colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentOption, styles.paymentOptionDisabled]}
              disabled
            >
              <View style={styles.radio}>
                <View style={styles.radioDisabled} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.paymentLabel, { color: colors.textMuted }]}>Online Payment</Text>
                <Text style={styles.paymentSub}>Coming soon via Razorpay</Text>
              </View>
              <Feather name="credit-card" size={20} color={colors.border} />
            </TouchableOpacity>
          </View>

          {/* Place Order */}
          <PrimaryButton
            label={`Place Order · ₹${total.toFixed(0)}`}
            onPress={handlePlaceOrder}
            loading={isLoading}
            size="lg"
            style={styles.placeOrderBtn}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.base, paddingBottom: 40 },

  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.base,
    ...shadows.xs,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    marginBottom: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  // Order Summary
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  orderItemName: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, marginRight: spacing.md },
  orderItemPrice: { ...typography.bodySmall, fontFamily: 'Montserrat_700Bold', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: spacing.md },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...typography.h3, fontSize: 16 },
  totalValue: {
    fontFamily: 'Montserrat_900Black',
    fontSize: 22,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },

  row: { flexDirection: 'row', gap: spacing.md },

  // Payment
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  paymentOptionActive: { borderColor: colors.primary, backgroundColor: colors.primaryUltraLight },
  paymentOptionDisabled: { opacity: 0.5 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  radioDisabled: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.border },
  paymentLabel: { ...typography.body, fontFamily: 'Montserrat_600SemiBold', color: colors.textPrimary },
  paymentSub: { ...typography.caption, color: colors.textMuted, marginTop: 2 },

  placeOrderBtn: { borderRadius: radius.pill, marginTop: spacing.sm, marginBottom: spacing.xl },
});
