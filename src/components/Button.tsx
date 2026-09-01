import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "@/lib/theme";

export function Button({
  label,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "danger" | "secondary";
  loading?: boolean;
  disabled?: boolean;
}) {
  const bg = {
    primary: colors.primary,
    danger: colors.danger,
    secondary: colors.surface,
  }[variant];
  const textColor = variant === "secondary" ? colors.primary : "#fff";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, opacity: pressed || disabled ? 0.6 : 1 },
        variant === "secondary" && styles.secondaryBorder,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.sm,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
  },
});
