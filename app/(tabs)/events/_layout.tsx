import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "行事" }} />
      <Stack.Screen name="[id]" options={{ title: "行事" }} />
    </Stack>
  );
}
