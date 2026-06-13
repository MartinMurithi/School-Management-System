import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, MiniBars, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CreditCard,
  ServerCog,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({ component: AdminDashboard });

const recentSchools = [
  { name: "Kibera Junior Academy", plan: "Starter", students: 412, status: "Trial", joined: "2d ago" },
  { name: "Eldoret Highlands Sec.", plan: "Scale", students: 1820, status: "Onboarding", joined: "4d ago" },
  { name: "Mombasa Coastal Prep", plan: "Starter", students: 168, status: "Expired", joined: "1w ago" },
  { name: "Nakuru Hills Academy", plan: "Growth", students: 624, status: "Trial", joined: "1w ago" },
  { name: "Thika Valley School", plan: "Scale", students: 2104, status: "Active", joined: "2w ago" },
];

function AdminDashboard() {
  return (
    <>
      <PageHeader
        eyebrow="Super Admin"
        title="Company control tower"
        description="Run tenants, revenue, platform health, onboarding, support, and governance from one place."
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Total tenants" value="248" delta="+12 this month" icon={Building2} />
          <MetricCard label="Active subscriptions" value="231" delta="93.1%" icon={CreditCard} />
          <MetricCard label="MRR" value="KES 4.82M" delta="+8.4%" icon={TrendingUp} />
          <MetricCard label="Active users 24h" value="38,402" delta="+2.1%" icon={Users} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Control tower alerts" description="Revenue, safety, support, and infrastructure risks.">
            <ul className="space-y-3 text-sm">
              {[
                ["14 failed payments", "Grace periods active", "danger"],
                ["6 suspicious login attempts", "Review IP history", "warning"],
                ["3 slow tenants", "Database queries above threshold", "info"],
              ].map(([title, detail, tone]) => (
                <li key={title} className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{title}</div>
                    <div className="text-xs text-muted-foreground">{detail}</div>
                  </div>
                  <StatusBadge tone={tone as "danger" | "warning" | "info"}>{tone}</StatusBadge>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Layer separation" description="Platform operations must stay separate from school operations.">
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg bg-primary-soft p-3 text-primary">
                <ShieldCheck className="mb-2 h-4 w-4" />
                Platform: tenants, subscriptions, support, governance, audit logs
              </div>
              <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                Tenant: students, exams, fees, staff, attendance, school files
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Infrastructure snapshot" description="Operational health across all tenants.">
            <div className="space-y-3 text-sm">
              {[
                ["API p95", "214ms", "success"],
                ["Queue depth", "1,248 jobs", "warning"],
                ["Backups", "01:10 EAT", "success"],
              ].map(([label, value, tone]) => (
                <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-center gap-2">
                    <ServerCog className="h-4 w-4 text-primary" />
                    <span>{label}</span>
                  </div>
                  <StatusBadge tone={tone as "success" | "warning"}>{value}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="MRR progress" description="Expected monthly collection" className="lg:col-span-2">
            <div className="mb-3 flex items-baseline gap-3">
              <div className="font-display text-3xl font-semibold tabular-nums">KES 4,820,500</div>
              <div className="text-xs text-muted-foreground">KES 3,920,000 collected</div>
            </div>
            <ProgressBar value={81.3} tone="success" />
            <MiniBars data={[240, 270, 310, 350, 362, 381, 399, 420, 442, 455, 470, 482]} />
          </SectionCard>

          <SectionCard title="Onboarding conversion" description="Trial to activated tenant">
            <div className="space-y-4">
              {[
                ["Registered", 100],
                ["Tenant created", 91],
                ["Setup complete", 76],
                ["Data imported", 62],
                ["Activated", 54],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{label}</span>
                    <span className="tabular-nums text-muted-foreground">{value}%</span>
                  </div>
                  <ProgressBar value={Number(value)} />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard
          title="Tenant activity"
          description="New and at-risk schools in the operating window"
          padded={false}
          action={
            <Link to="/admin/schools" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
              View registry <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-2.5 font-medium">School</th>
                  <th className="px-5 py-2.5 font-medium">Plan</th>
                  <th className="px-5 py-2.5 text-right font-medium">Students</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 text-right font-medium">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentSchools.map((school) => (
                  <tr key={school.name} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                    <td className="px-5 py-3 font-medium">{school.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{school.plan}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{school.students.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <StatusBadge
                        tone={
                          school.status === "Active"
                            ? "success"
                            : school.status === "Expired"
                              ? "danger"
                              : school.status === "Onboarding"
                                ? "info"
                                : "warning"
                        }
                      >
                        {school.status}
                      </StatusBadge>
                    </td>
                    <td className="px-5 py-3 text-right text-muted-foreground">{school.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
