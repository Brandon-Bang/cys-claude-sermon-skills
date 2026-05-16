"use client";

import Link from "next/link";
import { useRouter, useParams, usePathname } from "next/navigation";
import { getSkill } from "@/lib/skills";
import { RunnerBadge } from "./RunnerBadge";
import { ModelPicker } from "./ModelPicker";

export function TopBar() {
  const router = useRouter();
  const params = useParams<{ skillId?: string }>();
  const pathname = usePathname();
  const skill = params?.skillId ? getSkill(params.skillId) : undefined;
  const isSkillPage = !!skill;
  const isDashboardHome = pathname === "/dashboard";

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="nav-btns">
          <button
            className="nav-btn"
            onClick={() => router.back()}
            title="뒤로"
            aria-label="뒤로"
          >
            ←
          </button>
          <button
            className="nav-btn"
            onClick={() => router.forward()}
            title="앞으로"
            aria-label="앞으로"
          >
            →
          </button>
        </div>
        <div className="top-bar-breadcrumb">
          {isSkillPage ? (
            <>
              <Link href="/dashboard" className="bc-link">대시보드</Link>
              <span className="bc-sep">›</span>
              <span className="bc-current">{skill!.name}</span>
            </>
          ) : isDashboardHome ? (
            <span className="bc-current">대시보드</span>
          ) : (
            <Link href="/dashboard" className="bc-link">대시보드</Link>
          )}
        </div>
      </div>
      <div className="top-bar-right">
        <ModelPicker />
        <RunnerBadge />
      </div>
    </div>
  );
}
