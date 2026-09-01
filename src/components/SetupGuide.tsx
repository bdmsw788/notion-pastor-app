import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "./Screen";
import { FormField } from "./FormField";
import { Button } from "./Button";
import { colors, radius, spacing } from "@/lib/theme";
import { createDatabase, extractNotionId } from "@/lib/notion";
import { setDbIds, setDemoMode, setToken as saveToken } from "@/lib/secureConfig";
import { DB_DEFINITIONS } from "@/lib/schemas";
import { emptyDbIds, type DbIds } from "@/lib/types";
import { useConfig } from "@/lib/ConfigContext";

type Progress = Record<string, "pending" | "creating" | "done" | "error">;

export function SetupGuide() {
  const { refresh } = useConfig();
  const [startingDemo, setStartingDemo] = useState(false);
  const [token, setTokenInput] = useState("");
  const [parentPage, setParentPage] = useState("");
  const [creating, setCreating] = useState(false);
  const [progress, setProgress] = useState<Progress>({});
  const [error, setError] = useState<string | null>(null);

  const [showManual, setShowManual] = useState(false);
  const [manualToken, setManualToken] = useState("");
  const [manualIds, setManualIds] = useState<Record<string, string>>({});
  const [savingManual, setSavingManual] = useState(false);

  async function handleAutoCreate() {
    setError(null);
    if (!token.trim()) {
      setError("Integration Token を入力してください");
      return;
    }
    let parentId: string;
    try {
      parentId = extractNotionId(parentPage);
    } catch (e: any) {
      setError(e.message ?? "親ページのURLまたはIDを入力してください");
      return;
    }

    setCreating(true);
    const newIds: DbIds = { ...emptyDbIds };
    try {
      for (const def of DB_DEFINITIONS) {
        setProgress((p) => ({ ...p, [def.key]: "creating" }));
        const id = await createDatabase(token.trim(), parentId, def.title, def.properties);
        newIds[def.key] = id;
        setProgress((p) => ({ ...p, [def.key]: "done" }));
      }
      await saveToken(token.trim());
      await setDbIds(newIds);
      await refresh();
    } catch (e: any) {
      setError(e.message ?? "データベースの作成に失敗しました");
    } finally {
      setCreating(false);
    }
  }

  async function handleManualSave() {
    setError(null);
    if (!manualToken.trim()) {
      setError("Integration Token を入力してください");
      return;
    }
    const missing = DB_DEFINITIONS.filter((d) => !manualIds[d.key]?.trim());
    if (missing.length > 0) {
      setError(`未入力のデータベースがあります: ${missing.map((m) => m.title).join(" / ")}`);
      return;
    }
    setSavingManual(true);
    try {
      const ids: DbIds = { ...emptyDbIds };
      for (const def of DB_DEFINITIONS) {
        ids[def.key] = extractNotionId(manualIds[def.key]);
      }
      await saveToken(manualToken.trim());
      await setDbIds(ids);
      await refresh();
    } catch (e: any) {
      setError(e.message ?? "保存に失敗しました");
    } finally {
      setSavingManual(false);
    }
  }

  async function handleStartDemo() {
    setStartingDemo(true);
    await setDemoMode(true);
    await refresh();
    setStartingDemo(false);
  }

  return (
    <Screen>
      <Text style={styles.heading}>Notionと連携する</Text>
      <Text style={styles.body}>
        このアプリはすべてのデータをあなたのNotionワークスペースに保存します。以下の手順で連携してください。
      </Text>

      <View style={styles.demoCard}>
        <Text style={styles.demoTitle}>まずは雰囲気を見てみたい方へ</Text>
        <Text style={styles.demoBody}>
          サンプルデータで、Notionと連携せずにすぐアプリを試せます。あとからいつでも本物のNotionと連携できます。
        </Text>
        <Button label="デモデータで試す" variant="secondary" onPress={handleStartDemo} loading={startingDemo} />
      </View>

      <View style={styles.stepList}>
        <Step n={1}>
          <Text style={styles.stepText}>
            <Text
              style={styles.link}
              onPress={() => Linking.openURL("https://www.notion.so/my-integrations")}
            >
              notion.so/my-integrations
            </Text>{" "}
            で新しいインテグレーションを作成し、Internal Integration Secret をコピーする
          </Text>
        </Step>
        <Step n={2}>
          <Text style={styles.stepText}>
            Notion側でデータベースを作成したい親ページを開き、右上「…」→「接続を追加」で①のインテグレーションを接続する
          </Text>
        </Step>
        <Step n={3}>
          <Text style={styles.stepText}>そのページのURLをコピーし、下の入力欄に貼り付ける</Text>
        </Step>
      </View>

      <FormField
        label="Integration Token"
        value={token}
        onChangeText={setTokenInput}
        placeholder="secret_xxxxxxxxxxxx"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormField
        label="親ページのURL"
        value={parentPage}
        onChangeText={setParentPage}
        placeholder="https://www.notion.so/..."
        autoCapitalize="none"
        autoCorrect={false}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {creating ? (
        <View style={styles.progressList}>
          {DB_DEFINITIONS.map((def) => (
            <Text key={def.key} style={styles.progressItem}>
              {progress[def.key] === "done" ? "✅" : progress[def.key] === "creating" ? "⏳" : "・"} {def.title}
            </Text>
          ))}
        </View>
      ) : null}

      <Button
        label="データベースを自動作成して連携"
        onPress={handleAutoCreate}
        loading={creating}
      />

      <Pressable style={styles.manualToggle} onPress={() => setShowManual((v) => !v)}>
        <Text style={styles.manualToggleText}>
          {showManual ? "▲ " : "▼ "}既存のデータベースIDを手動で入力する
        </Text>
      </Pressable>

      {showManual ? (
        <View style={styles.manualSection}>
          <FormField
            label="Integration Token"
            value={manualToken}
            onChangeText={setManualToken}
            placeholder="secret_xxxxxxxxxxxx"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {DB_DEFINITIONS.map((def) => (
            <FormField
              key={def.key}
              label={`${def.title} データベースID`}
              value={manualIds[def.key] ?? ""}
              onChangeText={(v) => setManualIds((m) => ({ ...m, [def.key]: v }))}
              placeholder="URLまたは32文字のID"
              autoCapitalize="none"
              autoCorrect={false}
            />
          ))}
          <Button
            label="この内容で保存"
            variant="secondary"
            onPress={handleManualSave}
            loading={savingManual}
          />
        </View>
      ) : null}
    </Screen>
  );
}

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{n}</Text>
      </View>
      <View style={styles.stepContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  stepList: {
    marginBottom: spacing.lg,
  },
  step: {
    flexDirection: "row",
    marginBottom: spacing.md,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  stepBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  link: {
    color: colors.primary,
    fontWeight: "700",
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  progressList: {
    marginBottom: spacing.sm,
  },
  progressItem: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 2,
  },
  manualToggle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  manualToggleText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  manualSection: {
    marginTop: spacing.sm,
  },
  demoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  demoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  demoBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
});
