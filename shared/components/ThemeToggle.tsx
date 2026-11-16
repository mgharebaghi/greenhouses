"use client";

import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import GreenhouseButton from "./GreenhouseButton";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <GreenhouseButton
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="sm:size-10"
      aria-label="تغییر تم"
      aria-pressed={isDark}
      variant="secondary"
      icon={isDark ? <MoonOutlined /> : <SunOutlined />}
    />
  );
}
