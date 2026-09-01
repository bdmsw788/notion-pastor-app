import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { emptyDbIds, type DbIds } from "./types";

const TOKEN_KEY = "notion_token";
const DB_IDS_KEY = "notion_db_ids";
const DEMO_MODE_KEY = "demo_mode";

// expo-secure-store has no native module on web; fall back to localStorage there
// (used only for local development preview — the shipped app targets iOS/Android via Expo Go).
const store = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export async function getToken(): Promise<string | null> {
  return store.getItem(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  await store.setItem(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await store.removeItem(TOKEN_KEY);
}

export async function getDbIds(): Promise<DbIds> {
  const raw = await store.getItem(DB_IDS_KEY);
  if (!raw) return emptyDbIds;
  try {
    return { ...emptyDbIds, ...JSON.parse(raw) };
  } catch {
    return emptyDbIds;
  }
}

export async function setDbIds(ids: DbIds): Promise<void> {
  await store.setItem(DB_IDS_KEY, JSON.stringify(ids));
}

export async function isConfigured(): Promise<boolean> {
  const token = await getToken();
  const ids = await getDbIds();
  return Boolean(token) && Object.values(ids).every((v) => Boolean(v));
}

export async function getDemoMode(): Promise<boolean> {
  const raw = await store.getItem(DEMO_MODE_KEY);
  return raw === "1";
}

export async function setDemoMode(value: boolean): Promise<void> {
  if (value) {
    await store.setItem(DEMO_MODE_KEY, "1");
  } else {
    await store.removeItem(DEMO_MODE_KEY);
  }
}
