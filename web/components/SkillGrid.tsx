import Link from "next/link";
import { SKILLS, CATEGORIES, getCategory } from "@/lib/skills";

export function SkillGrid() {
  // Render in workflow order
  const ordered = CATEGORIES.flatMap((cat) => SKILLS.filter((s) => s.category === cat.id));

  return (
    <div className="all-skills-grid">
      {ordered.map((skill) => {
        const cat = getCategory(skill.category);
        return (
          <Link
            key={skill.id}
            href={`/dashboard/${skill.id}`}
            className="skill-card"
          >
            <div className="skill-card-cat" style={{ color: cat.colorVar }}>
              {cat.icon} {cat.name}
            </div>
            <div className="skill-card-name">{skill.name}</div>
            <div className="skill-card-desc">{skill.desc}</div>
            <span className="skill-card-run">실행 →</span>
          </Link>
        );
      })}
    </div>
  );
}
