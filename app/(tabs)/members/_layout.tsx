import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function MembersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "教会員" }} />
      <Stack.Screen name="[id]" options={{ title: "教会員" }} />
      <Stack.Screen name="care/[id]" options={{ title: "牧会記録" }} />
    </Stack>
  );
}
