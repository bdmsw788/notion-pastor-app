import type { RawNotionPage } from "./notion";
import { pCheckbox, pDate, pNumber, pRichText, pSelect, pTitle } from "./notion";
import type { DatabaseKey } from "./types";

let counter = 0;
function page(properties: Record<string, unknown>): RawNotionPage {
  counter += 1;
  return { id: `demo-${counter}`, archived: false, properties };
}

// Dates are relative to "today" so the home dashboard has something to show.
const today = new Date();
function addDays(days: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function buildDemoSeed(): Record<DatabaseKey, RawNotionPage[]> {
  return {
    sermons: [
      page({
        タイトル: pTitle("恵みによる救い"),
        聖書箇所: pRichText("エペソ2:8-9"),
        日付: pDate(addDays(3)),
        ステータス: pSelect("準備中"),
        主題: pRichText("恵みは行いによらず、神からの賜物である"),
        本文: pRichText("導入：私たちはどのようにして救われるのか。\n1. 恵みとは何か\n2. 信仰による救い\n3. 行いではなく賜物として"),
      }),
      page({
        タイトル: pTitle("良い羊飼い"),
        聖書箇所: pRichText("ヨハネ10:11-18"),
        日付: pDate(addDays(-4)),
        ステータス: pSelect("説教済み"),
        主題: pRichText("キリストは羊のために命を捨てる良い羊飼い"),
        本文: pRichText("先週の礼拝メッセージ。"),
      }),
      page({
        タイトル: pTitle("祈りの力"),
        聖書箇所: pRichText("ヤコブ5:13-16"),
        日付: pDate(addDays(10)),
        ステータス: pSelect("完成"),
        主題: pRichText("義人の祈りは大きな力がある"),
        本文: pRichText(""),
      }),
    ],
    members: [
      page({
        氏名: pTitle("田中 一郎"),
        フリガナ: pRichText("タナカ イチロウ"),
        家族: pRichText("配偶者・子2人"),
        連絡先: pRichText("090-xxxx-xxxx"),
        洗礼日: pDate("2015-04-12"),
        会員種別: pSelect("正会員"),
        状況: pSelect("順調"),
        備考: pRichText("聖歌隊リーダー"),
      }),
      page({
        氏名: pTitle("佐藤 花子"),
        フリガナ: pRichText("サトウ ハナコ"),
        家族: pRichText("独身"),
        連絡先: pRichText("080-xxxx-xxxx"),
        洗礼日: pDate("2022-12-25"),
        会員種別: pSelect("正会員"),
        状況: pSelect("順調"),
        備考: pRichText(""),
      }),
      page({
        氏名: pTitle("鈴木 恵"),
        フリガナ: pRichText("スズキ メグミ"),
        家族: pRichText("配偶者"),
        連絡先: pRichText("070-xxxx-xxxx"),
        洗礼日: pDate(null),
        会員種別: pSelect("求道者"),
        状況: pSelect("順調"),
        備考: pRichText("先月から礼拝に参加"),
      }),
      page({
        氏名: pTitle("高橋 誠"),
        フリガナ: pRichText("タカハシ マコト"),
        家族: pRichText("両親と同居"),
        連絡先: pRichText("090-yyyy-yyyy"),
        洗礼日: pDate("2010-08-15"),
        会員種別: pSelect("正会員"),
        状況: pSelect("入院中"),
        備考: pRichText("最近体調を崩している"),
      }),
    ],
    care: [
      page({
        タイトル: pTitle("高橋 誠 - " + addDays(-2)),
        対象者: pRichText("高橋 誠"),
        日付: pDate(addDays(-2)),
        種別: pSelect("病床訪問"),
        内容: pRichText("入院中の高橋さんを訪問。体調は落ち着いている。"),
        次回フォロー予定: pDate(addDays(2)),
        完了: pCheckbox(false),
      }),
      page({
        タイトル: pTitle("鈴木 恵 - " + addDays(-6)),
        対象者: pRichText("鈴木 恵"),
        日付: pDate(addDays(-6)),
        種別: pSelect("電話"),
        内容: pRichText("洗礼について相談。次回は対面で話す予定。"),
        次回フォロー予定: pDate(addDays(5)),
        完了: pCheckbox(false),
      }),
      page({
        タイトル: pTitle("田中 一郎 - " + addDays(-20)),
        対象者: pRichText("田中 一郎"),
        日付: pDate(addDays(-20)),
        種別: pSelect("訪問"),
        内容: pRichText("聖歌隊の件で打ち合わせ。"),
        次回フォロー予定: pDate(null),
        完了: pCheckbox(true),
      }),
    ],
    events: [
      page({
        タイトル: pTitle("主日礼拝"),
        種別: pSelect("礼拝"),
        日時: pDate(`${addDays(2)}T10:30`),
        場所: pRichText("礼拝堂"),
        奉仕者: pRichText("司会: 田中 / 奏楽: 佐藤"),
        メモ: pRichText(""),
      }),
      page({
        タイトル: pTitle("水曜祈祷会"),
        種別: pSelect("祈祷会"),
        日時: pDate(`${addDays(5)}T19:30`),
        場所: pRichText("集会室"),
        奉仕者: pRichText(""),
        メモ: pRichText(""),
      }),
      page({
        タイトル: pTitle("主日礼拝"),
        種別: pSelect("礼拝"),
        日時: pDate(`${addDays(9)}T10:30`),
        場所: pRichText("礼拝堂"),
        奉仕者: pRichText("司会: 鈴木 / 奏楽: 高橋"),
        メモ: pRichText("聖餐式あり"),
      }),
      page({
        タイトル: pTitle("秋の修養会"),
        種別: pSelect("修養会"),
        日時: pDate(`${addDays(30)}T09:00`),
        場所: pRichText("〇〇研修センター"),
        奉仕者: pRichText(""),
        メモ: pRichText("要事前申込"),
      }),
    ],
    prayers: [
      page({
        タイトル: pTitle("高橋さんの入院"),
        内容: pRichText("検査の結果が来週出るため、平安と癒しを祈る。"),
        カテゴリ: pSelect("健康"),
        ステータス: pSelect("祈り中"),
        日付: pDate(addDays(-2)),
      }),
      page({
        タイトル: pTitle("求道中の鈴木さん"),
        内容: pRichText("洗礼へ向けて導かれるように。"),
        カテゴリ: pSelect("個人"),
        ステータス: pSelect("祈り中"),
        日付: pDate(addDays(-6)),
      }),
      page({
        タイトル: pTitle("修養会の準備"),
        内容: pRichText("秋の修養会が守られ、参加者に恵みがあるように。"),
        カテゴリ: pSelect("教会"),
        ステータス: pSelect("祈り中"),
        日付: pDate(addDays(-1)),
      }),
      page({
        タイトル: pTitle("佐藤さんの就職"),
        内容: pRichText("新しい職場が与えられたことを感謝。"),
        カテゴリ: pSelect("個人"),
        ステータス: pSelect("応答済み"),
        日付: pDate(addDays(-30)),
      }),
    ],
    offerings: [
      page({
        タイトル: pTitle(`${addDays(-7)} 礼拝献金`),
        日付: pDate(addDays(-7)),
        種別: pSelect("礼拝献金"),
        金額: pNumber(48500),
        メモ: pRichText(""),
      }),
      page({
        タイトル: pTitle(`${addDays(-7)} 十一献金`),
        日付: pDate(addDays(-7)),
        種別: pSelect("十一献金"),
        金額: pNumber(120000),
        メモ: pRichText(""),
      }),
      page({
        タイトル: pTitle(`${addDays(-1)} 感謝献金`),
        日付: pDate(addDays(-1)),
        種別: pSelect("感謝献金"),
        金額: pNumber(15000),
        メモ: pRichText("佐藤さんより"),
      }),
    ],
    duties: [
      page({
        タイトル: pTitle(`${addDays(2)} 司会`),
        日付: pDate(addDays(2)),
        役割: pSelect("司会"),
        担当者: pRichText("田中 一郎"),
        備考: pRichText(""),
      }),
      page({
        タイトル: pTitle(`${addDays(2)} 奏楽`),
        日付: pDate(addDays(2)),
        役割: pSelect("奏楽"),
        担当者: pRichText("佐藤 花子"),
        備考: pRichText(""),
      }),
      page({
        タイトル: pTitle(`${addDays(2)} 受付`),
        日付: pDate(addDays(2)),
        役割: pSelect("受付"),
        担当者: pRichText("鈴木 恵"),
        備考: pRichText(""),
      }),
      page({
        タイトル: pTitle(`${addDays(9)} 司会`),
        日付: pDate(addDays(9)),
        役割: pSelect("司会"),
        担当者: pRichText("鈴木 恵"),
        備考: pRichText("聖餐式あり"),
      }),
      page({
        タイトル: pTitle(`${addDays(9)} 奏楽`),
        日付: pDate(addDays(9)),
        役割: pSelect("奏楽"),
        担当者: pRichText("高橋 誠"),
        備考: pRichText(""),
      }),
    ],
    minutes: [
      page({
        タイトル: pTitle("役員会"),
        日付: pDate(addDays(-3)),
        出席者: pRichText("田中 一郎、佐藤 花子、牧師"),
        内容: pRichText("秋の修養会の準備状況を確認。会場の予約は完了。プログラム案を次回までに作成。"),
        決定事項: pRichText("修養会の参加費は3000円に決定。申込締切は" + addDays(20) + "。"),
      }),
      page({
        タイトル: pTitle("礼拝委員会"),
        日付: pDate(addDays(-10)),
        出席者: pRichText("佐藤 花子、高橋 誠、牧師"),
        内容: pRichText("聖餐式の準備と奉仕表の調整について話し合った。"),
        決定事項: pRichText("聖餐式は次回礼拝で実施。"),
      }),
    ],
    churchInfo: [
      page({
        タイトル: pTitle("教会情報"),
        ビジョン: pRichText(
          "地域に根ざし、一人ひとりが神の愛を経験し、次世代へと福音を伝えていく教会を目指します。"
        ),
        沿革: pRichText(
          "1998年 開拓伝道として礼拝開始\n2005年 会堂建築\n2015年 子ども食堂ミニストリー開始\n2023年 オンライン礼拝配信開始"
        ),
      }),
    ],
  };
}
