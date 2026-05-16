import { JourneyMap } from "@/components/JourneyMap";
import { QuickStart } from "@/components/QuickStart";
import { SkillGrid } from "@/components/SkillGrid";

export default function DashboardHome() {
  return (
    <>
      <QuickStart />
      <div className="section-divider" />

      <section className="section">
        <div className="section-header">
          <div className="section-overline">Workflow</div>
          <div className="section-title">설교 준비 여정</div>
          <div className="section-subtitle">
            단계를 클릭하면 왼쪽 사이드바에서 해당 스킬이 열립니다
          </div>
        </div>
        <JourneyMap />
      </section>

      <div className="section-divider" />

      <section className="section">
        <div className="section-header">
          <div className="section-overline">All Skills</div>
          <div className="section-title">스킬을 선택하세요</div>
          <div className="section-subtitle">
            원하는 스킬을 클릭하면 바로 실행 화면으로 이동합니다
          </div>
        </div>
        <SkillGrid />
      </section>
    </>
  );
}
