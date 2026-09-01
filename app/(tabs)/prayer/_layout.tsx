import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function PrayerLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "祈祷課題・献金" }} />
      <Stack.Screen name="[id]" options={{ title: "祈祷課題" }} />
      <Stack.Screen name="offering/[id]" options={{ title: "献金記録" }} />
    </Stack>
  );
}
