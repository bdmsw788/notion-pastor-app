import type { RawNotionPage } from "./notion";
import { rCheckbox, rDate, rNumber, rRichText, rSelect, rTitle } from "./notion";
import type {
  CareLog,
  ChurchEvent,
  Member,
  Offering,
  PrayerRequest,
  Sermon,
} from "./types";

export function toSermon(p: RawNotionPage): Sermon {
  const pr = p.properties;
  return {
    id: p.id,
    title: rTitle(pr["タイトル"]),
    scripture: rRichText(pr["聖書箇所"]),
    date: rDate(pr["日付"]),
    status: (rSelect(pr["ステータス"]) as Sermon["status"]) ?? "準備中",
    body: rRichText(pr["本文"]),
    theme: rRichText(pr["主題"]),
  };
}

export function toMember(p: RawNotionPage): Member {
  const pr = p.properties;
  return {
    id: p.id,
    name: rTitle(pr["氏名"]),
    kana: rRichText(pr["フリガナ"]),
    family: rRichText(pr["家族"]),
    contact: rRichText(pr["連絡先"]),
    baptismDate: rDate(pr["洗礼日"]),
    memberType: (rSelect(pr["会員種別"]) as Member["memberType"]) ?? "未会員",
    note: rRichText(pr["備考"]),
  };
}

export function toCareLog(p: RawNotionPage): CareLog {
  const pr = p.properties;
  return {
    id: p.id,
    title: rTitle(pr["タイトル"]),
    targetName: rRichText(pr["対象者"]),
    date: rDate(pr["日付"]),
    kind: (rSelect(pr["種別"]) as CareLog["kind"]) ?? "訪問",
    content: rRichText(pr["内容"]),
    followUpDate: rDate(pr["次回フォロー予定"]),
    done: rCheckbox(pr["完了"]),
  };
}

export function toEvent(p: RawNotionPage): ChurchEvent {
  const pr = p.properties;
  return {
    id: p.id,
    title: rTitle(pr["タイトル"]),
    kind: (rSelect(pr["種別"]) as ChurchEvent["kind"]) ?? "その他",
    dateTime: rDate(pr["日時"]),
    location: rRichText(pr["場所"]),
    servers: rRichText(pr["奉仕者"]),
    note: rRichText(pr["メモ"]),
  };
}

export function toPrayerRequest(p: RawNotionPage): PrayerRequest {
  const pr = p.properties;
  return {
    id: p.id,
    title: rTitle(pr["タイトル"]),
    content: rRichText(pr["内容"]),
    category: (rSelect(pr["カテゴリ"]) as PrayerRequest["category"]) ?? "個人",
    status: (rSelect(pr["ステータス"]) as PrayerRequest["status"]) ?? "祈り中",
    date: rDate(pr["日付"]),
  };
}

export function toOffering(p: RawNotionPage): Offering {
  const pr = p.properties;
  return {
    id: p.id,
    title: rTitle(pr["タイトル"]),
    date: rDate(pr["日付"]),
    kind: (rSelect(pr["種別"]) as Offering["kind"]) ?? "その他",
    amount: rNumber(pr["金額"]),
    note: rRichText(pr["メモ"]),
  };
}
