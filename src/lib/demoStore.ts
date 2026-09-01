import type { RawNotionPage } from "./notion";
import { buildDemoSeed } from "./demoData";
import type { DatabaseKey } from "./types";

let store: Record<DatabaseKey, RawNotionPage[]> | null = null;
let idCounter = 0;

function ensureStore(): Record<DatabaseKey, RawNotionPage[]> {
  if (!store) store = buildDemoSeed();
  return store;
}

export function resetDemoStore(): void {
  store = buildDemoSeed();
}

export async function queryDatabase(key: DatabaseKey): Promise<RawNotionPage[]> {
  return ensureStore()[key];
}

export async function createPage(
  key: DatabaseKey,
  properties: Record<string, unknown>
): Promise<RawNotionPage> {
  idCounter += 1;
  const page: RawNotionPage = { id: `demo-new-${idCounter}`, archived: false, properties };
  ensureStore()[key].push(page);
  return page;
}

export async function updatePage(
  key: DatabaseKey,
  pageId: string,
  properties: Record<string, unknown>
): Promise<RawNotionPage> {
  const list = ensureStore()[key];
  const page = list.find((p) => p.id === pageId);
  if (!page) throw new Error("デモデータが見つかりません");
  page.properties = { ...page.properties, ...properties };
  return page;
}

export async function archivePage(key: DatabaseKey, pageId: string): Promise<void> {
  const list = ensureStore()[key];
  const page = list.find((p) => p.id === pageId);
  if (page) page.archived = true;
}
