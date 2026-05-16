"use client";

import { Fragment } from "react";
import { useUi } from "@/lib/store";
import { CATEGORIES } from "@/lib/skills";

const LABELS = [
  "① 주제 기획",
  "② 본문 분석",
  "③ 배경 조사",
  "④ 신학 참조",
  "⑤ 설교 작성",
  "⑥ 회중 검증",
];

export function JourneyMap() {
  const flash = useUi((s) => s.flash);

  return (
    <div className="journey-map">
      {CATEGORIES.map((cat, i) => (
        <Fragment key={cat.id}>
          <button
            type="button"
            className="j-node"
            onClick={() => {
              flash(cat.id);
              document.getElementById(`acc-${cat.id}`)?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              });
            }}
          >
            <div className={`j-orb${i === 0 ? " active" : ""}`}>{cat.icon}</div>
            <span className="j-label">{LABELS[i]}</span>
          </button>
          <div className={`j-line${i === 0 ? " active" : ""}`} aria-hidden="true" />
        </Fragment>
      ))}
      <div className="j-node" role="presentation">
        <div className="j-orb">⛪</div>
        <span className="j-label">강단</span>
      </div>
    </div>
  );
}
