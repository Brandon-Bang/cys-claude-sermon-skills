/**
 * Save the full output of one skill execution to disk as a Markdown file.
 *
 * Layout (relative to repo root):
 *   outputs/<skill-id>/<YYYYMMDD-HHMMSS>_<verse-slug>.md          — completed
 *   outputs/<skill-id>/<YYYYMMDD-HHMMSS>_<verse-slug>.partial.md  — stream errored mid-flight
 *   outputs/<skill-id>/<YYYYMMDD-HHMMSS>_<verse-slug>.failed.md   — runner failed (empty output)
 *
 * The directory root can be overridden with the OUTPUTS_DIR env var
 * (absolute path or relative to web/ process.cwd). Default = `<repo root>/outputs`.
 *
 * This function is best-effort: it returns a result object instead of throwing,
 * so a disk failure can never break the streaming response.
 */

import { promises as fs } from "node:fs";
import { join, isAbsolute } from "node:path";

export type SaveStatus = "completed" | "partial" | "failed";

export interface SaveOutputInput {
  skillId: string;
  skillName: string;
  verse: string;
  extra: string;
  model?: string;
  modelLabel?: string;
  runner: string;
  output: string;
  startedAt: number;
  durationMs: number;
  status: SaveStatus;
  error?: string;
}

export type SaveResult =
  | { ok: true; path: string; status: SaveStatus }
  | { ok: false; reason: string };

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function timestampStem(d: Date): string {
  return (
    d.getFullYear().toString() +
    pad2(d.getMonth() + 1) +
    pad2(d.getDate()) +
    "-" +
    pad2(d.getHours()) +
    pad2(d.getMinutes()) +
    pad2(d.getSeconds())
  );
}

function isoLocal(d: Date): string {
  const tzMin = -d.getTimezoneOffset();
  const sign = tzMin >= 0 ? "+" : "-";
  const a = Math.abs(tzMin);
  return (
    d.getFullYear() +
    "-" + pad2(d.getMonth() + 1) +
    "-" + pad2(d.getDate()) +
    "T" + pad2(d.getHours()) +
    ":" + pad2(d.getMinutes()) +
    ":" + pad2(d.getSeconds()) +
    sign + pad2(Math.floor(a / 60)) + ":" + pad2(a % 60)
  );
}

function slugify(s: string, max = 40): string {
  // Strip filesystem-forbidden chars on Windows/POSIX; keep Unicode letters
  // (Korean / Greek / Hebrew survive — modern filesystems are UTF-8 fine).
  const cleaned = s
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[\s.\-]+|[\s.\-]+$/g, "");
  return cleaned.slice(0, max) || "untitled";
}

function yamlQuote(s: string): string {
  return (
    '"' +
    s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n") +
    '"'
  );
}

function yamlBlock(s: string, indent = "  "): string {
  return "|\n" + s.split(/\r?\n/).map((l) => indent + l).join("\n");
}

function resolveOutputsDir(): string {
  const explicit = process.env.OUTPUTS_DIR;
  if (explicit && explicit.trim()) {
    return isAbsolute(explicit) ? explicit : join(process.cwd(), explicit);
  }
  // When `npm run dev` runs inside web/, process.cwd() = .../web → parent is repo root.
  return join(process.cwd(), "..", "outputs");
}

export async function saveSkillOutput(input: SaveOutputInput): Promise<SaveResult> {
  try {
    const outRoot = resolveOutputsDir();
    const dir = join(outRoot, input.skillId);
    await fs.mkdir(dir, { recursive: true });

    const now = new Date();
    const stem = `${timestampStem(now)}_${slugify(input.verse)}`;
    const suffix =
      input.status === "completed" ? ".md"
        : input.status === "partial" ? ".partial.md"
          : ".failed.md";
    const file = join(dir, stem + suffix);

    const lines: string[] = [
      "---",
      `skill: ${input.skillId}`,
      `skillName: ${yamlQuote(input.skillName)}`,
      `verse: ${yamlQuote(input.verse)}`,
    ];
    if (input.extra) lines.push(`extra: ${yamlBlock(input.extra)}`);
    if (input.model) lines.push(`model: ${input.model}`);
    if (input.modelLabel) lines.push(`modelLabel: ${yamlQuote(input.modelLabel)}`);
    lines.push(`runner: ${input.runner}`);
    lines.push(`startedAt: ${isoLocal(new Date(input.startedAt))}`);
    lines.push(`durationMs: ${input.durationMs}`);
    lines.push(`status: ${input.status}`);
    if (input.error) lines.push(`error: ${yamlBlock(input.error)}`);
    lines.push("---", "");

    const body = input.output.endsWith("\n") ? input.output : input.output + "\n";
    await fs.writeFile(file, lines.join("\n") + body, { encoding: "utf8" });
    return { ok: true, path: file, status: input.status };
  } catch (err) {
    return { ok: false, reason: (err as Error).message };
  }
}
