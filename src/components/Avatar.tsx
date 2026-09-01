import React from "react";
import { StyleSheet, Text, View } from "react-native";

const PALETTE = ["#3B4A6B", "#B8863B", "#4A7A56", "#8A5A6B", "#4A7A8A", "#7A5A3B"];

function colorFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

function initialsFor(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "?";
  // Japanese names: take the first character. Latin names: take initials of up to 2 words.
  const isAscii = /^[\x00-\x7F]+$/.test(trimmed);
  if (isAscii) {
    return trimmed
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("");
  }
  return trimmed[0];
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const bg = colorFor(name || "?");
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.4 }]}>{initialsFor(name)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "700",
  },
});
