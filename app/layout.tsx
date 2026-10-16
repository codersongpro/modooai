import type { Metadata, Viewport } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import { FONT_INIT_SCRIPT } from "@/lib/font-init";

export const metadata: Metadata = {
  title: "모두AI",
  description: "처음 만나는 AI 활용 코스웨어",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scale, data-level 은 화면이 뜨기 전에 스크립트가 바꾸므로 경고를 끈다
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FONT_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 pb-8 pt-4">{children}</main>
      </body>
    </html>
  );
}
