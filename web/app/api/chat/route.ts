import { NextResponse, type NextRequest } from "next/server";
import { basename, relative } from "node:path";
import { getSkill } from "@/lib/skills";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { getRunner, getRunnerMode } from "@/lib/runners";
import { isKnownModel, getModelOption } from "@/lib/models";
import { saveSkillOutput, type SaveStatus } from "@/lib/output-saver";
import {
  serialize,
  STAGE_LABELS,
  type StageId,
  type StreamEvent,
} from "@/lib/protocol";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Body {
  skillId?: string;
  verse?: string;
  extra?: string;
  model?: string;
}

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const skill = body.skillId ? getSkill(body.skillId) : undefined;
  if (!skill) {
    return NextResponse.json({ error: "Unknown skillId" }, { status: 400 });
  }
  const verse = (body.verse || "").trim();
  if (!verse) {
    return NextResponse.json({ error: "verse is required" }, { status: 400 });
  }
  const extra = (body.extra || "").trim();
  const userMessage =
    `[성경 본문/주제]\n${verse}` + (extra ? `\n\n[추가 요청]\n${extra}` : "");

  // Validate the requested model id against our catalog. Unknown / empty → runner default.
  const model = isKnownModel(body.model) ? body.model : undefined;

  const t0 = Date.now();
  const encoder = new TextEncoder();
  const runnerMode = getRunnerMode();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (evt: StreamEvent) => {
        controller.enqueue(encoder.encode(serialize(evt)));
      };
      const stage = (id: StageId, label?: string) =>
        emit({ type: "stage", id, label: label || STAGE_LABELS[id], t: Date.now() - t0 });
      const fail = (message: string) => {
        emit({ type: "error", message, t: Date.now() - t0 });
      };

      stage("received");

      let systemPrompt: string;
      try {
        systemPrompt = await buildSystemPrompt(skill.folder);
      } catch (err) {
        fail(`SKILL.md 로드 실패 (${skill.folder}): ${(err as Error).message}`);
        controller.close();
        return;
      }
      stage("skill-loaded");

      let stream;
      try {
        stream = await getRunner().run({
          skillFolder: skill.folder,
          systemPrompt,
          userMessage,
          model,
        });
      } catch (err) {
        fail(`Runner(${runnerMode}) 시작 실패: ${(err as Error).message}`);
        controller.close();
        return;
      }
      const modelOpt = model ? getModelOption(model) : null;
      const modelLabelSuffix = modelOpt ? ` · ${modelOpt.label}` : "";
      stage("runner-start", `Claude ${runnerMode === "cli" ? "CLI" : "API"} 호출 시작${modelLabelSuffix}`);

      let sawAnyText = false;
      const collected: string[] = [];
      let saveStatus: SaveStatus = "completed";
      let streamError: string | undefined;

      try {
        for await (const chunk of stream) {
          if (!chunk) continue;
          if (!sawAnyText) {
            sawAnyText = true;
            stage("first-token");
          }
          collected.push(chunk);
          emit({ type: "text", data: chunk });
        }
        stage("done");
      } catch (err) {
        streamError = (err as Error).message;
        saveStatus = sawAnyText ? "partial" : "failed";
        fail(`스트리밍 중 오류: ${streamError}`);
      }

      // Best-effort local archive of the run (gitignored).
      try {
        const result = await saveSkillOutput({
          skillId: skill.id,
          skillName: skill.name,
          verse,
          extra,
          model,
          modelLabel: modelOpt?.label,
          runner: runnerMode,
          output: collected.join(""),
          startedAt: t0,
          durationMs: Date.now() - t0,
          status: saveStatus,
          error: streamError,
        });
        if (result.ok) {
          // Prefer a short repo-relative path; fall back to basename if outside cwd.
          const repoRoot = relative(process.cwd(), result.path);
          const short = repoRoot && !repoRoot.startsWith("..") ? repoRoot : basename(result.path);
          emit({
            type: "stage",
            id: "saved",
            label: `로컬 저장: ${short}`,
            t: Date.now() - t0,
          });
        }
      } catch {
        // Saving must never break the response — ignore.
      }

      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Runner-Mode": runnerMode,
    },
  });
}

export async function GET() {
  return NextResponse.json({ runner: getRunnerMode() });
}
