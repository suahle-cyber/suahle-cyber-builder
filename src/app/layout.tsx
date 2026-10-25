import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const pretendard = localFont({
  src: "../../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  variable: "--font-sans",
  weight: "45 920",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOC → PMF — 고객 인터뷰, PMF 판단으로 이어지게",
  description:
    "PMF 를 찾아가는 창업자를 위한 인터뷰 툴이에요. 인터뷰를 고객별로 쌓고, PMF 신호를 찾고, 누구에게 언제 다시 연락해 무엇을 물을지 알려 드려요.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster theme="light" />
      </body>
    </html>
  );
}
