import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as secureConfig from "./secureConfig";
import { emptyDbIds, type DbIds } from "./types";

interface ConfigState {
  loading: boolean;
  token: string | null;
  dbIds: DbIds;
  demoMode: boolean;
  isConfigured: boolean;
  refresh: () => Promise<void>;
}

const ConfigContext = createContext<ConfigState | null>(null);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
  const [dbIds, setDbIdsState] = useState<DbIds>(emptyDbIds);
  const [demoMode, setDemoModeState] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [t, ids, demo] = await Promise.all([
      secureConfig.getToken(),
      secureConfig.getDbIds(),
      secureConfig.getDemoMode(),
    ]);
    setTokenState(t);
    setDbIdsState(ids);
    setDemoModeState(demo);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isConfigured = useMemo(
    () => demoMode || (Boolean(token) && Object.values(dbIds).every((v) => Boolean(v))),
    [token, dbIds, demoMode]
  );

  const value = useMemo(
    () => ({ loading, token, dbIds, demoMode, isConfigured, refresh }),
    [loading, token, dbIds, demoMode, isConfigured, refresh]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export function useConfig(): ConfigState {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error("useConfig must be used within ConfigProvider");
  return ctx;
}
