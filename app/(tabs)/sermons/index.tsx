import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { RowIcon } from "@/components/RowIcon";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { Hero } from "@/components/Hero";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { sermonStatusIcon } from "@/lib/iconMap";
import { useSermons } from "@/hooks/useChurchData";

const STATUS_TONE = {
  準備中: "default",
  完成: "accent",
  説教済み: "success",
} as const;

export default function SermonsListScreen() {
  const router = useRouter();
  const { data, isLoading } = useSermons();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Hero photo={photos.openBible} title="説教" subtitle="ことばに仕え、群れを養う" />
        {isLoading ? (
          <EmptyState title="読み込み中..." icon="hourglass-outline" />
        ) : !data || data.length === 0 ? (
          <EmptyState title="説教はまだありません" hint="右下の + から追加できます" icon="book-outline" />
        ) : (
          data.map((s) => (
            <Card key={s.id} onPress={() => router.push(`/sermons/${s.id}`)}>
              <View style={styles.row}>
                <RowIcon spec={sermonStatusIcon[s.status]} />
                <View style={styles.info}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.title}>{s.title || "(無題)"}</Text>
                    <Badge label={s.status} tone={STATUS_TONE[s.status]} />
                  </View>
                  {s.scripture ? <Text style={styles.meta}>{s.scripture}</Text> : null}
                  <Text style={styles.meta}>{formatDate(s.date)}</Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push("/sermons/new")} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  info: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    flexShrink: 1,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
});
