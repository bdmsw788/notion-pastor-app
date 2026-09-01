import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Hero } from "@/components/Hero";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { useOfferings, usePrayers } from "@/hooks/useChurchData";

type Segment = "prayer" | "offering";

export default function PrayerOfferingListScreen() {
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>("prayer");
  const prayers = usePrayers();
  const offerings = useOfferings();

  const totalAmount = (offerings.data ?? []).reduce((sum, o) => sum + (o.amount ?? 0), 0);

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Hero photo={photos.prayingHands} title="祈祷課題・献金" subtitle="とりなしと捧げ物を記録する" />
        <SegmentedControl
          options={[
            { key: "prayer", label: "祈祷課題" },
            { key: "offering", label: "献金記録" },
          ]}
          value={segment}
          onChange={setSegment}
        />

        {segment === "prayer" ? (
          prayers.isLoading ? (
            <EmptyState title="読み込み中..." />
          ) : !prayers.data || prayers.data.length === 0 ? (
            <EmptyState title="祈祷課題はまだありません" hint="右下の + から追加できます" />
          ) : (
            prayers.data.map((p) => (
              <Card key={p.id} onPress={() => router.push(`/prayer/${p.id}`)}>
                <View style={styles.rowBetween}>
                  <Text style={styles.title}>{p.title || "(無題)"}</Text>
                  <Badge label={p.status} tone={p.status === "応答済み" ? "success" : "accent"} />
                </View>
                <Text style={styles.meta}>{p.category} ・ {formatDate(p.date)}</Text>
                {p.content ? (
                  <Text style={styles.content} numberOfLines={2}>
                    {p.content}
                  </Text>
                ) : null}
              </Card>
            ))
          )
        ) : (
          <>
            <Text style={styles.totalLabel}>合計: ¥{totalAmount.toLocaleString()}</Text>
            {offerings.isLoading ? (
              <EmptyState title="読み込み中..." />
            ) : !offerings.data || offerings.data.length === 0 ? (
              <EmptyState title="献金記録はまだありません" hint="右下の + から追加できます" />
            ) : (
              offerings.data.map((o) => (
                <Card key={o.id} onPress={() => router.push(`/prayer/offering/${o.id}`)}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.title}>{o.kind}</Text>
                    <Text style={styles.amount}>¥{(o.amount ?? 0).toLocaleString()}</Text>
                  </View>
                  <Text style={styles.meta}>{formatDate(o.date)}</Text>
                  {o.note ? <Text style={styles.content}>{o.note}</Text> : null}
                </Card>
              ))
            )}
          </>
        )}
      </Screen>
      <Fab onPress={() => router.push(segment === "prayer" ? "/prayer/new" : "/prayer/offering/new")} />
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
  content: {
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
});
