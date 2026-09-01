import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/lib/theme";

export function Badge({ label, tone = "default" }: { label: string; tone?: "default" | "accent" | "danger" | "success" }) {
  const toneColor = {
    default: colors.primary,
    accent: colors.accent,
    danger: colors.danger,
    success: colors.success,
  }[tone];

  return (
    <View style={[styles.badge, { borderColor: toneColor }]}>
      <Text style={[styles.text, { color: toneColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
