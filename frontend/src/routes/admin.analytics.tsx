import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, MiniBars, ProgressBar, SectionCard, Sparkline, StatusBadge } from "@/components/shell/widgets";
import { Activity, Building2, Database, Percent, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({ component: Analytics });

function Analytics() {
  return (
    <>
      <PageHeader
        eyebrow="Command center"
        title="Platform analytics"
        description="Growth, revenue, usage, feature adoption, and performance signals across all tenants."
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="School growth" value="+12" delta="+25% MoM" icon={Building2} />
          <MetricCard label="User growth" value="+3,420" delta="+9.1%" icon={Users} />
          <MetricCard label="Activation rate" value="86%" delta="+4.2pt" icon={TrendingUp} />
          <MetricCard label="Churn" value="1.8%" delta="-0.3pt" trend="down" icon={Percent} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Schools onboarded - 12 months">
            <Sparkline data={[6, 8, 7, 9, 11, 10, 14, 13, 16, 15, 18, 22]} />
          </SectionCard>
          <SectionCard title="Daily active users - 14 days">
            <MiniBars data={[210, 245, 268, 290, 310, 295, 330, 312, 340, 358, 372, 390, 405, 420]} />
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Feature adoption" description="Which modules schools use most." className="lg:col-span-2">
            <div className="space-y-4">
              {[
                ["Finance & M-PESA", 94],
                ["Student information", 91],
                ["Exams & grading", 78],
                ["NEMIS exports", 71],
                ["CBC competencies", 62],
                ["Timetable builder", 48],
              ].map(([label, value]) => (
                <div key={label as string} className="flex items-center gap-4">
                  <div className="w-48 text-sm">{label}</div>
                  <div className="flex-1"><ProgressBar value={Number(value)} /></div>
                  <div className="w-10 text-right text-sm tabular-nums text-muted-foreground">{value}%</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Tenant performance" description="Slow tenants and infrastructure pressure.">
            <div className="space-y-3 text-sm">
              {[
                ["API p95", "214ms", "success"],
                ["DB load", "61%", "info"],
                ["Slow tenants", "3", "warning"],
                ["Failed jobs", "18", "danger"],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-center gap-2">
                    {label === "DB load" ? <Database className="h-4 w-4 text-primary" /> : <Activity className="h-4 w-4 text-primary" />}
                    <span>{label}</span>
                  </div>
                  <StatusBadge tone={tone as "success" | "info" | "warning" | "danger"}>{value}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Business health">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ["MRR", "KES 4.82M"],
              ["ARR run-rate", "KES 57.8M"],
              ["Net revenue retention", "108%"],
              ["Avg revenue per school", "KES 19.4K"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-4">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
