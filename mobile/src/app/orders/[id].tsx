import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../../api/client';
import { Feather } from '@expo/vector-icons';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await apiClient.get(`/orders/${id}`);
      return res.data;
    },
  });

  const { data: tracking, isLoading: loadingTracking } = useQuery({
    queryKey: ['tracking', id],
    queryFn: async () => {
      const res = await apiClient.get(`/shipping/track/${id}`);
      return res.data;
    },
    enabled: !!order, // only run if we successfully fetched the order
  });

  if (isLoading) return <View style={styles.center}><ActivityIndicator size="large" color="#137940" /></View>;
  if (error || !order) return <View style={styles.center}><Text style={styles.errorText}>Failed to load order details.</Text></View>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return '#3B82F6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ORDER #{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '15' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.dateText}>Placed on {new Date(order.date_created).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>

        {/* Tracking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SHIPPING STATUS</Text>
          {loadingTracking ? (
            <ActivityIndicator size="small" color="#137940" />
          ) : tracking?.tracking_data ? (
            <View style={styles.trackingCard}>
              <View style={styles.trackingRow}>
                <Feather name="truck" size={20} color="#000" />
                <View style={styles.trackingInfo}>
                  <Text style={styles.trackingStatus}>{tracking.tracking_data.track_status ? 'Shipped' : 'Processing'}</Text>
                  <Text style={styles.trackingNumber}>AWB: {tracking.tracking_data.awb_code}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.trackingCard}>
              <Text style={styles.noTrackingText}>Tracking information will appear here once your order is shipped.</Text>
            </View>
          )}
        </View>

        {/* Items Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ITEMS ({order.line_items.length})</Text>
          {order.line_items.map((item: any) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
                {item.meta_data.map((meta: any) => (
                  meta.key === 'pa_size' && <Text key={meta.id} style={styles.itemMeta}>Size: {meta.value}</Text>
                ))}
              </View>
              <Text style={styles.itemPrice}>₹{item.total}</Text>
            </View>
          ))}
        </View>

        {/* Summary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUMMARY</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{order.total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>₹{order.shipping_total}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <Text style={styles.summaryValue}>{order.payment_method_title}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>₹{order.total}</Text>
          </View>
        </View>
        
        <View style={{ padding: 20 }}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>BACK TO ORDERS</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  errorText: { color: '#EF4444', fontSize: 15 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#000', letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  statusText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  dateText: { paddingHorizontal: 20, fontSize: 13, color: '#6B7280', marginBottom: 20 },
  
  section: { padding: 20, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#000', marginBottom: 16, letterSpacing: 1 },
  
  trackingCard: { backgroundColor: '#F9FAFB', padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
  trackingRow: { flexDirection: 'row', alignItems: 'center' },
  trackingInfo: { marginLeft: 16 },
  trackingStatus: { fontSize: 15, fontWeight: '700', color: '#000', marginBottom: 4 },
  trackingNumber: { fontSize: 13, color: '#6B7280' },
  noTrackingText: { fontSize: 14, color: '#6B7280' },
  
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  itemInfo: { flex: 1, paddingRight: 16 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#000', marginBottom: 4 },
  itemMeta: { fontSize: 12, color: '#6B7280' },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#000' },
  
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: '#4B5563' },
  summaryValue: { fontSize: 14, fontWeight: '500', color: '#000' },
  totalRow: { marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#000' },
  totalLabel: { fontSize: 14, fontWeight: '800', color: '#000', letterSpacing: 1 },
  totalValue: { fontSize: 18, fontWeight: '800', color: '#000' },
  
  backBtn: { backgroundColor: '#F3F4F6', paddingVertical: 16, alignItems: 'center' },
  backBtnText: { color: '#000', fontSize: 13, fontWeight: '700', letterSpacing: 1 },
});
