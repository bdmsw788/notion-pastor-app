import { useCollection } from "./useCollection";
import {
  toCareLog,
  toChurchInfo,
  toDuty,
  toEvent,
  toMember,
  toMinutes,
  toOffering,
  toPrayerRequest,
  toSermon,
} from "@/lib/mappers";

export function useSermons() {
  return useCollection("sermons", toSermon, [{ property: "日付", direction: "descending" }]);
}

export function useMembers() {
  return useCollection("members", toMember, [{ property: "氏名", direction: "ascending" }]);
}

export function useCareLogs() {
  return useCollection("care", toCareLog, [{ property: "日付", direction: "descending" }]);
}

export function useEvents() {
  return useCollection("events", toEvent, [{ property: "日時", direction: "ascending" }]);
}

export function useDuties() {
  return useCollection("duties", toDuty, [{ property: "日付", direction: "ascending" }]);
}

export function usePrayers() {
  return useCollection("prayers", toPrayerRequest, [{ property: "日付", direction: "descending" }]);
}

export function useOfferings() {
  return useCollection("offerings", toOffering, [{ property: "日付", direction: "descending" }]);
}

export function useMinutes() {
  return useCollection("minutes", toMinutes, [{ property: "日付", direction: "descending" }]);
}

export function useChurchInfo() {
  return useCollection("churchInfo", toChurchInfo);
}
