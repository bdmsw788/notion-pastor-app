import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { IconSpec } from "@/lib/iconMap";

export function RowIcon({ spec, size = 40 }: { spec: IconSpec; size?: number }) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: `${spec.color}1F` },
      ]}
    >
      <Ionicons name={spec.icon} size={size * 0.5} color={spec.color} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
});
