const NOTION_VERSION = "2022-06-28";
const API_BASE = "https://api.notion.com/v1";

export class NotionError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  token: string,
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `Notion API error (${res.status})`;
    try {
      const body = await res.json();
      if (body?.message) message = body.message;
    } catch {
      // ignore parse failure
    }
    throw new NotionError(message, res.status);
  }

  return res.json() as Promise<T>;
}

export interface RawNotionPage {
  id: string;
  archived: boolean;
  properties: Record<string, any>;
}

export async function queryDatabase(
  token: string,
  databaseId: string,
  opts?: { sorts?: { property: string; direction: "ascending" | "descending" }[]; filter?: Record<string, unknown> }
): Promise<RawNotionPage[]> {
  const results: RawNotionPage[] = [];
  let cursor: string | undefined;
  do {
    const body: Record<string, unknown> = { page_size: 100 };
    if (opts?.sorts) body.sorts = opts.sorts;
    if (opts?.filter) body.filter = opts.filter;
    if (cursor) body.start_cursor = cursor;
    const page = await request<{
      results: RawNotionPage[];
      has_more: boolean;
      next_cursor: string | null;
    }>(token, `/databases/${databaseId}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    results.push(...page.results);
    cursor = page.has_more ? page.next_cursor ?? undefined : undefined;
  } while (cursor);
  return results;
}

export async function createPage(
  token: string,
  databaseId: string,
  properties: Record<string, unknown>
): Promise<RawNotionPage> {
  return request<RawNotionPage>(token, "/pages", {
    method: "POST",
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  });
}

export async function updatePage(
  token: string,
  pageId: string,
  properties: Record<string, unknown>
): Promise<RawNotionPage> {
  return request<RawNotionPage>(token, `/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ properties }),
  });
}

export async function archivePage(token: string, pageId: string): Promise<void> {
  await request(token, `/pages/${pageId}`, {
    method: "PATCH",
    body: JSON.stringify({ archived: true }),
  });
}

export async function retrieveDatabase(
  token: string,
  databaseId: string
): Promise<{ id: string; title: string }> {
  const db = await request<{ id: string; title: { plain_text: string }[] }>(
    token,
    `/databases/${databaseId}`
  );
  return { id: db.id, title: db.title?.map((t) => t.plain_text).join("") ?? "" };
}

export async function createDatabase(
  token: string,
  parentPageId: string,
  title: string,
  properties: Record<string, unknown>
): Promise<string> {
  const db = await request<{ id: string }>(token, "/databases", {
    method: "POST",
    body: JSON.stringify({
      parent: { type: "page_id", page_id: parentPageId },
      title: [{ type: "text", text: { content: title } }],
      properties,
    }),
  });
  return db.id;
}

/** Accepts a full Notion URL or a bare 32-char id and returns the normalized id. */
export function extractNotionId(input: string): string {
  const cleaned = input.trim();
  const match = cleaned.match(/[0-9a-fA-F]{32}/);
  if (match) return match[0];
  const dashed = cleaned.match(
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
  );
  if (dashed) return dashed[0].replace(/-/g, "");
  throw new Error("NotionのページIDまたはURLを正しく入力してください");
}

// ---- property builders ----

export function pTitle(text: string) {
  return { title: text ? [{ text: { content: text.slice(0, 2000) } }] : [] };
}

export function pRichText(text: string) {
  const chunks: { text: { content: string } }[] = [];
  const trimmed = text ?? "";
  for (let i = 0; i < trimmed.length; i += 2000) {
    chunks.push({ text: { content: trimmed.slice(i, i + 2000) } });
  }
  return { rich_text: chunks };
}

export function pDate(iso: string | null) {
  return { date: iso ? { start: iso } : null };
}

export function pSelect(name: string | null) {
  return { select: name ? { name } : null };
}

export function pNumber(n: number | null) {
  return { number: n };
}

export function pCheckbox(value: boolean) {
  return { checkbox: value };
}

// ---- property readers ----

// Real Notion API responses always carry plain_text; text built locally by pTitle/pRichText
// (e.g. demo-mode records, which reuse those builders as their storage format) only has
// text.content, so fall back to that.
export function rTitle(prop: any): string {
  return (prop?.title ?? []).map((t: any) => t.plain_text ?? t.text?.content ?? "").join("");
}

export function rRichText(prop: any): string {
  return (prop?.rich_text ?? []).map((t: any) => t.plain_text ?? t.text?.content ?? "").join("");
}

export function rDate(prop: any): string | null {
  return prop?.date?.start ?? null;
}

export function rSelect(prop: any): string | null {
  return prop?.select?.name ?? null;
}

export function rNumber(prop: any): number | null {
  return typeof prop?.number === "number" ? prop.number : null;
}

export function rCheckbox(prop: any): boolean {
  return Boolean(prop?.checkbox);
}
