"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useUi } from "@/lib/store";
import type { Skill } from "@/lib/skills";
import { parseLine, type StageId, type StreamEvent } from "@/lib/protocol";
import { MarkdownView } from "./MarkdownView";

interface Props {
  skill: Skill;
}

interface StageRecord {
  id: StageId;
  label: string;
  t: number;
}

type Status = "idle" | "loading" | "done" | "error";

export function SkillExecForm({ skill }: Props) {
  const setOpenAccordion = useUi((s) => s.setOpenAccordion);
  const model = useUi((s) => s.model);
  useEffect(() => {
    setOpenAccordion(skill.category);
  }, [skill.category, setOpenAccordion]);

  const [verse, setVerse] = useState("");
  const [extra, setExtra] = useState("");
  const [output, setOutput] = useState("");
  const [stages, setStages] = useState<StageRecord[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const abortRef = useRef<AbortController | null>(null);
  const resultBodyRef = useRef<HTMLDivElement | null>(null);
  const stickToBottomRef = useRef(true);
  const startedAtRef = useRef<number>(0);

  // Live elapsed-time ticker while streaming
  useEffect(() => {
    if (status !== "loading") return;
    const id = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAtRef.current);
    }, 80);
    return () => window.clearInterval(id);
  }, [status]);

  // Auto-scroll the result body while user hasn't scrolled away from bottom
  useEffect(() => {
    if (status !== "loading") return;
    if (!stickToBottomRef.current) return;
    const el = resultBodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [output, status]);

  function onResultScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    stickToBottomRef.current = distance < 40;
  }

  async function run() {
    const v = verse.trim();
    if (!v || status === "loading") return;
    setOutput("");
    setStages([]);
    setErrMsg(null);
    setStatus("loading");
    setElapsedMs(0);
    startedAtRef.current = Date.now();
    stickToBottomRef.current = true;

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId: skill.id, verse: v, extra, model }),
        signal: ctrl.signal,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error("Streaming not supported");
      const decoder = new TextDecoder();
      let buffered = "";
      let lineBuf = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        lineBuf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = lineBuf.indexOf("\n")) >= 0) {
          const line = lineBuf.slice(0, nl);
          lineBuf = lineBuf.slice(nl + 1);
          const evt = parseLine(line);
          if (!evt) continue;
          buffered = applyEvent(evt, buffered);
        }
      }
      const tail = parseLine(lineBuf);
      if (tail) applyEvent(tail, buffered);

      if (status !== "error") setStatus((s) => (s === "loading" ? "done" : s));
    } catch (err) {
      if ((err as Error).name === "AbortError") {
        setStatus("idle");
        return;
      }
      setErrMsg((err as Error).message);
      setStatus("error");
    }

    function applyEvent(evt: StreamEvent, _buf: string): string {
      if (evt.type === "stage") {
        setStages((prev) =>
          prev.find((s) => s.id === evt.id)
            ? prev
            : [...prev, { id: evt.id, label: evt.label, t: evt.t }]
        );
        if (evt.id === "done") {
          setElapsedMs(evt.t);
          setStatus("done");
        }
      } else if (evt.type === "text") {
        setOutput((prev) => prev + evt.data);
      } else if (evt.type === "error") {
        setErrMsg(evt.message);
        setStatus("error");
      }
      return _buf;
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  const showProgress = status === "loading" || stages.length > 0 || !!output || !!errMsg;
  const isRunning = status === "loading";

  return (
    <>
      <div className="skill-exec-header">
        <div className="skill-exec-title">{skill.name}</div>
        <div className="skill-exec-desc">{skill.desc}</div>
      </div>

      <div className="skill-exec-body">
        <div className="input-group">
          <label className="input-label" htmlFor="inputVerse">
            성경 본문 / 주제 입력
          </label>
          <input
            id="inputVerse"
            className="input-field"
            type="text"
            placeholder="예: 로마서 8:28, 빌립보서 4:4-7"
            value={verse}
            onChange={(e) => setVerse(e.target.value)}
            disabled={isRunning}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="inputExtra">
            추가 요청 (선택)
          </label>
          <textarea
            id="inputExtra"
            className="input-field"
            placeholder="특별히 분석하고 싶은 부분이나 질문을 입력하세요"
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            disabled={isRunning}
          />
        </div>

        <div className="exec-actions">
          {isRunning ? (
            <button className="btn-exec" onClick={cancel} type="button">
              ⏹ 중단
            </button>
          ) : (
            <button
              className="btn-exec"
              onClick={run}
              disabled={!verse.trim()}
              type="button"
            >
              분석 시작 →
            </button>
          )}
          <Link href="/dashboard" className="btn-cancel">← 대시보드로</Link>
          <span
            className={`exec-status${status === "error" ? " error" : ""}`}
            aria-live="polite"
          >
            {status === "loading" && "분석 중 (스트리밍)…"}
            {status === "done" && "완료"}
            {status === "error" && (errMsg || "오류")}
          </span>
        </div>

        {showProgress && (
          <div className="exec-progress">
            <ProgressMeter
              isRunning={isRunning}
              elapsedMs={elapsedMs}
              chars={output.length}
              stagesDone={stages.length}
            />
            <StageTimeline stages={stages} isRunning={isRunning} hasError={status === "error"} />
          </div>
        )}

        {(output || isRunning || status === "error") && (
          <div className="skill-result">
            <h4>
              {skill.name}
              {verse ? ` — ${verse}` : ""}
            </h4>
            <div
              className="result-body"
              ref={resultBodyRef}
              onScroll={onResultScroll}
            >
              {output && <MarkdownView text={output} />}
              {isRunning && <span className="result-cursor" />}
              {status === "error" && !output && (
                <em style={{ color: "#FF6B6B" }}>{errMsg}</em>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function ProgressMeter({
  isRunning, elapsedMs, chars, stagesDone,
}: {
  isRunning: boolean;
  elapsedMs: number;
  chars: number;
  stagesDone: number;
}) {
  const seconds = (elapsedMs / 1000).toFixed(1);
  return (
    <div className="exec-meter" data-running={isRunning}>
      <div className="meter-cell">
        <span className="meter-label">경과</span>
        <span className="meter-value">{seconds}s</span>
      </div>
      <div className="meter-cell">
        <span className="meter-label">수신 문자</span>
        <span className="meter-value">{chars.toLocaleString()}</span>
      </div>
      <div className="meter-cell">
        <span className="meter-label">단계</span>
        <span className="meter-value">{stagesDone} / 6</span>
      </div>
    </div>
  );
}

function StageTimeline({
  stages, isRunning, hasError,
}: {
  stages: StageRecord[];
  isRunning: boolean;
  hasError: boolean;
}) {
  return (
    <ul className="exec-timeline">
      {stages.map((s, i) => {
        const isLast = i === stages.length - 1;
        const stateClass =
          hasError && isLast ? " error" : isRunning && isLast ? " active" : " done";
        return (
          <li key={s.id} className={`exec-stage${stateClass}`}>
            <span className="exec-stage-dot" aria-hidden="true" />
            <span className="exec-stage-label">{s.label}</span>
            <span className="exec-stage-time">+{s.t.toLocaleString()}ms</span>
          </li>
        );
      })}
    </ul>
  );
}
