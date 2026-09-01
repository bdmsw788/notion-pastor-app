import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { CheckboxField } from "@/components/CheckboxField";
import { Button } from "@/components/Button";
import { useCareLogs } from "@/hooks/useChurchData";
import { pCheckbox, pDate, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { CareLog } from "@/lib/types";
import { colors } from "@/lib/theme";

const KIND_OPTIONS = ["訪問", "電話", "病床訪問", "その他"] as const;

export default function CareLogDetailScreen() {
  const { id, target } = useLocalSearchParams<{ id: string; target?: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useCareLogs();

  const existing = !isNew ? data?.find((c) => c.id === id) : undefined;

  const [targetName, setTargetName] = useState(target ? decodeURIComponent(target) : "");
  const [date, setDate] = useState("");
  const [kind, setKind] = useState<CareLog["kind"]>("訪問");
  const [content, setContent] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [done, setDone] = useState(false);
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setTargetName(existing.targetName);
      setDate(existing.date ?? "");
      setKind(existing.kind);
      setContent(existing.content);
      setFollowUpDate(existing.followUpDate ?? "");
      setDone(existing.done);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "牧会記録を追加" : "牧会記録" });
  }, [navigation, isNew]);

  if (!isNew && !hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  function buildProperties() {
    const title = `${targetName || "対象者未設定"} - ${date || "日付未設定"}`;
    return {
      タイトル: pTitle(title),
      対象者: pRichText(targetName),
      日付: pDate(date || null),
      種別: pSelect(kind),
      内容: pRichText(content),
      次回フォロー予定: pDate(followUpDate || null),
      完了: pCheckbox(done),
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
    Alert.alert("削除しますか？", "この牧会記録を削除します。", [
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

  return (
    <Screen>
      <FormField label="対象者" value={targetName} onChangeText={setTargetName} placeholder="教会員の氏名" />
      <DateField label="日付" value={date} onChange={setDate} />
      <SelectField label="種別" options={KIND_OPTIONS} value={kind} onChange={setKind} />
      <FormField label="内容" value={content} onChangeText={setContent} multiline placeholder="訪問・電話などの内容" />
      <DateField label="次回フォロー予定" value={followUpDate} onChange={setFollowUpDate} />
      <CheckboxField label="対応済み" value={done} onChange={setDone} />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
