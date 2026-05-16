"use client";

import { useEffect } from "react";

export function SampleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="닫기">✕</button>
        <h3>샘플 미리보기 — 본문 다각도 분석</h3>
        <p>빌립보서 4:4 분석 결과 예시</p>
        <div className="sample-result">
          <h4>1) 원문 언어 분석</h4>
          <span className="highlight">Χαίρετε</span>{" "}
          <span className="greek">chairete</span> (카이레테) — 기뻐하라
          <br />
          현재 능동 명령형, 2인칭 복수.{" "}
          <span className="highlight">지속적이고 반복적인 기쁨</span>을 명령.
          <br />
          <span className="greek">ἐν κυρίῳ</span> (엔 퀴리오) — 주 안에서. 기쁨의 근거가
          환경이 아닌 <span className="highlight">그리스도와의 연합</span>임을 명시.
          <div className="section-break" />
          <h4>2) 구조 분석</h4>
          <span className="highlight">A — χαίρετε ἐν κυρίῳ πάντοτε</span> (주 안에서
          항상 기뻐하라)
          <br />
          <span className="highlight">A' — πάλιν ἐρῶ, χαίρετε</span> (다시 말하노니
          기뻐하라)
          <br />
          반복 강조(inclusio) 구조. 바울이{" "}
          <span className="highlight">옥중에서도</span> 기쁨을 반복 명령하는 역설적
          상황.
          <div className="section-break" />
          <h4>3) 역사·문화 배경</h4>
          바울은 이 서신을{" "}
          <span className="highlight">로마 감옥(가택연금)</span>에서 작성 (행
          28:30-31).
          <br />
          빌립보는 <span className="highlight">로마 식민지(colonia)</span>로,
          수신자들은 로마 시민권의 자부심과 황제 숭배 압력 사이에 놓여 있었음.
        </div>
      </div>
    </div>
  );
}
