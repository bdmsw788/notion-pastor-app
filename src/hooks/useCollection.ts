import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useConfig } from "@/lib/ConfigContext";
import { archivePage, createPage, queryDatabase, updatePage, type RawNotionPage } from "@/lib/notion";
import * as demoStore from "@/lib/demoStore";
import type { DatabaseKey } from "@/lib/types";

export function useCollection<T extends { id: string }>(
  key: DatabaseKey,
  mapper: (p: RawNotionPage) => T,
  sorts?: { property: string; direction: "ascending" | "descending" }[]
) {
  const { token, dbIds, demoMode } = useConfig();
  const dbId = dbIds[key];
  const queryClient = useQueryClient();
  const queryKey = [key, demoMode ? "demo" : dbId];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const pages = demoMode
        ? await demoStore.queryDatabase(key)
        : await queryDatabase(token as string, dbId as string, { sorts });
      return pages.filter((p) => !p.archived).map(mapper);
    },
    enabled: demoMode || Boolean(token && dbId),
  });

  const create = useMutation({
    mutationFn: async (properties: Record<string, unknown>) =>
      demoMode
        ? demoStore.createPage(key, properties)
        : createPage(token as string, dbId as string, properties),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: async ({ id, properties }: { id: string; properties: Record<string, unknown> }) =>
      demoMode
        ? demoStore.updatePage(key, id, properties)
        : updatePage(token as string, id, properties),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) =>
      demoMode ? demoStore.archivePage(key, id) : archivePage(token as string, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { ...query, create, update, remove };
}
