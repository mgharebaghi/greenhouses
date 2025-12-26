"use client";
import faIR from "antd/locale/fa_IR";

import { Suspense } from "react";
import { ConfigProvider } from "antd";
import NavigationProgressBar from "./components/NavigationProgressBar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={faIR} direction="rtl" theme={{ token: { fontFamily: "IransansR" } }}>
      <Suspense fallback={null}>
        <NavigationProgressBar />
      </Suspense>
      {/* <GlobalFaDigits /> */}
      {children}
    </ConfigProvider>
  );
}
