import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Screen } from "@/components/Screen";
import { FormField } from "@/components/FormField";
import { Button } from "@/components/Button";
import { useChurchInfo } from "@/hooks/useChurchData";
import { pRichText, pTitle } from "@/lib/notion";
import { colors } from "@/lib/theme";

export default function ChurchInfoScreen() {
  const { data, isLoading, create, update } = useChurchInfo();
  const existing = data?.[0];

  const [vision, setVision] = useState("");
  const [history, setHistory] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isLoading && !hydrated) {
      if (existing) {
        setVision(existing.vision);
        setHistory(existing.history);
      }
      setHydrated(true);
    }
  }, [isLoading, existing, hydrated]);

  if (isLoading || !hydrated) {
    return (
      <Screen>
        <ActivityIndicator color={colors.primary} />
      </Screen>
    );
  }

  function buildProperties() {
    return {
      タイトル: pTitle("教会情報"),
      ビジョン: pRichText(vision),
      沿革: pRichText(history),
    };
  }

  async function handleSave() {
    if (existing) {
      await update.mutateAsync({ id: existing.id, properties: buildProperties() });
    } else {
      await create.mutateAsync(buildProperties());
    }
  }

  const saving = create.isPending || update.isPending;

  return (
    <Screen>
      <FormField
        label="ビジョン"
        value={vision}
        onChangeText={setVision}
        multiline
        placeholder="これからの教会の目指す方向性"
        style={{ minHeight: 140 }}
      />
      <FormField
        label="沿革"
        value={history}
        onChangeText={setHistory}
        multiline
        placeholder="教会のあゆみ（年表など）"
        style={{ minHeight: 200 }}
      />
      <Button label="保存する" onPress={handleSave} loading={saving} />
    </Screen>
  );
}
