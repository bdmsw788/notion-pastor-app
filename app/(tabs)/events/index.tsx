import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { Hero } from "@/components/Hero";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { useEvents } from "@/hooks/useChurchData";

export default function EventsListScreen() {
  const router = useRouter();
  const { data, isLoading } = useEvents();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Hero photo={photos.churchInterior} title="行事" subtitle="礼拝・祈祷会・集会の予定" />
        {isLoading ? (
          <EmptyState title="読み込み中..." />
        ) : !data || data.length === 0 ? (
          <EmptyState title="行事はまだありません" hint="右下の + から追加できます" />
        ) : (
          data.map((e) => (
            <Card key={e.id} onPress={() => router.push(`/events/${e.id}`)}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{e.title || "(無題)"}</Text>
                <Badge label={e.kind} />
              </View>
              <Text style={styles.meta}>{formatDate(e.dateTime)}</Text>
              {e.location ? <Text style={styles.meta}>{e.location}</Text> : null}
              {e.servers ? <Text style={styles.meta}>奉仕: {e.servers}</Text> : null}
            </Card>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push("/events/new")} />
    </View>
  );
}

const styles = StyleSheet.create({
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
