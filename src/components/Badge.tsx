import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/lib/theme";

export function Badge({
  label,
  tone = "default",
  color,
}: {
  label: string;
  tone?: "default" | "accent" | "danger" | "success";
  color?: string;
}) {
  const toneColor =
    color ??
    {
      default: colors.primary,
      accent: colors.accent,
      danger: colors.danger,
      success: colors.success,
    }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: `${toneColor}1F` }]}>
      <Text style={[styles.text, { color: toneColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});
