/**
 * Wire protocol between /api/chat and the dashboard client.
 *
 * Each newline-delimited JSON object is one event. Order is:
 *
 *   stage:received        — request hit the server
 *   stage:skill-loaded    — SKILL.md read and wrapped into a system prompt
 *   stage:runner-start    — CLI spawned / API call initiated
 *   stage:first-token     — emitted automatically on the first non-empty text chunk
 *   text  × N             — model output, in arrival chunks
 *   stage:done            — stream closed cleanly (always last on success)
 *   error                 — terminal failure (replaces stage:done)
 *
 * Timestamps (`t`) are milliseconds since the request started, integer.
 */

export type StageId =
  | "received"
  | "skill-loaded"
  | "runner-start"
  | "first-token"
  | "done"
  | "saved";

export interface StageEvent {
  type: "stage";
  id: StageId;
  label: string;
  t: number;
}

export interface TextEvent {
  type: "text";
  data: string;
}

export interface ErrorEvent {
  type: "error";
  message: string;
  t: number;
}

export type StreamEvent = StageEvent | TextEvent | ErrorEvent;

export const STAGE_LABELS: Record<StageId, string> = {
  "received":      "요청 수신",
  "skill-loaded":  "SKILL.md 로드",
  "runner-start":  "Claude 호출 시작",
  "first-token":   "응답 스트리밍 시작",
  "done":          "완료",
  "saved":         "로컬 저장 완료",
};

export function serialize(evt: StreamEvent): string {
  return JSON.stringify(evt) + "\n";
}

/** Parse a single JSON line. Returns null on malformed input. */
export function parseLine(line: string): StreamEvent | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  try {
    const obj = JSON.parse(trimmed) as StreamEvent;
    if (obj && (obj.type === "stage" || obj.type === "text" || obj.type === "error")) {
      return obj;
    }
    return null;
  } catch {
    return null;
  }
}
