import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { Hero } from "@/components/Hero";
import { VerseCard } from "@/components/VerseCard";
import { colors, spacing } from "@/lib/theme";
import { formatDate, isWithinNextDays } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { useCareLogs, useEvents, usePrayers } from "@/hooks/useChurchData";

export default function HomeScreen() {
  const router = useRouter();
  const events = useEvents();
  const prayers = usePrayers();
  const careLogs = useCareLogs();

  const upcomingEvents = (events.data ?? [])
    .filter((e) => isWithinNextDays(e.dateTime, 14))
    .slice(0, 5);

  const activePrayers = (prayers.data ?? []).filter((p) => p.status === "祈り中");

  const followUps = (careLogs.data ?? [])
    .filter((c) => !c.done && c.followUpDate)
    .sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""))
    .slice(0, 5);

  return (
    <Screen>
      <Hero
        photo={photos.churchInterior}
        title="牧会手帳"
        subtitle="今日も一日、主に導かれますように"
        height={160}
      />

      <VerseCard />

      <QuickActions />

      <SectionHeader label="今後2週間の行事" onPress={() => router.push("/events")} />
      {upcomingEvents.length === 0 ? (
        <EmptyState title="予定されている行事はありません" />
      ) : (
        upcomingEvents.map((e) => (
          <Card key={e.id} onPress={() => router.push(`/events/${e.id}`)}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{e.title || "(無題)"}</Text>
              <Badge label={e.kind} />
            </View>
            <Text style={styles.cardMeta}>{formatDate(e.dateTime)}</Text>
          </Card>
        ))
      )}

      <SectionHeader
        label={`祈り中の課題 (${activePrayers.length})`}
        onPress={() => router.push("/prayer")}
      />
      {activePrayers.length === 0 ? (
        <EmptyState title="祈り中の課題はありません" />
      ) : (
        activePrayers.slice(0, 5).map((p) => (
          <Card key={p.id} onPress={() => router.push(`/prayer/${p.id}`)}>
            <Text style={styles.cardTitle}>{p.title || "(無題)"}</Text>
            <Text style={styles.cardMeta} numberOfLines={2}>
              {p.content}
            </Text>
          </Card>
        ))
      )}

      <SectionHeader label="次回フォロー予定（牧会）" onPress={() => router.push("/members")} />
      {followUps.length === 0 ? (
        <EmptyState title="フォロー予定はありません" />
      ) : (
        followUps.map((c) => (
          <Card key={c.id} onPress={() => router.push(`/members/care/${c.id}`)}>
            <View style={styles.rowBetween}>
              <Text style={styles.cardTitle}>{c.targetName || "(対象者未設定)"}</Text>
              <Badge label={c.kind} tone="accent" />
            </View>
            <Text style={styles.cardMeta}>次回: {formatDate(c.followUpDate)}</Text>
          </Card>
        ))
      )}
    </Screen>
  );
}

function SectionHeader({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {onPress ? (
        <Text style={styles.sectionLink} onPress={onPress}>
          すべて見る
        </Text>
      ) : null}
    </View>
  );
}

function QuickActions() {
  const router = useRouter();
  const actions = [
    { label: "説教を追加", href: "/sermons/new" },
    { label: "行事を追加", href: "/events/new" },
    { label: "祈祷課題を追加", href: "/prayer/new" },
    { label: "献金を記録", href: "/prayer/offering/new" },
  ] as const;

  return (
    <View style={styles.quickRow}>
      {actions.map((a) => (
        <Text key={a.href} style={styles.quickAction} onPress={() => router.push(a.href)}>
          + {a.label}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  quickAction: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  sectionLink: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    flexShrink: 1,
  },
  cardMeta: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
});
