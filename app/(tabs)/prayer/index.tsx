import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { RowIcon } from "@/components/RowIcon";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Hero } from "@/components/Hero";
import { colors, radius, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { offeringKindIcon, prayerCategoryIcon } from "@/lib/iconMap";
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
            <EmptyState title="読み込み中..." icon="hourglass-outline" />
          ) : !prayers.data || prayers.data.length === 0 ? (
            <EmptyState title="祈祷課題はまだありません" hint="右下の + から追加できます" icon="hand-left-outline" />
          ) : (
            prayers.data.map((p) => (
              <Card key={p.id} onPress={() => router.push(`/prayer/${p.id}`)}>
                <View style={styles.row}>
                  <RowIcon spec={prayerCategoryIcon[p.category]} />
                  <View style={styles.info}>
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
                  </View>
                </View>
              </Card>
            ))
          )
        ) : (
          <>
            <View style={styles.totalCard}>
              <Ionicons name="wallet" size={22} color={colors.accent} />
              <View>
                <Text style={styles.totalLabel}>合計</Text>
                <Text style={styles.totalAmount}>¥{totalAmount.toLocaleString()}</Text>
              </View>
            </View>
            {offerings.isLoading ? (
              <EmptyState title="読み込み中..." icon="hourglass-outline" />
            ) : !offerings.data || offerings.data.length === 0 ? (
              <EmptyState title="献金記録はまだありません" hint="右下の + から追加できます" icon="cash-outline" />
            ) : (
              offerings.data.map((o) => (
                <Card key={o.id} onPress={() => router.push(`/prayer/offering/${o.id}`)}>
                  <View style={styles.row}>
                    <RowIcon spec={offeringKindIcon[o.kind]} />
                    <View style={styles.info}>
                      <View style={styles.rowBetween}>
                        <Text style={styles.title}>{o.kind}</Text>
                        <Text style={styles.amount}>¥{(o.amount ?? 0).toLocaleString()}</Text>
                      </View>
                      <Text style={styles.meta}>{formatDate(o.date)}</Text>
                      {o.note ? <Text style={styles.content}>{o.note}</Text> : null}
                    </View>
                  </View>
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
  totalCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "#FBF3E3",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  totalLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
});
