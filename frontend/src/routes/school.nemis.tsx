import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard, StatusBadge, MetricCard } from "@/components/shell/widgets";
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/school/nemis")({ component: Nemis });

function Nemis() {
  return (
    <>
      <PageHeader eyebrow="Compliance" title="NEMIS"
        description="Export student data for NEMIS uploads · validate before submission"
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-sm hover:bg-muted"><Upload className="h-4 w-4" />Import CSV</button>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm"><Download className="h-4 w-4" />Export to NEMIS</button>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total learners" value="1,284" icon={FileSpreadsheet} />
          <MetricCard label="With NEMIS no." value="1,261" delta="98.2%" trend="up" icon={CheckCircle2} />
          <MetricCard label="Missing" value="23" delta="needs attention" trend="down" icon={AlertTriangle} />
          <MetricCard label="Last export" value="Apr 14" icon={Download} hint="14 days ago" />
        </div>

        <SectionCard title="Validation results" description="Run before exporting to avoid rejected uploads">
          <ul className="divide-y divide-border -my-2">
            {[
              { i: CheckCircle2, t: "1,261 learners have valid NEMIS numbers", tone: "success" as const, c: "text-success" },
              { i: AlertTriangle, t: "23 learners are missing NEMIS assignment", tone: "warning" as const, c: "text-warning-foreground" },
              { i: AlertTriangle, t: "4 duplicate names detected (review before export)", tone: "warning" as const, c: "text-warning-foreground" },
              { i: CheckCircle2, t: "Birth certificate numbers present for 1,278 learners", tone: "success" as const, c: "text-success" },
            ].map((r) => (
              <li key={r.t} className="py-3 flex items-center gap-3 text-sm">
                <r.i className={`h-4 w-4 ${r.c}`} />
                <span className="flex-1">{r.t}</span>
                <StatusBadge tone={r.tone}>{r.tone === "success" ? "Pass" : "Review"}</StatusBadge>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Export queue">
          <div className="rounded-lg border border-border bg-surface p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-info/15 text-info grid place-items-center"><FileSpreadsheet className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="font-medium text-sm">Term 2 · Grade 1–6 enrollment</div>
              <div className="text-xs text-muted-foreground">1,261 learners · ready to export</div>
            </div>
            <button className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium">Download CSV</button>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
