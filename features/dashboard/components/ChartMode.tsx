"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type ChartMode = "bar" | "line" | "share";

const ChartModeContext = createContext<{
  mode: ChartMode;
  setMode: (mode: ChartMode) => void;
} | null>(null);

export function ChartModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ChartMode>("bar");
  return (
    <ChartModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ChartModeContext.Provider>
  );
}

export function useChartMode() {
  const context = useContext(ChartModeContext);
  if (!context)
    throw new Error("Order activity requires a chart mode provider");
  return context;
}
