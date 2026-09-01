import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function SermonsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "説教" }} />
      <Stack.Screen name="[id]" options={{ title: "説教" }} />
    </Stack>
  );
}
