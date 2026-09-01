import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/Button";
import { useSermons } from "@/hooks/useChurchData";
import { pDate, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { Sermon } from "@/lib/types";
import { colors } from "@/lib/theme";

const STATUS_OPTIONS = ["準備中", "完成", "説教済み"] as const;

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useSermons();

  const existing = !isNew ? data?.find((s) => s.id === id) : undefined;

  const [title, setTitle] = useState("");
  const [scripture, setScripture] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<Sermon["status"]>("準備中");
  const [theme, setTheme] = useState("");
  const [body, setBody] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setTitle(existing.title);
      setScripture(existing.scripture);
      setDate(existing.date ?? "");
      setStatus(existing.status);
      setTheme(existing.theme);
      setBody(existing.body);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "説教を追加" : title || "説教" });
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
      聖書箇所: pRichText(scripture),
      日付: pDate(date || null),
      ステータス: pSelect(status),
      本文: pRichText(body),
      主題: pRichText(theme),
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
    Alert.alert("削除しますか？", "この説教データを削除します。", [
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
      <FormField label="タイトル" value={title} onChangeText={setTitle} placeholder="例: 恵みによる救い" />
      <FormField label="聖書箇所" value={scripture} onChangeText={setScripture} placeholder="例: エペソ2:8-9" />
      <DateField label="説教予定日" value={date} onChange={setDate} />
      <SelectField label="ステータス" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
      <FormField label="主題・ポイント" value={theme} onChangeText={setTheme} multiline placeholder="伝えたいメッセージの要点" />
      <FormField label="本文・アウトライン" value={body} onChangeText={setBody} multiline placeholder="説教原稿やアウトライン" style={{ minHeight: 220 }} />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
