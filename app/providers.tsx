"use client";
import faIR from "antd/locale/fa_IR";

import { ConfigProvider } from "antd";
import NavigationProgressBar from "./components/NavigationProgressBar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={faIR} direction="rtl" theme={{ token: { fontFamily: "IransansR" } }}>
      <NavigationProgressBar />
      {/* <GlobalFaDigits /> */}
      {children}
    </ConfigProvider>
  );
}
