import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { useCareLogs, useMembers } from "@/hooks/useChurchData";
import { pDate, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { Member } from "@/lib/types";
import { colors, spacing } from "@/lib/theme";
import { formatDate } from "@/lib/dateUtils";

const TYPE_OPTIONS = ["正会員", "準会員", "求道者", "未会員"] as const;
const STATUS_OPTIONS = ["順調", "要フォロー", "入院中", "長期欠席", "その他"] as const;

export default function MemberDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useMembers();
  const careLogs = useCareLogs();

  const existing = !isNew ? data?.find((m) => m.id === id) : undefined;

  const [name, setName] = useState("");
  const [kana, setKana] = useState("");
  const [family, setFamily] = useState("");
  const [contact, setContact] = useState("");
  const [baptismDate, setBaptismDate] = useState("");
  const [memberType, setMemberType] = useState<Member["memberType"]>("求道者");
  const [status, setStatus] = useState<Member["status"]>("順調");
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setName(existing.name);
      setKana(existing.kana);
      setFamily(existing.family);
      setContact(existing.contact);
      setBaptismDate(existing.baptismDate ?? "");
      setMemberType(existing.memberType);
      setStatus(existing.status);
      setNote(existing.note);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "教会員を追加" : name || "教会員" });
  }, [navigation, isNew, name]);

  if (!isNew && !hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  function buildProperties() {
    return {
      氏名: pTitle(name),
      フリガナ: pRichText(kana),
      家族: pRichText(family),
      連絡先: pRichText(contact),
      洗礼日: pDate(baptismDate || null),
      会員種別: pSelect(memberType),
      状況: pSelect(status),
      備考: pRichText(note),
    };
  }

  async function handleSave() {
    if (isNew) {
      await create.mutateAsync(buildProperties());
    } else {
      await update.mutateAsync({ id: id as string, properties: buildProperties() });
    }
    router.back();
  }

  function handleDelete() {
    Alert.alert("削除しますか？", "この教会員の情報を削除します。牧会記録は残ります。", [
      { text: "キャンセル", style: "cancel" },
      {
        text: "削除",
        style: "destructive",
        onPress: async () => {
          await remove.mutateAsync(id as string);
          router.back();
        },
      },
    ]);
  }

  const saving = create.isPending || update.isPending;
  const memberCareLogs = existing
    ? (careLogs.data ?? [])
        .filter((c) => c.targetName === existing.name)
        .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""))
    : [];

  return (
    <Screen>
      {!isNew ? (
        <View style={styles.avatarWrap}>
          <Avatar name={name} size={72} />
        </View>
      ) : null}
      <FormField label="氏名" value={name} onChangeText={setName} placeholder="例: 山田 太郎" />
      <FormField label="フリガナ" value={kana} onChangeText={setKana} placeholder="例: ヤマダ タロウ" />
      <SelectField label="会員種別" options={TYPE_OPTIONS} value={memberType} onChange={setMemberType} />
      <SelectField label="状況" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <FormField label="家族" value={family} onChangeText={setFamily} placeholder="例: 配偶者・子2人" />
      <FormField label="連絡先" value={contact} onChangeText={setContact} placeholder="電話番号・メールなど" />
      <DateField label="洗礼日" value={baptismDate} onChange={setBaptismDate} />
      <FormField label="備考" value={note} onChangeText={setNote} multiline placeholder="配慮事項など" />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}

      {!isNew && existing ? (
        <View style={styles.careSection}>
          <View style={styles.careHeader}>
            <Text style={styles.careHeading}>牧会記録</Text>
            <Text
              style={styles.careAdd}
              onPress={() => router.push(`/members/care/new?target=${encodeURIComponent(existing.name)}`)}
            >
              + 記録を追加
            </Text>
          </View>
          {memberCareLogs.length === 0 ? (
            <EmptyState title="牧会記録はまだありません" />
          ) : (
            memberCareLogs.map((c) => (
              <Card key={c.id} onPress={() => router.push(`/members/care/${c.id}`)}>
                <View style={styles.rowBetween}>
                  <Text style={styles.careKind}>{c.kind}</Text>
                  <Badge label={c.done ? "対応済み" : "フォロー中"} tone={c.done ? "success" : "accent"} />
                </View>
                <Text style={styles.careMeta}>{formatDate(c.date)}</Text>
                {c.content ? (
                  <Text style={styles.careContent} numberOfLines={2}>
                    {c.content}
                  </Text>
                ) : null}
              </Card>
            ))
          )}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  careSection: {
    marginTop: spacing.lg,
  },
  careHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  careHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  careAdd: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.primary,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  careKind: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  careMeta: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  careContent: {
    fontSize: 13,
    color: colors.text,
    marginTop: 4,
  },
  avatarWrap: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
});
