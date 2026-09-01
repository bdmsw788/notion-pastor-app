export type DatabaseKey =
  | "sermons"
  | "members"
  | "care"
  | "events"
  | "duties"
  | "prayers"
  | "offerings"
  | "minutes"
  | "churchInfo";

export interface DbIds {
  sermons: string | null;
  members: string | null;
  care: string | null;
  events: string | null;
  duties: string | null;
  prayers: string | null;
  offerings: string | null;
  minutes: string | null;
  churchInfo: string | null;
}

export const emptyDbIds: DbIds = {
  sermons: null,
  members: null,
  care: null,
  events: null,
  duties: null,
  prayers: null,
  offerings: null,
  minutes: null,
  churchInfo: null,
};

export interface NotionPage {
  id: string;
  archived: boolean;
  properties: Record<string, unknown>;
}

export interface Sermon {
  id: string;
  title: string;
  scripture: string;
  date: string | null;
  status: "準備中" | "完成" | "説教済み";
  body: string;
  theme: string;
}

export interface Member {
  id: string;
  name: string;
  kana: string;
  family: string;
  contact: string;
  baptismDate: string | null;
  memberType: "正会員" | "準会員" | "求道者" | "未会員";
  status: "順調" | "要フォロー" | "入院中" | "長期欠席" | "その他";
  note: string;
}

export interface CareLog {
  id: string;
  title: string;
  targetName: string;
  date: string | null;
  kind: "訪問" | "電話" | "病床訪問" | "その他";
  content: string;
  followUpDate: string | null;
  done: boolean;
}

export interface ChurchEvent {
  id: string;
  title: string;
  kind: "礼拝" | "祈祷会" | "結婚式" | "葬儀" | "修養会" | "その他";
  dateTime: string | null;
  location: string;
  servers: string;
  note: string;
}

export interface DutyAssignment {
  id: string;
  date: string | null;
  role: "司会" | "奏楽" | "受付" | "音響" | "こども担当" | "清掃" | "その他";
  person: string;
  note: string;
}

export interface PrayerRequest {
  id: string;
  title: string;
  content: string;
  category: "個人" | "教会" | "世界" | "健康" | "その他";
  status: "祈り中" | "応答済み";
  date: string | null;
}

export interface Offering {
  id: string;
  title: string;
  date: string | null;
  kind: "礼拝献金" | "十一献金" | "感謝献金" | "特別献金" | "その他";
  amount: number | null;
  note: string;
}

export interface MeetingMinutes {
  id: string;
  title: string;
  date: string | null;
  attendees: string;
  content: string;
  decisions: string;
}

export interface ChurchInfo {
  id: string;
  vision: string;
  history: string;
}
