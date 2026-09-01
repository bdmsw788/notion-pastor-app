import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { DateField } from "@/components/DateField";
import { SelectField } from "@/components/SelectField";
import { Button } from "@/components/Button";
import { useOfferings } from "@/hooks/useChurchData";
import { pDate, pNumber, pRichText, pSelect, pTitle } from "@/lib/notion";
import type { Offering } from "@/lib/types";
import { colors } from "@/lib/theme";

const KIND_OPTIONS = ["礼拝献金", "十一献金", "感謝献金", "特別献金", "その他"] as const;

export default function OfferingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === "new";
  const router = useRouter();
  const navigation = useNavigation();
  const { data, create, update, remove } = useOfferings();

  const existing = !isNew ? data?.find((o) => o.id === id) : undefined;

  const [date, setDate] = useState("");
  const [kind, setKind] = useState<Offering["kind"]>("礼拝献金");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [hydrated, setHydrated] = useState(isNew);

  useEffect(() => {
    if (existing && !hydrated) {
      setDate(existing.date ?? "");
      setKind(existing.kind);
      setAmount(existing.amount != null ? String(existing.amount) : "");
      setNote(existing.note);
      setHydrated(true);
    }
  }, [existing, hydrated]);

  useEffect(() => {
    navigation.setOptions({ title: isNew ? "献金を記録" : "献金記録" });
  }, [navigation, isNew]);

  if (!isNew && !hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  function buildProperties() {
    const amountNum = amount ? Number(amount.replace(/[^0-9.-]/g, "")) : null;
    const title = `${date || "日付未設定"} ${kind}`;
    return {
      タイトル: pTitle(title),
      日付: pDate(date || null),
      種別: pSelect(kind),
      金額: pNumber(Number.isFinite(amountNum) ? amountNum : null),
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
    Alert.alert("削除しますか？", "この献金記録を削除します。", [
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
      <SelectField label="種別" options={KIND_OPTIONS} value={kind} onChange={setKind} />
      <FormField
        label="金額（円）"
        value={amount}
        onChangeText={setAmount}
        placeholder="例: 5000"
        keyboardType="number-pad"
      />
      <FormField label="メモ" value={note} onChangeText={setNote} multiline placeholder="任意" />

      <Button label={isNew ? "記録する" : "保存する"} onPress={handleSave} loading={saving} />
      {!isNew ? (
        <Button label="削除する" variant="danger" onPress={handleDelete} loading={remove.isPending} />
      ) : null}
    </Screen>
  );
}
