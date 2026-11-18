"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useRemoteList<T>(
  query: () => Promise<T[]>,
  initialData?: T[],
) {
  const hasInitialData = initialData !== undefined;
  const [data, setData] = useState<T[]>(initialData ?? []);
  const [loading, setLoading] = useState(!hasInitialData);
  const [error, setError] = useState(false);
  const hasLoaded = useRef(hasInitialData);
  const requestId = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    try {
      const rows = await query();
      if (request === requestId.current) {
        setData(rows);
        setError(false);
        hasLoaded.current = true;
        return true;
      }
    } catch {
      if (request === requestId.current && !hasLoaded.current) setError(true);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
    return false;
  }, [query]);
  useEffect(() => {
    const pending = requestId;
    if (!hasInitialData) void refresh();
    return () => {
      pending.current++;
    };
  }, [hasInitialData, refresh]);
  return { data, setData, loading, setLoading, error, refresh };
}
