import type { DatabaseKey } from "./types";

export interface DbDefinition {
  key: DatabaseKey;
  title: string;
  properties: Record<string, unknown>;
}

function selectProp(options: string[]) {
  return { select: { options: options.map((name) => ({ name })) } };
}

export const DB_DEFINITIONS: DbDefinition[] = [
  {
    key: "sermons",
    title: "説教",
    properties: {
      タイトル: { title: {} },
      聖書箇所: { rich_text: {} },
      日付: { date: {} },
      ステータス: selectProp(["準備中", "完成", "説教済み"]),
      本文: { rich_text: {} },
      主題: { rich_text: {} },
    },
  },
  {
    key: "members",
    title: "教会員",
    properties: {
      氏名: { title: {} },
      フリガナ: { rich_text: {} },
      家族: { rich_text: {} },
      連絡先: { rich_text: {} },
      洗礼日: { date: {} },
      会員種別: selectProp(["正会員", "準会員", "求道者", "未会員"]),
      備考: { rich_text: {} },
    },
  },
  {
    key: "care",
    title: "牧会記録",
    properties: {
      タイトル: { title: {} },
      対象者: { rich_text: {} },
      日付: { date: {} },
      種別: selectProp(["訪問", "電話", "病床訪問", "その他"]),
      内容: { rich_text: {} },
      次回フォロー予定: { date: {} },
      完了: { checkbox: {} },
    },
  },
  {
    key: "events",
    title: "行事",
    properties: {
      タイトル: { title: {} },
      種別: selectProp(["礼拝", "祈祷会", "結婚式", "葬儀", "修養会", "その他"]),
      日時: { date: {} },
      場所: { rich_text: {} },
      奉仕者: { rich_text: {} },
      メモ: { rich_text: {} },
    },
  },
  {
    key: "prayers",
    title: "祈祷課題",
    properties: {
      タイトル: { title: {} },
      内容: { rich_text: {} },
      カテゴリ: selectProp(["個人", "教会", "世界", "健康", "その他"]),
      ステータス: selectProp(["祈り中", "応答済み"]),
      日付: { date: {} },
    },
  },
  {
    key: "offerings",
    title: "献金記録",
    properties: {
      タイトル: { title: {} },
      日付: { date: {} },
      種別: selectProp(["礼拝献金", "十一献金", "感謝献金", "特別献金", "その他"]),
      金額: { number: {} },
      メモ: { rich_text: {} },
    },
  },
];
