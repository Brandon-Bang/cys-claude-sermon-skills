import type { Metadata } from "next";
import "./globals.css";
import { AmbientBg } from "@/components/AmbientBg";
import { DeviceToggle } from "@/components/DeviceToggle";
import { ResponsiveWrapper } from "@/components/ResponsiveWrapper";

export const metadata: Metadata = {
  title: "Sermon Skills — AI 설교 연구 대시보드",
  description: "원어 분석부터 회중 피드백까지 — 21가지 AI 스킬이 설교 준비의 모든 여정과 함께합니다",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700;900&family=Pretendard:wght@300;400;500;600;700&family=Noto+Sans+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AmbientBg />
        <DeviceToggle />
        <ResponsiveWrapper>{children}</ResponsiveWrapper>
      </body>
    </html>
  );
}
