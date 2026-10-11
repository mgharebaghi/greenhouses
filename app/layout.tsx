import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "فکور پیوند آریا | سامانه مدیریت گلخانه",
  description: "سامانه جامع مدیریت هوشمند گلخانه - فکور پیوند آریا",
  icons: {
    icon: "/fakoor-logo.png",
    shortcut: "/fakoor-logo.png",
    apple: "/fakoor-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" suppressHydrationWarning>
      <body className={`antialiased font-IransansR`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
