import { createFileRoute } from "@tanstack/react-router";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { workloadAnalytics } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff/workload")({ component: WorkloadAnalyticsPage });

function WorkloadAnalyticsPage() {
  const overload = workloadAnalytics.filter((item) => item.state === "Overload").length;
  const optimal = workloadAnalytics.filter((item) => item.state === "Optimal").length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Teachers reviewed" value={String(workloadAnalytics.length)} />
        <MetricCard label="Overload alerts" value={String(overload)} />
        <MetricCard label="Optimal load" value={String(optimal)} />
        <MetricCard label="Average load" value="26 hrs" />
      </div>

      <SectionCard title="Workload Analytics" description="Teaching load analysis, lesson distribution, and overload alerts.">
        <ul className="space-y-3">
          {workloadAnalytics.map((item) => (
            <li key={item.teacher}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{item.teacher}</span>
                <span className="tabular-nums text-muted-foreground">{item.weekly} hrs/week</span>
              </div>
              <ProgressBar value={(item.weekly / 35) * 100} tone={item.state === "Overload" ? "danger" : item.state === "Optimal" ? "success" : "warning"} />
              <div className="mt-1">
                <StatusBadge tone={item.state === "Overload" ? "danger" : item.state === "Optimal" ? "success" : "warning"}>{item.state}</StatusBadge>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
