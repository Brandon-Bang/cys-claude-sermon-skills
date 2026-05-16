import { notFound } from "next/navigation";
import { getSkill, SKILLS } from "@/lib/skills";
import { SkillExecForm } from "@/components/SkillExecForm";

export function generateStaticParams() {
  return SKILLS.map((s) => ({ skillId: s.id }));
}

export default async function SkillPage({
  params,
}: {
  params: Promise<{ skillId: string }>;
}) {
  const { skillId } = await params;
  const skill = getSkill(skillId);
  if (!skill) notFound();
  return <SkillExecForm skill={skill} />;
}
