import React from "react";
import { Stack } from "expo-router";
import { colors } from "@/lib/theme";

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
      }}
    >
      <Stack.Screen name="index" options={{ title: "教会運営" }} />
      <Stack.Screen name="minutes/index" options={{ title: "議事録" }} />
      <Stack.Screen name="minutes/[id]" options={{ title: "議事録" }} />
      <Stack.Screen name="church-info" options={{ title: "教会について" }} />
    </Stack>
  );
}
