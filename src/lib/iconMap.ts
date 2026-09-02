import type { Ionicons } from "@expo/vector-icons";
import { colors } from "./theme";
import type {
  CareLog,
  ChurchEvent,
  DutyAssignment,
  Member,
  Offering,
  PrayerRequest,
  Sermon,
} from "./types";

type IconName = keyof typeof Ionicons.glyphMap;

export interface IconSpec {
  icon: IconName;
  color: string;
}

export const sermonStatusIcon: Record<Sermon["status"], IconSpec> = {
  準備中: { icon: "create-outline", color: colors.textMuted },
  完成: { icon: "checkmark-circle", color: colors.accent },
  説教済み: { icon: "book", color: colors.success },
};

export const eventKindIcon: Record<ChurchEvent["kind"], IconSpec> = {
  礼拝: { icon: "sunny", color: colors.primary },
  祈祷会: { icon: "hand-left", color: colors.accent },
  結婚式: { icon: "heart-circle", color: "#B8607F" },
  葬儀: { icon: "flower", color: "#6B7A6B" },
  修養会: { icon: "trail-sign", color: "#4A7A8A" },
  その他: { icon: "ellipsis-horizontal-circle", color: colors.textMuted },
};

export const dutyRoleIcon: Record<DutyAssignment["role"], IconSpec> = {
  司会: { icon: "mic", color: colors.primary },
  奏楽: { icon: "musical-notes", color: colors.accent },
  受付: { icon: "hand-right", color: "#4A7A8A" },
  音響: { icon: "volume-high", color: "#7A5A3B" },
  こども担当: { icon: "happy", color: "#B8607F" },
  清掃: { icon: "sparkles", color: colors.success },
  その他: { icon: "ellipsis-horizontal-circle", color: colors.textMuted },
};

export const careKindIcon: Record<CareLog["kind"], IconSpec> = {
  訪問: { icon: "home", color: colors.primary },
  電話: { icon: "call", color: colors.accent },
  病床訪問: { icon: "medkit", color: colors.danger },
  その他: { icon: "ellipsis-horizontal-circle", color: colors.textMuted },
};

export const prayerCategoryIcon: Record<PrayerRequest["category"], IconSpec> = {
  個人: { icon: "person", color: colors.primary },
  教会: { icon: "home", color: colors.accent },
  世界: { icon: "globe", color: "#4A7A8A" },
  健康: { icon: "medkit", color: colors.danger },
  その他: { icon: "ellipsis-horizontal-circle", color: colors.textMuted },
};

export const offeringKindIcon: Record<Offering["kind"], IconSpec> = {
  礼拝献金: { icon: "cash", color: colors.primary },
  十一献金: { icon: "pie-chart", color: colors.accent },
  感謝献金: { icon: "gift", color: "#B8607F" },
  特別献金: { icon: "star", color: "#C99A3B" },
  その他: { icon: "ellipsis-horizontal-circle", color: colors.textMuted },
};

export const memberStatusIcon: Record<Member["status"], IconSpec> = {
  順調: { icon: "checkmark-circle", color: colors.success },
  要フォロー: { icon: "alert-circle", color: colors.accent },
  入院中: { icon: "medkit", color: colors.danger },
  長期欠席: { icon: "moon", color: colors.textMuted },
  その他: { icon: "ellipsis-horizontal-circle", color: colors.textMuted },
};
