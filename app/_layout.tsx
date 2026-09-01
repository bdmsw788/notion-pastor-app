import React from "react";
import { ActivityIndicator, View } from "react-native";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { ConfigProvider, useConfig } from "@/lib/ConfigContext";
import { SetupGuide } from "@/components/SetupGuide";
import { colors } from "@/lib/theme";

const queryClient = new QueryClient();

function Gate() {
  const { loading, isConfigured } = useConfig();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.bg }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!isConfigured) {
    return <SetupGuide />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "設定", presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <StatusBar style="dark" />
          <Gate />
        </ConfigProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
