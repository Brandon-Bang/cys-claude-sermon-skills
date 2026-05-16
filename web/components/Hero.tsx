"use client";

import Link from "next/link";
import { useState } from "react";
import { SampleModal } from "./SampleModal";

export function Hero() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="landing-root">
        <div className="particles" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="particle" />
          ))}
        </div>

        <div className="hero-cross animate-in" aria-hidden="true" />
        <div className="hero-overline animate-in delay-1">AI-Powered Sermon Research</div>

        <h1 className="hero-title animate-in delay-2">
          <span className="shimmer">말씀의 깊이를</span>
          <br />한 곳에서 발견하다
        </h1>

        <p className="hero-subtitle animate-in delay-3">
          원어 분석부터 회중 피드백까지 —<br />
          21가지 AI 스킬이 설교 준비의 모든 여정과 함께합니다
        </p>

        <div className="hero-buttons animate-in delay-4">
          <Link href="/dashboard" className="btn-primary">시작하기 →</Link>
          <button className="btn-secondary" onClick={() => setOpen(true)}>
            ◎ 샘플 미리보기
          </button>
        </div>

        <div className="hero-stats animate-in delay-5">
          <Stat value="21" label="전문 스킬" />
          <Stat value="6"  label="카테고리" />
          <Stat value="5"  label="신학자 코칭" />
          <Stat value="8"  label="회중 페르소나" />
        </div>
      </div>
      <SampleModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="hero-stat">
      <div className="hero-stat-value">{value}</div>
      <div className="hero-stat-label">{label}</div>
    </div>
  );
}
