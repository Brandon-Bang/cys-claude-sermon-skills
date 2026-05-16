/**
 * Selectable Claude models for the dashboard UI.
 *
 * The id is what we pass to the runner (CLI: `--model <id>`, API: model param).
 * If you add/remove a model here it shows up in the TopBar picker immediately.
 */

export interface ModelOption {
  id: string;
  label: string;
  short: string;
  hint: string;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "claude-opus-4-7",
    label: "Opus 4.7",
    short: "Opus",
    hint: "최고 품질 · 1M 컨텍스트 · 가장 깊은 분석",
  },
  {
    id: "claude-sonnet-4-6",
    label: "Sonnet 4.6",
    short: "Sonnet",
    hint: "균형형 · 일상 사용 · 기본값",
  },
  {
    id: "claude-haiku-4-5-20251001",
    label: "Haiku 4.5",
    short: "Haiku",
    hint: "빠르고 가벼움 · 짧은 요청에 적합",
  },
];

export const DEFAULT_MODEL_ID = "claude-sonnet-4-6";

export function isKnownModel(id: string | undefined | null): id is string {
  return !!id && MODEL_OPTIONS.some((m) => m.id === id);
}

export function getModelOption(id: string | undefined | null): ModelOption {
  return MODEL_OPTIONS.find((m) => m.id === id) ?? MODEL_OPTIONS.find((m) => m.id === DEFAULT_MODEL_ID)!;
}
