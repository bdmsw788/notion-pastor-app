import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/Button";
import { useDuties } from "@/hooks/useChurchData";
import { pDate, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { DutyAssignment } from "@/lib/types";
import { colors } from "@/lib/theme";

const ROLE_OPTIONS = ["司会", "奏楽", "受付", "音響", "こども担当", "清掃", "その他"] as const;

export default function DutyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useDuties();

  const existing = !isNew ? data?.find((d) => d.id === id) : undefined;

  const [date, setDate] = useState("");
  const [role, setRole] = useState<DutyAssignment["role"]>("司会");
  const [person, setPerson] = useState("");
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setDate(existing.date ?? "");
      setRole(existing.role);
      setPerson(existing.person);
      setNote(existing.note);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "奉仕を追加" : "奉仕表" });
  }, [navigation, isNew]);

  if (!isNew && !hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  function buildProperties() {
    const title = `${date || "日付未設定"} ${role}`;
    return {
      タイトル: pTitle(title),
      日付: pDate(date || null),
      役割: pSelect(role),
      担当者: pRichText(person),
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
    Alert.alert("削除しますか？", "この奉仕予定を削除します。", [
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
      <DateField label="日付" value={date} onChange={setDate} />
      <SelectField label="役割" options={ROLE_OPTIONS} value={role} onChange={setRole} />
      <FormField label="担当者" value={person} onChangeText={setPerson} placeholder="例: 田中 一郎" />
      <FormField label="備考" value={note} onChangeText={setNote} multiline placeholder="任意" />

      <Button label={isNew ? "追加する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
