import { useCallback, useEffect, useState } from "react";
import { festaApi } from "../lib/api";
import { useVisitorId } from "./use-visitor";

export function useFavorites() {
  const visitorId = useVisitorId();
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!visitorId) return;
    const res = await festaApi.listFavoriteIds(visitorId);
    if (res.success && res.data) setIds(res.data);
    setLoading(false);
  }, [visitorId]);

  useEffect(() => {
    if (visitorId) refresh();
  }, [visitorId, refresh]);

  const toggle = useCallback(
    async (unitId: string) => {
      if (!visitorId) return;
      // optimistic
      setIds((prev) =>
        prev.includes(unitId) ? prev.filter((i) => i !== unitId) : [...prev, unitId],
      );
      const res = await festaApi.toggleFavorite(visitorId, unitId);
      if (!res.success) refresh();
    },
    [visitorId, refresh],
  );

  const isFavorite = useCallback((unitId: string) => ids.includes(unitId), [ids]);

  return { ids, isFavorite, toggle, refresh, loading, count: ids.length, visitorId };
}
