import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Ban, DatabaseZap, Flag, LockKeyhole, RotateCcw, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/admin/governance")({ component: Governance });

const policies = [
  {
    name: "Tenant isolation",
    state: "Enforced",
    detail: "Every request must resolve a tenant before school-level data is loaded.",
    tone: "success" as const,
  },
  {
    name: "Overdue suspension",
    state: "Grace policy",
    detail: "Read-only after 14 days overdue, full lockout after 30 days unless exempted.",
    tone: "warning" as const,
  },
  {
    name: "Data retention",
    state: "Protected",
    detail: "Suspended tenants keep data; archived tenants retain encrypted backups for 7 years.",
    tone: "success" as const,
  },
  {
    name: "Support access",
    state: "Audited",
    detail: "Support agents need a ticket reason before opening a tenant workspace.",
    tone: "info" as const,
  },
];

const featureFlags = [
  { name: "CBC rubric library v2", scope: "48 beta schools", state: "Beta" },
  { name: "M-PESA auto-reconciliation", scope: "All Growth + Scale", state: "Enabled" },
  { name: "Transport module", scope: "12 pilot schools", state: "Pilot" },
  { name: "Parent mobile portal", scope: "Starter excluded", state: "Limited" },
];

function Governance() {
  return (
    <>
      <PageHeader
        eyebrow="Platform layer"
        title="System governance"
        description="Platform-wide rules, feature flags, suspension controls, and tenant configuration defaults."
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Isolated tenants" value="248" delta="100%" icon={LockKeyhole} />
          <MetricCard label="Feature flags" value="18" delta="4 beta" icon={Flag} />
          <MetricCard label="Suspended" value="7" delta="3 read-only" trend="flat" icon={Ban} />
          <MetricCard label="Restored this month" value="11" delta="avg 4m" icon={RotateCcw} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Governance policies" description="Rules that protect the SaaS platform and every tenant.">
            <div className="space-y-3">
              {policies.map((policy) => (
                <div key={policy.name} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{policy.name}</div>
                    <StatusBadge tone={policy.tone}>{policy.state}</StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{policy.detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Feature flags" description="Control beta modules, experiments, and plan-gated features.">
            <ul className="divide-y divide-border">
              {featureFlags.map((flag) => (
                <li key={flag.name} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <div className="text-sm font-medium">{flag.name}</div>
                    <div className="text-xs text-muted-foreground">{flag.scope}</div>
                  </div>
                  <StatusBadge tone={flag.state === "Enabled" ? "success" : "primary"}>{flag.state}</StatusBadge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Suspension controls" description="Lock access without destroying school data.">
            <div className="space-y-3 text-sm">
              {["Read-only mode", "Partial module lock", "Full tenant lockout"].map((mode, index) => (
                <div key={mode} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                  <span>{mode}</span>
                  <StatusBadge tone={index === 0 ? "warning" : "neutral"}>{index === 0 ? "Default" : "Manual"}</StatusBadge>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Tenant configuration" description="Per-school behavior and plan limits.">
            <div className="space-y-3 text-sm">
              {["Modules enabled", "Branding", "SMS provider", "Grading system"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Data boundaries" description="Platform tables stay separate from school tables.">
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-primary-soft p-3 text-primary">
                <DatabaseZap className="mb-2 h-4 w-4" />
                Platform: tenants, subscriptions, invoices, support, audit logs
              </div>
              <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                Tenant: students, exams, finance, attendance, staff, files
              </div>
            </div>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
