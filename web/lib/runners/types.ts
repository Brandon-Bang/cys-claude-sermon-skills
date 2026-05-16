export interface RunnerInput {
  /** Skill folder name (e.g. `sermon-text-analysis-multimethod`). */
  skillFolder: string;
  /** Pre-built system prompt (SKILL.md content + envelope). */
  systemPrompt: string;
  /** Final user message — bible reference + optional extra question. */
  userMessage: string;
  /** Optional Claude model id chosen in the UI. Empty/undefined → runner default. */
  model?: string;
}

/** Runners yield raw text chunks suitable for SSE streaming. */
export type RunnerStream = AsyncIterable<string>;

export interface Runner {
  run(input: RunnerInput): Promise<RunnerStream>;
}
