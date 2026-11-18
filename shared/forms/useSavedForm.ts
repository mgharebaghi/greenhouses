"use client";

import { useRef, useState } from "react";
import { refreshSavedForm, type RefreshFormList } from "./submit";

type SavedForm = {
  message: string;
  refresh: RefreshFormList;
  close: () => void;
  setTableLoading?: (loading: boolean) => void;
};

export default function useSavedForm() {
  const [saved, setSaved] = useState<
    (SavedForm & { status: "refreshing" | "failed" }) | null
  >(null);
  const refreshing = useRef(false);

  async function refreshAndClose(save: SavedForm) {
    if (refreshing.current) return;
    refreshing.current = true;
    setSaved({ ...save, status: "refreshing" });
    const updated = await refreshSavedForm(save.refresh, save.setTableLoading);
    refreshing.current = false;
    if (updated) save.close();
    else setSaved({ ...save, status: "failed" });
  }

  return {
    saved,
    complete: (
      message: string,
      refresh: RefreshFormList,
      close: () => void,
      setTableLoading?: (loading: boolean) => void,
    ) => refreshAndClose({ message, refresh, close, setTableLoading }),
    retry: () => {
      if (saved?.status === "failed") void refreshAndClose(saved);
    },
    reset: () => setSaved(null),
  };
}
