import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

function TabBarIcon({ isFocused, routeName, label }: { isFocused: boolean, routeName: string, label: string }) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      scale.value = withSequence(
        withSpring(0.8, { damping: 10, stiffness: 400 }),
        withSpring(1.2, { damping: 10, stiffness: 400 }),
        withSpring(1, { damping: 12, stiffness: 300 })
      );
      translateY.value = withSpring(-4, { damping: 12, stiffness: 300 });
    } else {
      translateY.value = withSpring(0, { damping: 12, stiffness: 300 });
    }
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
    };
  });

  const getIconName = () => {
    switch (routeName) {
      case 'index': return 'home';
      case 'categories': return 'grid';
      case 'cart': return 'shopping-bag';
      case 'profile': return 'user';
      default: return 'circle';
    }
  };

  return (
    <View style={styles.iconContainer}>
      <Animated.View style={animatedIconStyle}>
        <Feather 
          name={getIconName() as any} 
          size={22} 
          color={isFocused ? '#137940' : '#9CA3AF'} 
        />
      </Animated.View>
      {isFocused && (
        <Animated.Text style={styles.labelActive}>
          {label}
        </Animated.Text>
      )}
    </View>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.pillContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={1}
            >
              <TabBarIcon isFocused={isFocused} routeName={route.name} label={label as string} />
              
              {route.name === 'cart' && options.tabBarBadge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{options.tabBarBadge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 100,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '100%',
    height: 64,
    borderRadius: 32,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  labelActive: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: '#137940',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 16,
    backgroundColor: '#137940',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontFamily: 'Montserrat_800ExtraBold',
  }
});
