"use client";

import { useUi } from "@/lib/store";
import type { CategoryId } from "@/lib/skills";

const CHIPS: { id: CategoryId; icon: string; label: string }[] = [
  { id: "planning",   icon: "📋", label: "주제 선정" },
  { id: "analysis",   icon: "📖", label: "본문 분석" },
  { id: "theology",   icon: "🎓", label: "신학자 코칭" },
  { id: "writing",    icon: "✍️", label: "설교문 작성" },
  { id: "validation", icon: "👥", label: "회중 검증" },
];

export function QuickStart() {
  const flash = useUi((s) => s.flash);

  return (
    <div className="quick-start">
      {CHIPS.map((c) => (
        <button
          key={c.id}
          className="quick-chip"
          onClick={() => {
            flash(c.id);
            document.getElementById(`acc-${c.id}`)?.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          }}
        >
          <span className="icon">{c.icon}</span> {c.label}
        </button>
      ))}
    </div>
  );
}
