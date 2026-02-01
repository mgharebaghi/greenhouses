"use client";
import faIR from "antd/locale/fa_IR";

import { Suspense, useEffect, useState } from "react";
import { ConfigProvider, theme as themeNumeric } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import NavigationProgressBar from "./components/NavigationProgressBar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </ThemeProvider>
  );
}

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ConfigProvider locale={faIR} direction="rtl" theme={{ token: { fontFamily: "IransansR" } }}>
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
      </ConfigProvider>
    )
  }

  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      locale={faIR}
      direction="rtl"
      theme={{
        algorithm: isDark ? themeNumeric.darkAlgorithm : themeNumeric.defaultAlgorithm,
        token: {
          fontFamily: "IransansR",
          colorPrimary: "#10b981", // Emerald 500
          colorBgContainer: isDark ? "#1e293b" : "#ffffff", // Slate 800 vs White
          colorBgLayout: isDark ? "#0f172a" : "#f5f5f5", // Slate 900 vs Gray 100
        },
      }}
    >
      <Suspense fallback={null}>
        <NavigationProgressBar />
      </Suspense>
      {children}
    </ConfigProvider>
  );
}
