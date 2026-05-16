"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES, skillsByCategory, type CategoryId } from "@/lib/skills";
import { useUi } from "@/lib/store";

export function Sidebar() {
  const params = useParams<{ skillId?: string }>();
  const activeSkillId = params?.skillId;
  const open = useUi((s) => s.openAccordion);
  const toggle = useUi((s) => s.toggleAccordion);
  const flashCat = useUi((s) => s.flashCategory);

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-header">
        <div className="sidebar-logo">S</div>
        <div className="sidebar-header-text">
          <h2>Sermon Skills</h2>
          <span>21개 AI 설교 스킬</span>
        </div>
      </Link>

      <div className="sidebar-body">
        {CATEGORIES.map((cat) => {
          const skills = skillsByCategory(cat.id);
          const isOpen = open === cat.id;
          const isFlash = flashCat === cat.id;
          return (
            <div
              key={cat.id}
              id={`acc-${cat.id}`}
              className={`accordion${isFlash ? " flash" : ""}`}
            >
              <button
                className={`accordion-trigger${isOpen ? " open" : ""}`}
                onClick={() => toggle(cat.id)}
                aria-expanded={isOpen}
              >
                <span className="accordion-step">{cat.step}</span>
                <span className="accordion-icon">{cat.icon}</span>
                {cat.name}
                <span className="accordion-count">{skills.length}</span>
                <span className="accordion-arrow">▼</span>
              </button>
              <div className={`accordion-content${isOpen ? " open" : ""}`}>
                {skills.map((skill) => {
                  const active = activeSkillId === skill.id;
                  return (
                    <Link
                      key={skill.id}
                      href={`/dashboard/${skill.id}`}
                      className={`skill-item${active ? " active-skill" : ""}`}
                      data-skill-id={skill.id}
                    >
                      <span className="skill-item-name">{skill.name}</span>
                      <span className="skill-item-run" role="presentation">
                        실행
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-text">sermon-skills.vercel.app</div>
      </div>
    </aside>
  );
}

export type { CategoryId };
