"use client";
import "@ant-design/v5-patch-for-react-19";

import faIR from "antd/locale/fa_IR";

import NavigationProgressBar from "@/shared/components/NavigationProgressBar";
import { ConfigProvider, theme as themeNumeric } from "antd";
import { ThemeProvider, useTheme } from "next-themes";
import { Suspense, useEffect, useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AntdConfigProvider>{children}</AntdConfigProvider>
    </ThemeProvider>
  );
}

function AntdConfigProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <ConfigProvider
        locale={faIR}
        direction="rtl"
        theme={{ token: { fontFamily: "IransansR" } }}
      >
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
      </ConfigProvider>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <ConfigProvider
      locale={faIR}
      direction="rtl"
      theme={{
        algorithm: isDark
          ? themeNumeric.darkAlgorithm
          : themeNumeric.defaultAlgorithm,
        token: {
          fontFamily: "IransansR",
          colorPrimary: isDark ? "#2fb98c" : "#047857",
          ...(isDark && {
            colorTextBase: "#f1f5fb",
            colorText: "#f1f5fb",
            colorTextSecondary: "#c5d1e1",
            colorTextTertiary: "#bac8da",
            colorTextPlaceholder: "#a6b6cb",
            colorTextDisabled: "#a6b6cb",
            colorBgContainer: "#142033",
            colorBgElevated: "#19283d",
            colorBgLayout: "#0b1423",
            colorBgContainerDisabled: "#19283d",
            colorBorder: "#3a4a60",
            colorBorderSecondary: "#35465d",
            colorLink: "#7de3bc",
          }),
        },
        components: {
          Button: {
            borderRadius: 10,
            borderRadiusLG: 12,
            fontWeight: 600,
            motionDurationMid: "0.2s",
            defaultShadow: "none",
            primaryShadow: "none",
            dangerShadow: "none",
            colorPrimary: isDark ? "#67c6a4" : "#147960",
            colorPrimaryHover: isDark ? "#81d5b7" : "#106650",
            defaultBg: isDark ? "#202d40" : "#f1f4f6",
            defaultHoverBg: isDark ? "#2b3a4d" : "#e7eef0",
            ...(isDark && { primaryColor: "#092b22" }),
          },
          Modal: {
            motionDurationMid: "0.2s",
            colorBgTextHover: isDark ? "#2b3a4d" : "#e7eef0",
          },
          ...(isDark && {
            Select: {
              optionActiveBg: "#233750",
              optionSelectedBg: "#174536",
            },
          }),
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
