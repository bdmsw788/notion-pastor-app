import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { radius, spacing } from "@/lib/theme";

export function Hero({
  photo,
  title,
  subtitle,
  height = 140,
}: {
  photo: string;
  title: string;
  subtitle?: string;
  height?: number;
}) {
  return (
    <View style={[styles.wrap, { height }]}>
      <ImageBackground source={{ uri: photo }} style={styles.image} imageStyle={styles.imageInner}>
        <LinearGradient
          colors={["rgba(20,18,12,0.05)", "rgba(20,18,12,0.65)"]}
          style={styles.gradient}
        >
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  imageInner: {
    resizeMode: "cover",
  },
  gradient: {
    padding: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
});
