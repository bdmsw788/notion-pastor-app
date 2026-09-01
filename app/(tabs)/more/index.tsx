import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { IconHero } from "@/components/IconHero";
import { colors, spacing } from "@/lib/theme";

export default function MoreMenuScreen() {
  const router = useRouter();

  const items = [
    {
      icon: "document-text" as const,
      title: "議事録",
      subtitle: "役員会・各委員会の記録",
      onPress: () => router.push("/more/minutes"),
    },
    {
      icon: "book" as const,
      title: "教会について",
      subtitle: "ビジョンと沿革",
      onPress: () => router.push("/more/church-info"),
    },
  ];

  return (
    <Screen>
      <IconHero icon="grid" title="教会運営" subtitle="議事録・教会情報など" />
      {items.map((item) => (
        <Card key={item.title} onPress={item.onPress}>
          <View style={styles.row}>
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
