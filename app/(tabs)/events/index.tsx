import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { Hero } from "@/components/Hero";
import { SegmentedControl } from "@/components/SegmentedControl";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { useDuties, useEvents } from "@/hooks/useChurchData";

type Segment = "events" | "duties";

export default function EventsListScreen() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>("events");
  const events = useEvents();
  const duties = useDuties();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Hero photo={photos.churchInterior} title="行事" subtitle="礼拝・祈祷会・集会の予定" />
        <SegmentedControl
          options={[
            { key: "events", label: "行事" },
            { key: "duties", label: "奉仕表" },
          ]}
          value={segment}
          onChange={setSegment}
        />

        {segment === "events" ? (
          events.isLoading ? (
            <EmptyState title="読み込み中..." />
          ) : !events.data || events.data.length === 0 ? (
            <EmptyState title="行事はまだありません" hint="右下の + から追加できます" />
          ) : (
            events.data.map((e) => (
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
          )
        ) : duties.isLoading ? (
          <EmptyState title="読み込み中..." />
        ) : !duties.data || duties.data.length === 0 ? (
          <EmptyState title="奉仕表はまだありません" hint="右下の + から追加できます" />
        ) : (
          duties.data.map((d) => (
            <Card key={d.id} onPress={() => router.push(`/events/duty/${d.id}`)}>
              <View style={styles.rowBetween}>
                <Text style={styles.title}>{d.person || "(未定)"}</Text>
                <Badge label={d.role} tone="accent" />
              </View>
              <Text style={styles.meta}>{formatDate(d.date)}</Text>
              {d.note ? <Text style={styles.meta}>{d.note}</Text> : null}
            </Card>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push(segment === "events" ? "/events/new" : "/events/duty/new")} />
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
