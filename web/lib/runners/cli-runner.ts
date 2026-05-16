import { spawn, type ChildProcessByStdio } from "node:child_process";
import type { Readable } from "node:stream";
import { join } from "node:path";
import type { Runner, RunnerInput, RunnerStream } from "./types";

type Proc = ChildProcessByStdio<null, Readable, Readable>;

/**
 * Spawns the local `claude` CLI under the user's Pro/Max session.
 *
 * Requirements on the host machine:
 *   1. Claude Code CLI installed and on $PATH (or override via CLAUDE_CLI).
 *   2. `claude` already logged in with a Pro/Max account.
 *   3. The repo's `skills/` folder is visible from CLAUDE_CWD (defaults to repo root).
 *
 * This runner CANNOT run on Vercel / serverless — there is no authenticated
 * Claude Code session in those environments. Use RUNNER_MODE=api there.
 */
export const cliRunner: Runner = {
  async run({ skillFolder, systemPrompt, userMessage, model }: RunnerInput): Promise<RunnerStream> {
    const bin = process.env.CLAUDE_CLI || "claude";
    const cwd = process.env.CLAUDE_CWD || join(process.cwd(), "..");

    const args = [
      "--print",
      "--output-format", "stream-json",
      "--verbose",
      ...(model ? ["--model", model] : []),
      "--append-system-prompt", systemPrompt,
      userMessage,
    ];

    let proc: Proc;
    try {
      proc = spawn(bin, args, {
        cwd,
        env: process.env,
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (err) {
      throw spawnError(err, bin);
    }

    // Detect spawn-time errors (e.g. ENOENT for missing `claude` binary).
    const spawnErr = new Promise<never>((_, reject) => {
      proc.once("error", (err: NodeJS.ErrnoException) => reject(spawnError(err, bin)));
    });

    const stderrChunks: string[] = [];
    proc.stderr.on("data", (chunk: Buffer) => {
      stderrChunks.push(chunk.toString("utf8"));
    });

    return makeStream(proc, skillFolder, stderrChunks, spawnErr);
  },
};

function spawnError(err: unknown, bin: string): Error {
  const e = err as NodeJS.ErrnoException;
  if (e?.code === "ENOENT") {
    return new Error(
      `\`${bin}\` 명령을 찾을 수 없습니다. Claude Code CLI 를 설치하고 PATH 에 추가하거나, ` +
      `CLAUDE_CLI 환경변수로 절대 경로를 지정하세요.\n` +
      `설치: https://docs.claude.com/en/docs/claude-code`
    );
  }
  return new Error(`claude CLI spawn 실패: ${e?.message || String(err)}`);
}

async function* makeStream(
  proc: Proc,
  skillFolder: string,
  stderrChunks: string[],
  spawnErr: Promise<never>
): AsyncGenerator<string, void, void> {
  const stdoutIter = proc.stdout[Symbol.asyncIterator]() as AsyncIterator<Buffer>;
  let buffer = "";
  let seenAnyOutput = false;

  try {
    while (true) {
      // Race stdout against a spawn-error rejection so ENOENT surfaces cleanly.
      const next = await Promise.race([
        stdoutIter.next(),
        spawnErr,
      ]) as IteratorResult<Buffer>;
      if (next.done) break;

      buffer += next.value.toString("utf8");
      let nl: number;
      while ((nl = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, nl).trim();
        buffer = buffer.slice(nl + 1);
        if (!line) continue;
        const text = extractText(line);
        if (text) {
          seenAnyOutput = true;
          yield text;
        }
      }
    }
    if (buffer.trim()) {
      const text = extractText(buffer.trim());
      if (text) {
        seenAnyOutput = true;
        yield text;
      }
    }
  } finally {
    if (!proc.killed) proc.kill();
  }

  const code = await new Promise<number | null>((resolve) => {
    if (proc.exitCode !== null) resolve(proc.exitCode);
    else proc.once("close", (c) => resolve(c));
  });

  if (code !== 0 && code !== null) {
    const detail = stderrChunks.join("").trim() || `exit ${code}`;
    throw new Error(
      `claude CLI 가 비정상 종료했습니다 (exit ${code}, skill=${skillFolder}).\n` +
      detail.slice(0, 800)
    );
  }
  if (!seenAnyOutput) {
    throw new Error(
      `claude CLI 가 출력을 내지 않았습니다. Pro/Max 로그인 상태와 ` +
      `\`claude --version\` 동작을 확인하세요.\nstderr: ${stderrChunks.join("").slice(0, 400)}`
    );
  }
}

/**
 * Extract text from Claude Code's stream-json NDJSON output.
 *
 * Event shapes we handle (versions may differ slightly):
 *   - { type: "system", subtype: "init", ... }                       → ignored
 *   - { type: "assistant", message: { content: [{type:"text", text:"..."}] } }
 *   - { type: "content_block_delta", delta: { type: "text_delta", text: "..." } }
 *   - { type: "message_delta", delta: { ... } }                      → ignored (stop reason)
 *   - { type: "result", subtype: "success", result: "..." }          → ignored (already streamed)
 *   - { type: "text", text: "..." }                                  → emit
 *
 * Anything not JSON falls through as raw text so we degrade gracefully on
 * older CLI versions.
 */
function extractText(line: string): string {
  let evt: Record<string, unknown>;
  try {
    evt = JSON.parse(line) as Record<string, unknown>;
  } catch {
    return line + "\n";
  }

  const type = evt.type as string | undefined;

  // SSE-style content block deltas (token-by-token if CLI supports it).
  if (type === "content_block_delta") {
    const delta = evt.delta as { type?: string; text?: string } | undefined;
    if (delta?.type === "text_delta" && typeof delta.text === "string") {
      return delta.text;
    }
    return "";
  }

  // Assistant message events — emit each text block once.
  if (type === "assistant") {
    const content = (evt.message as { content?: unknown } | undefined)?.content;
    if (Array.isArray(content)) {
      const parts: string[] = [];
      for (const block of content) {
        const b = block as { type?: string; text?: unknown } | null;
        if (b && b.type === "text" && typeof b.text === "string") parts.push(b.text);
      }
      return parts.join("");
    }
    return "";
  }

  // Bare text event.
  if (type === "text" && typeof evt.text === "string") {
    return evt.text;
  }

  // Ignore everything else (system init, user echo, message_delta, result, etc.)
  return "";
}
