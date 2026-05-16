import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import type { Runner, RunnerInput, RunnerStream } from "./types";

const DEFAULT_MODEL = "claude-sonnet-4-6";

export const apiRunner: Runner = {
  async run({ systemPrompt, userMessage, model }: RunnerInput): Promise<RunnerStream> {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to web/.env.local or switch RUNNER_MODE=cli."
      );
    }
    const anthropic = createAnthropic({ apiKey });
    const modelId = model || process.env.CLAUDE_MODEL || DEFAULT_MODEL;
    const result = streamText({
      model: anthropic(modelId),
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
      temperature: 0.7,
      maxTokens: 4096,
    });
    return result.textStream;
  },
};
