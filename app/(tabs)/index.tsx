import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Avatar } from "@/components/Avatar";
import { RowIcon } from "@/components/RowIcon";
import { EmptyState } from "@/components/EmptyState";
import { Hero } from "@/components/Hero";
import { VerseCard } from "@/components/VerseCard";
import { colors, spacing } from "@/lib/theme";
import { formatDate, isWithinNextDays } from "@/lib/dateUtils";
import { photos } from "@/lib/photos";
import { dutyRoleIcon, eventKindIcon, prayerCategoryIcon } from "@/lib/iconMap";
import { useCareLogs, useDuties, useEvents, useMembers, usePrayers, useSermons } from "@/hooks/useChurchData";

export default function HomeScreen() {
  const router = useRouter();
  const events = useEvents();
  const duties = useDuties();
  const prayers = usePrayers();
  const careLogs = useCareLogs();
  const members = useMembers();
  const sermons = useSermons();

  const upcomingEvents = (events.data ?? [])
    .filter((e) => isWithinNextDays(e.dateTime, 14))
    .slice(0, 5);

  const upcomingDuties = (duties.data ?? [])
    .filter((d) => isWithinNextDays(d.date, 14))
    .slice(0, 5);

  const activePrayers = (prayers.data ?? []).filter((p) => p.status === "祈り中");

  const followUps = (careLogs.data ?? [])
    .filter((c) => !c.done && c.followUpDate)
    .sort((a, b) => (a.followUpDate ?? "").localeCompare(b.followUpDate ?? ""))
    .slice(0, 5);

  const attentionMembers = (members.data ?? []).filter((m) => m.status !== "順調").slice(0, 5);

  const preparingSermons = (sermons.data ?? []).filter((s) => s.status !== "説教済み").length;

  const stats = [
    { icon: "book" as const, label: "説教準備中", value: preparingSermons, color: colors.primary, href: "/sermons" },
    { icon: "people" as const, label: "教会員", value: members.data?.length ?? 0, color: colors.accent, href: "/members" },
    { icon: "calendar" as const, label: "今後の行事", value: upcomingEvents.length, color: "#4A7A8A", href: "/events" },
    { icon: "hand-left" as const, label: "祈り中", value: activePrayers.length, color: colors.danger, href: "/prayer" },
  ] as const;

  return (
    <Screen>
      <Hero
        photo={photos.churchInterior}
        title="牧会手帳"
        subtitle="今日も一日、主に導かれますように"
        height={160}
      />

      <VerseCard />

      <View style={styles.statsRow}>
        {stats.map((s) => (
          <Card key={s.label} onPress={() => router.push(s.href)} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${s.color}1F` }]}>
              <Ionicons name={s.icon} size={18} color={s.color} />
            </View>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </Card>
        ))}
      </View>

      <QuickActions />

      <SectionHeader label="今後2週間の行事" onPress={() => router.push("/events")} />
      {upcomingEvents.length === 0 ? (
        <EmptyState title="予定されている行事はありません" icon="calendar-outline" />
      ) : (
        upcomingEvents.map((e) => (
          <Card key={e.id} onPress={() => router.push(`/events/${e.id}`)}>
            <View style={styles.row}>
              <RowIcon spec={eventKindIcon[e.kind]} size={32} />
              <View style={styles.info}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>{e.title || "(無題)"}</Text>
                  <Badge label={e.kind} />
                </View>
                <Text style={styles.cardMeta}>{formatDate(e.dateTime)}</Text>
              </View>
            </View>
          </Card>
        ))
      )}

      <SectionHeader label="今後の奉仕予定" onPress={() => router.push("/events")} />
      {upcomingDuties.length === 0 ? (
        <EmptyState title="予定されている奉仕はありません" icon="people-outline" />
      ) : (
        upcomingDuties.map((d) => (
          <Card key={d.id} onPress={() => router.push(`/events/duty/${d.id}`)}>
            <View style={styles.row}>
              <RowIcon spec={dutyRoleIcon[d.role]} size={32} />
              <View style={styles.info}>
                <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>{d.person || "(未定)"}</Text>
                  <Badge label={d.role} tone="accent" />
                </View>
                <Text style={styles.cardMeta}>{formatDate(d.date)}</Text>
              </View>
            </View>
          </Card>
        ))
      )}

      <SectionHeader
        label={`祈り中の課題 (${activePrayers.length})`}
        onPress={() => router.push("/prayer")}
      />
      {activePrayers.length === 0 ? (
        <EmptyState title="祈り中の課題はありません" icon="hand-left-outline" />
      ) : (
        activePrayers.slice(0, 5).map((p) => (
          <Card key={p.id} onPress={() => router.push(`/prayer/${p.id}`)}>
            <View style={styles.row}>
              <RowIcon spec={prayerCategoryIcon[p.category]} size={32} />
              <View style={styles.info}>
                <Text style={styles.cardTitle}>{p.title || "(無題)"}</Text>
                <Text style={styles.cardMeta} numberOfLines={2}>
                  {p.content}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}

      <SectionHeader label="次回フォロー予定（牧会）" onPress={() => router.push("/members")} />
      {followUps.length === 0 ? (
        <EmptyState title="フォロー予定はありません" icon="chatbubbles-outline" />
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

      <SectionHeader label="要フォローの教会員" onPress={() => router.push("/members")} />
      {attentionMembers.length === 0 ? (
        <EmptyState title="現在、特に気にかける教会員はいません" icon="happy-outline" />
      ) : (
        attentionMembers.map((m) => (
          <Card key={m.id} onPress={() => router.push(`/members/${m.id}`)}>
            <View style={styles.memberRow}>
              <Avatar name={m.name} size={36} />
              <View style={styles.memberInfo}>
                <Text style={styles.cardTitle}>{m.name || "(無名)"}</Text>
                {m.note ? (
                  <Text style={styles.cardMeta} numberOfLines={1}>
                    {m.note}
                  </Text>
                ) : null}
              </View>
              <Badge label={m.status} tone="danger" />
            </View>
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
    { label: "奉仕を追加", href: "/events/duty/new" },
    { label: "祈祷課題を追加", href: "/prayer/new" },
    { label: "献金を記録", href: "/prayer/offering/new" },
    { label: "議事録を追加", href: "/more/minutes/new" },
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
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "flex-start",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
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
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  memberInfo: {
    flex: 1,
  },
});
