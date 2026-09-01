import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/lib/theme";

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingVertical: spacing.xl,
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: "600",
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "center",
  },
});
