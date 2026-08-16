import React from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { Text, TextInput } from 'react-native';
import { 
  useFonts, 
  Montserrat_400Regular, 
  Montserrat_600SemiBold, 
  Montserrat_700Bold, 
  Montserrat_800ExtraBold,
  Montserrat_900Black 
} from '@expo-google-fonts/montserrat';

// Apply global font and larger size
const customTextProps = {
  style: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
  }
};
(Text as any).defaultProps = { ...((Text as any).defaultProps || {}), ...customTextProps };
(TextInput as any).defaultProps = { ...((TextInput as any).defaultProps || {}), ...customTextProps };

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black
  });

  React.useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          headerBackButtonDisplayMode: 'minimal',
          headerShadowVisible: false,
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTintColor: '#0F1923',
          headerTitleStyle: { fontFamily: 'Montserrat_700Bold', fontSize: 17 },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="products/index" options={{ title: 'Catalogue', headerShown: true }} />
        <Stack.Screen name="products/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="search" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ title: 'Checkout', headerShown: true }} />
        <Stack.Screen name="orders" options={{ headerShown: false }} />
        <Stack.Screen name="orders/[id]" options={{ title: 'Order Details', headerShown: true }} />
        <Stack.Screen name="wishlist" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: '', headerShown: true, presentation: 'modal' }} />
        <Stack.Screen name="register" options={{ title: '', headerShown: true, presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
