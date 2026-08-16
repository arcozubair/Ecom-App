import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useCartStore } from '../../store/useCartStore';
import { CustomTabBar } from '../../components/CustomTabBar';

export default function TabsLayout() {
  const { items } = useCartStore();

  return (
    <Tabs
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#137940',
        tabBarInactiveTintColor: '#9CA3AF',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color }) => <Feather name="grid" size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Bag',
          tabBarIcon: ({ color }) => <Feather name="shopping-bag" size={20} color={color} />,
          tabBarBadge: items.length > 0 ? items.length : undefined,
          tabBarBadgeStyle: { backgroundColor: '#137940', fontSize: 10 },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
