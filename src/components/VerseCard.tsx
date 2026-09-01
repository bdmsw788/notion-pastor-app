import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/lib/theme";
import { verseOfTheDay } from "@/lib/verses";

export function VerseCard() {
  const verse = verseOfTheDay();
  return (
    <View style={styles.wrap}>
      <Ionicons name="sparkles" size={18} color={colors.accent} style={styles.icon} />
      <View style={styles.textWrap}>
        <Text style={styles.label}>今日のみことば</Text>
        <Text style={styles.text}>{verse.text}</Text>
        <Text style={styles.reference}>{verse.reference}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    backgroundColor: "#FBF3E3",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  icon: {
    marginTop: 2,
  },
  textWrap: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    fontWeight: "600",
  },
  reference: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
