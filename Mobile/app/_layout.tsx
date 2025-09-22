import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Login */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Abas */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/*Histórico de notificação */}
        <Stack.Screen
          name="notifications/index"
          options={{ headerShown: false }}
        />

       {/*Gerenciamento de estufas*/}
        <Stack.Screen
          name="estufas/manage"
          options={{
            presentation: 'modal',
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
