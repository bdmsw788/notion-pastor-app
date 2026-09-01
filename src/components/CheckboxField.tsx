import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/lib/theme";

export function CheckboxField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Pressable style={styles.row} onPress={() => onChange(!value)}>
      <View style={[styles.box, value && styles.boxChecked]}>
        {value ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.sm / 2,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  boxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  label: {
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
});
