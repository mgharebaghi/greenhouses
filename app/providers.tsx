"use client";
import faIR from "antd/locale/fa_IR";

import { ConfigProvider } from "antd";
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider locale={faIR} direction="rtl" theme={{ token: { fontFamily: "IransansR" } }}>
      <ProgressBar
        height="4px"
        color="#10b981"
        options={{ showSpinner: false }}
        shallowRouting
      />
      {/* <GlobalFaDigits /> */}
      {children}
    </ConfigProvider>
  );
}
