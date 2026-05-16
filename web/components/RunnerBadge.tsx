"use client";

import { useEffect, useState } from "react";

type Mode = "cli" | "api" | "unknown";

export function RunnerBadge() {
  const [mode, setMode] = useState<Mode>("unknown");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat", { method: "GET" })
      .then((r) => r.json())
      .then((data: { runner?: string }) => {
        if (cancelled) return;
        setMode(data.runner === "api" ? "api" : data.runner === "cli" ? "cli" : "unknown");
      })
      .catch(() => {
        if (!cancelled) setMode("unknown");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (mode === "unknown") return null;

  const isCli = mode === "cli";
  return (
    <span
      className="runner-badge"
      data-mode={mode}
      title={
        isCli
          ? "Claude Code CLI 로 로컬 Pro/Max 구독을 사용합니다"
          : "Anthropic Messages API 직접 호출 — 토큰당 과금"
      }
    >
      <span className="runner-dot" /> {isCli ? "CLI · Pro/Max" : "API · pay-per-token"}
    </span>
  );
}
