import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { Button } from "@/components/Button";
import { useMinutes } from "@/hooks/useChurchData";
import { pDate, pRichText, pTitle } from "@/lib/notion";
import { colors } from "@/lib/theme";

export default function MinutesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useMinutes();

  const existing = !isNew ? data?.find((m) => m.id === id) : undefined;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");
  const [content, setContent] = useState("");
  const [decisions, setDecisions] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setTitle(existing.title);
      setDate(existing.date ?? "");
      setAttendees(existing.attendees);
      setContent(existing.content);
      setDecisions(existing.decisions);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "議事録を追加" : title || "議事録" });
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
      日付: pDate(date || null),
      出席者: pRichText(attendees),
      内容: pRichText(content),
      決定事項: pRichText(decisions),
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
    Alert.alert("削除しますか？", "この議事録を削除します。", [
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
      <FormField label="タイトル" value={title} onChangeText={setTitle} placeholder="例: 役員会" />
      <DateField label="日付" value={date} onChange={setDate} />
      <FormField label="出席者" value={attendees} onChangeText={setAttendees} placeholder="例: 田中、佐藤、牧師" />
      <FormField label="内容" value={content} onChangeText={setContent} multiline placeholder="議事の内容" style={{ minHeight: 160 }} />
      <FormField label="決定事項" value={decisions} onChangeText={setDecisions} multiline placeholder="決定したこと" />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
