import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard-shell fade-in">
      <Sidebar />
      <main className="dashboard-main">
        <TopBar />
        {children}
        <footer className="footer">
          CYS Claude Sermon Skills · <a href="#">sermon-skills.vercel.app</a> · 21 AI Skills
        </footer>
      </main>
    </div>
  );
}
