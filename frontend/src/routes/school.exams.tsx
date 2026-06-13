import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge, ProgressBar } from "@/components/shell/widgets";
import { ClipboardCheck, TrendingUp, FileText, Save } from "lucide-react";

export const Route = createFileRoute("/school/exams")({ component: Exams });

const marks = [
  { adm: "042/2026", name: "Aisha Mwende", c1: 78, c2: 82, exam: 71 },
  { adm: "118/2025", name: "Brian Otieno", c1: 65, c2: 71, exam: 68 },
  { adm: "204/2026", name: "Faith Wanjiru", c1: 88, c2: 91, exam: 89 },
  { adm: "201/2026", name: "Daniel Kiprop", c1: 54, c2: 60, exam: 58 },
  { adm: "099/2025", name: "Esther Achieng", c1: 72, c2: 76, exam: 74 },
  { adm: "311/2024", name: "George Mutua", c1: 81, c2: 78, exam: 80 },
];

function grade(s: number) {
  if (s >= 80) return { l: "A", t: "success" as const };
  if (s >= 70) return { l: "B", t: "info" as const };
  if (s >= 60) return { l: "C", t: "primary" as const };
  if (s >= 50) return { l: "D", t: "warning" as const };
  return { l: "E", t: "danger" as const };
}

function Exams() {
  return (
    <>
      <PageHeader eyebrow="Academics" title="Exams & Grading" description="Mid-term · Grade 5 East · Mathematics"
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-sm hover:bg-muted"><FileText className="h-4 w-4" />Generate report cards</button>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"><Save className="h-4 w-4" />Save & publish</button>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Ongoing exams" value="4" icon={ClipboardCheck} hint="Mid-term · Term 2" />
          <MetricCard label="Marks entered" value="78%" delta="+12pt today" trend="up" icon={TrendingUp} />
          <MetricCard label="Mean score" value="72.4" delta="+3.1" trend="up" icon={TrendingUp} />
          <MetricCard label="Pass rate" value="89%" delta="+2pt" trend="up" icon={TrendingUp} />
        </div>

        <SectionCard title="Subject completion" description="Marks entry progress · Mid-term">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: "Mathematics", v: 92, t: "success" as const },
              { l: "English", v: 81, t: "success" as const },
              { l: "Kiswahili", v: 64, t: "warning" as const },
              { l: "Science", v: 78, t: "primary" as const },
              { l: "Social Studies", v: 55, t: "warning" as const },
              { l: "CRE", v: 40, t: "danger" as const },
              { l: "Creative Arts", v: 70, t: "primary" as const },
              { l: "Agriculture", v: 88, t: "success" as const },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border border-border bg-surface p-3">
                <div className="flex justify-between text-xs mb-1.5"><span className="text-muted-foreground">{s.l}</span><span className="tabular-nums">{s.v}%</span></div>
                <ProgressBar value={s.v} tone={s.t} />
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Marks entry · Mathematics · Grade 5 East" description="Tab to move horizontally · auto-saves" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/40">
                  <th className="px-5 py-2.5 font-medium">Adm</th>
                  <th className="px-5 py-2.5 font-medium">Student</th>
                  <th className="px-5 py-2.5 font-medium text-center w-24">CAT 1<br /><span className="font-normal normal-case text-[10px]">/100</span></th>
                  <th className="px-5 py-2.5 font-medium text-center w-24">CAT 2<br /><span className="font-normal normal-case text-[10px]">/100</span></th>
                  <th className="px-5 py-2.5 font-medium text-center w-24">Exam<br /><span className="font-normal normal-case text-[10px]">/100</span></th>
                  <th className="px-5 py-2.5 font-medium text-center w-24">Mean</th>
                  <th className="px-5 py-2.5 font-medium text-center w-20">Grade</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((m) => {
                  const mean = Math.round((m.c1 + m.c2 + m.exam) / 3);
                  const g = grade(mean);
                  return (
                    <tr key={m.adm} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-2 font-mono text-xs text-muted-foreground">{m.adm}</td>
                      <td className="px-5 py-2 font-medium">{m.name}</td>
                      <td className="px-2 py-1.5 text-center"><input defaultValue={m.c1} className="w-16 text-center bg-transparent border border-transparent hover:border-border focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 tabular-nums outline-none" /></td>
                      <td className="px-2 py-1.5 text-center"><input defaultValue={m.c2} className="w-16 text-center bg-transparent border border-transparent hover:border-border focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 tabular-nums outline-none" /></td>
                      <td className="px-2 py-1.5 text-center"><input defaultValue={m.exam} className="w-16 text-center bg-transparent border border-transparent hover:border-border focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20 rounded-md py-1.5 tabular-nums outline-none" /></td>
                      <td className="px-5 py-2 text-center tabular-nums font-medium">{mean}</td>
                      <td className="px-5 py-2 text-center"><StatusBadge tone={g.t} dot={false}>{g.l}</StatusBadge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-5 py-3 border-t border-border text-xs text-muted-foreground bg-surface">
            <div className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />Autosaved 2s ago</div>
            <div>6 of 42 students</div>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
