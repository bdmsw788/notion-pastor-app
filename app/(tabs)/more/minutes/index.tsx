import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { RowIcon } from "@/components/RowIcon";
import { IconHero } from "@/components/IconHero";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { useMinutes } from "@/hooks/useChurchData";

const MINUTES_ICON = { icon: "document-text" as const, color: colors.primary };

export default function MinutesListScreen() {
  const router = useRouter();
  const { data, isLoading } = useMinutes();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <IconHero icon="document-text" title="議事録" subtitle={`記録 ${data?.length ?? 0}件`} />
        {isLoading ? (
          <EmptyState title="読み込み中..." icon="hourglass-outline" />
        ) : !data || data.length === 0 ? (
          <EmptyState title="議事録はまだありません" hint="右下の + から追加できます" icon="document-text-outline" />
        ) : (
          data.map((m) => (
            <Card key={m.id} onPress={() => router.push(`/more/minutes/${m.id}`)}>
              <View style={styles.row}>
                <RowIcon spec={MINUTES_ICON} />
                <View style={styles.info}>
                  <Text style={styles.title}>{m.title || "(無題)"}</Text>
                  <Text style={styles.meta}>{formatDate(m.date)}</Text>
                  {m.attendees ? <Text style={styles.meta}>出席: {m.attendees}</Text> : null}
                  {m.content ? (
                    <Text style={styles.content} numberOfLines={2}>
                      {m.content}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push("/more/minutes/new")} />
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
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  meta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  content: {
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
  },
});
