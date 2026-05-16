import { readFile } from "node:fs/promises";
import { join } from "node:path";

export function skillsDir(): string {
  if (process.env.SKILLS_DIR) return process.env.SKILLS_DIR;
  // /web/lib/system-prompt.ts → repo root is two levels up
  return join(process.cwd(), "..", "skills");
}

export async function readSkillMd(folder: string): Promise<string> {
  const path = join(skillsDir(), folder, "SKILL.md");
  return readFile(path, "utf8");
}

const ENVELOPE = `
You are operating as a focused Sermon Skill on behalf of the user.

The block below is the SKILL specification you must follow (frontmatter + body).
Treat its "description", "when to use" cues, and any explicit instructions as
your operating contract. Respond in Korean unless the user writes in another
language. Cite scripture references when relevant. Do not invent sources.

==================== SKILL ====================
`.trim();

const ENVELOPE_END = "\n==================== END SKILL ====================\n";

export async function buildSystemPrompt(folder: string): Promise<string> {
  const md = await readSkillMd(folder);
  return `${ENVELOPE}\n${md}${ENVELOPE_END}`;
}
