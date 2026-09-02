import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { Fab } from "@/components/Fab";
import { IconHero } from "@/components/IconHero";
import { colors, spacing } from "@/lib/theme";
import { useMembers } from "@/hooks/useChurchData";

export default function MembersListScreen() {
  const router = useRouter();
  const { data, isLoading } = useMembers();

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <IconHero icon="people" title="教会員" subtitle={`登録 ${data?.length ?? 0}名`} />
        {isLoading ? (
          <EmptyState title="読み込み中..." icon="hourglass-outline" />
        ) : !data || data.length === 0 ? (
          <EmptyState title="教会員はまだ登録されていません" hint="右下の + から追加できます" icon="people-outline" />
        ) : (
          data.map((m) => (
            <Card key={m.id} onPress={() => router.push(`/members/${m.id}`)}>
              <View style={styles.row}>
                <Avatar name={m.name} />
                <View style={styles.info}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.title}>{m.name || "(無名)"}</Text>
                    <View style={styles.badgeCol}>
                      <Badge label={m.memberType} />
                      {m.status !== "順調" ? <Badge label={m.status} tone="danger" /> : null}
                    </View>
                  </View>
                  {m.family ? <Text style={styles.meta}>{m.family}</Text> : null}
                  {m.contact ? <Text style={styles.meta}>{m.contact}</Text> : null}
                </View>
              </View>
            </Card>
          ))
        )}
      </Screen>
      <Fab onPress={() => router.push("/members/new")} />
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
  badgeCol: {
    alignItems: "flex-end",
    gap: 4,
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
