import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { useMinutes } from "@/hooks/useChurchData";

export default function MinutesListScreen() {
  const router = useRouter();
  const { data, isLoading } = useMinutes();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        {isLoading ? (
          <EmptyState title="読み込み中..." />
        ) : !data || data.length === 0 ? (
          <EmptyState title="議事録はまだありません" hint="右下の + から追加できます" />
        ) : (
          data.map((m) => (
            <Card key={m.id} onPress={() => router.push(`/more/minutes/${m.id}`)}>
              <Text style={styles.title}>{m.title || "(無題)"}</Text>
              <Text style={styles.meta}>{formatDate(m.date)}</Text>
              {m.attendees ? <Text style={styles.meta}>出席: {m.attendees}</Text> : null}
              {m.content ? (
                <Text style={styles.content} numberOfLines={2}>
                  {m.content}
                </Text>
              ) : null}
            </Card>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push("/more/minutes/new")} />
    </View>
  );
}

const styles = StyleSheet.create({
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
