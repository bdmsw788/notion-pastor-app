import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { SetupGuide } from "@/components/SetupGuide";
import { colors, spacing } from "@/lib/theme";
import { useConfig } from "@/lib/ConfigContext";
import { clearToken, setDbIds, setDemoMode } from "@/lib/secureConfig";
import { emptyDbIds } from "@/lib/types";
import { DB_DEFINITIONS } from "@/lib/schemas";

export default function SettingsScreen() {
  const { dbIds, demoMode, refresh } = useConfig();
  const [resetting, setResetting] = useState(false);
  const [showReconfigure, setShowReconfigure] = useState(false);

  async function handleReset() {
    Alert.alert(
      "連携を解除しますか？",
      "保存されているNotionトークンとデータベースIDをこの端末から削除します（Notion側のデータは削除されません）。",
      [
        { text: "キャンセル", style: "cancel" },
        {
          text: "解除する",
          style: "destructive",
          onPress: async () => {
            setResetting(true);
            await clearToken();
            await setDbIds(emptyDbIds);
            await setDemoMode(false);
            await refresh();
            setResetting(false);
          },
        },
      ]
    );
  }

  async function handleExitDemo() {
    await setDemoMode(false);
    await refresh();
    setShowReconfigure(true);
  }

  if (showReconfigure) {
    return <SetupGuide />;
  }

  if (demoMode) {
    return (
      <Screen>
        <Card>
          <Text style={styles.cardTitle}>デモモードで表示中</Text>
          <Text style={styles.demoBody}>
            サンプルデータを使って動作を確認しています。実際のデータはNotionに保存されていません。
          </Text>
        </Card>
        <Button label="Notionと連携する" onPress={handleExitDemo} />
        <Text style={styles.footnote}>
          牧会手帳 v1.0 ・ すべてのデータはあなたのNotionワークスペースに保存されます
        </Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card>
        <Text style={styles.cardTitle}>連携状況</Text>
        {DB_DEFINITIONS.map((def) => (
          <View key={def.key} style={styles.row}>
            <Text style={styles.rowLabel}>{def.title}</Text>
            <Text style={dbIds[def.key] ? styles.ok : styles.ng}>
              {dbIds[def.key] ? "連携済み" : "未連携"}
            </Text>
          </View>
        ))}
      </Card>

      <Button label="データベースを作り直す / 再設定する" variant="secondary" onPress={() => setShowReconfigure(true)} />
      <Button label="連携を解除する" variant="danger" onPress={handleReset} loading={resetting} />

      <Text style={styles.footnote}>
        牧会手帳 v1.0 ・ すべてのデータはあなたのNotionワークスペースに保存されます
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  demoBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  rowLabel: {
    fontSize: 14,
    color: colors.text,
  },
  ok: {
    fontSize: 13,
    color: colors.success,
    fontWeight: "600",
  },
  ng: {
    fontSize: 13,
    color: colors.textMuted,
  },
  footnote: {
    marginTop: spacing.lg,
    textAlign: "center",
    fontSize: 12,
    color: colors.textMuted,
  },
});
