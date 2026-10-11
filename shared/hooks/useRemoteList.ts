"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export default function useRemoteList<T>(query: () => Promise<T[]>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const requestId = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    try {
      const rows = await query();
      if (request === requestId.current) {
        setData(rows);
        setError(false);
      }
    } catch {
      if (request === requestId.current) setError(true);
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [query]);
  useEffect(() => {
    const pending = requestId;
    void refresh();
    return () => {
      pending.current++;
    };
  }, [refresh]);
  return { data, setData, loading, setLoading, error, refresh };
}
