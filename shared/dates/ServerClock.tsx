"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getTehranDay } from "./calendar";

const ServerClock = createContext<number | null>(null);
const ServerDay = createContext<string | null>(null);

export function ServerClockProvider({
  initialTime,
  readServerTime,
  children,
}: {
  initialTime: number;
  readServerTime: () => Promise<number>;
  children: ReactNode;
}) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let anchor = { time: initialTime, measuredAt: performance.now() };
    let disposed = false;
    let syncing = false;
    const tick = () => {
      const now = anchor.time + performance.now() - anchor.measuredAt;
      // Date and time in the dashboard are displayed to minute precision.
      setTime(Math.floor(now / 60_000) * 60_000);
    };

    async function sync() {
      if (syncing || document.hidden) return;
      syncing = true;
      const startedAt = performance.now();
      try {
        const time = await readServerTime();
        if (disposed) return;
        const finishedAt = performance.now();
        anchor = { time, measuredAt: (startedAt + finishedAt) / 2 };
        tick();
      } catch {
        // Keep the last server reading while the connection is unavailable.
      } finally {
        syncing = false;
      }
    }

    void sync();
    const timer = window.setInterval(tick, 1000);
    const syncTimer = window.setInterval(sync, 60_000);
    document.addEventListener("visibilitychange", sync);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.clearInterval(syncTimer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [initialTime, readServerTime]);

  return (
    <ServerClock.Provider value={time}>
      <ServerDay.Provider value={getTehranDay(time)}>
        {children}
      </ServerDay.Provider>
    </ServerClock.Provider>
  );
}

export function useServerTime() {
  const time = useContext(ServerClock);
  if (time === null) throw new Error("ServerClockProvider is required");
  return time;
}

export function useServerDay() {
  const day = useContext(ServerDay);
  if (day === null) throw new Error("ServerClockProvider is required");
  return day;
}
