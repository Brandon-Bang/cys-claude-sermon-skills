import { apiRunner } from "./api-runner";
import { cliRunner } from "./cli-runner";
import type { Runner } from "./types";

export type RunnerMode = "api" | "cli";

export function getRunnerMode(): RunnerMode {
  // Default: CLI (subscription mode). Set RUNNER_MODE=api to opt into the
  // Anthropic Messages API path (pay-per-token, Vercel-friendly).
  const raw = (process.env.RUNNER_MODE || "cli").toLowerCase();
  return raw === "api" ? "api" : "cli";
}

export function getRunner(): Runner {
  return getRunnerMode() === "cli" ? cliRunner : apiRunner;
}

export type { Runner, RunnerInput, RunnerStream } from "./types";
