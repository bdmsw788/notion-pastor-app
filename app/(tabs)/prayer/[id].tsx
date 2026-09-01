import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/Button";
import { usePrayers } from "@/hooks/useChurchData";
import { pDate, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { PrayerRequest } from "@/lib/types";
import { colors } from "@/lib/theme";

const CATEGORY_OPTIONS = ["個人", "教会", "世界", "健康", "その他"] as const;
const STATUS_OPTIONS = ["祈り中", "応答済み"] as const;

export default function PrayerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = usePrayers();

  const existing = !isNew ? data?.find((p) => p.id === id) : undefined;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PrayerRequest["category"]>("個人");
  const [status, setStatus] = useState<PrayerRequest["status"]>("祈り中");
  const [date, setDate] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setTitle(existing.title);
      setContent(existing.content);
      setCategory(existing.category);
      setStatus(existing.status);
      setDate(existing.date ?? "");
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "祈祷課題を追加" : title || "祈祷課題" });
  }, [navigation, isNew, title]);

  if (!isNew && !hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  function buildProperties() {
    return {
      タイトル: pTitle(title),
      内容: pRichText(content),
      カテゴリ: pSelect(category),
      ステータス: pSelect(status),
      日付: pDate(date || null),
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
    Alert.alert("削除しますか？", "この祈祷課題を削除します。", [
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
      <FormField label="タイトル（誰の課題か）" value={title} onChangeText={setTitle} placeholder="例: 田中さんの通院" />
      <FormField label="内容" value={content} onChangeText={setContent} multiline placeholder="祈祷課題の内容" />
      <SelectField label="カテゴリ" options={CATEGORY_OPTIONS} value={category} onChange={setCategory} />
      <SelectField label="ステータス" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <DateField label="日付" value={date} onChange={setDate} />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
