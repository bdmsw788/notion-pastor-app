const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function formatDate(iso: string | null): string {
  if (!iso) return "日付未設定";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const hasTime = iso.includes("T");
  const base = `${d.getMonth() + 1}/${d.getDate()}(${WEEKDAYS[d.getDay()]})`;
  if (!hasTime) return base;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${base} ${hh}:${mm}`;
}

export function isWithinNextDays(iso: string | null, days: number): boolean {
  if (!iso) return false;
  const target = new Date(iso).getTime();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = now.getTime() + days * 24 * 60 * 60 * 1000;
  return target >= now.getTime() && target <= end;
}

export function isPastOrToday(iso: string | null): boolean {
  if (!iso) return false;
  const target = new Date(iso).getTime();
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return target <= now.getTime();
}
