import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/Button";
import { useEvents } from "@/hooks/useChurchData";
import { pDate, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { ChurchEvent } from "@/lib/types";
import { colors } from "@/lib/theme";

const KIND_OPTIONS = ["礼拝", "祈祷会", "結婚式", "葬儀", "修養会", "その他"] as const;

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useEvents();

  const existing = !isNew ? data?.find((e) => e.id === id) : undefined;

  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ChurchEvent["kind"]>("礼拝");
  const [dateTime, setDateTime] = useState("");
  const [location, setLocation] = useState("");
  const [servers, setServers] = useState("");
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setTitle(existing.title);
      setKind(existing.kind);
      setDateTime(existing.dateTime ?? "");
      setLocation(existing.location);
      setServers(existing.servers);
      setNote(existing.note);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "行事を追加" : title || "行事" });
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
      種別: pSelect(kind),
      日時: pDate(dateTime || null),
      場所: pRichText(location),
      奉仕者: pRichText(servers),
      メモ: pRichText(note),
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
    Alert.alert("削除しますか？", "この行事を削除します。", [
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
      <FormField label="タイトル" value={title} onChangeText={setTitle} placeholder="例: 主日礼拝" />
      <SelectField label="種別" options={KIND_OPTIONS} value={kind} onChange={setKind} />
      <DateField label="日時 (時刻はYYYY-MM-DDTHH:mmで入力)" value={dateTime} onChange={setDateTime} />
      <FormField label="場所" value={location} onChangeText={setLocation} placeholder="例: 礼拝堂" />
      <FormField label="奉仕者" value={servers} onChangeText={setServers} placeholder="例: 司会:田中 / 奏楽:鈴木" />
      <FormField label="メモ" value={note} onChangeText={setNote} multiline placeholder="準備事項など" />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
