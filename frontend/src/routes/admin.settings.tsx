import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";

export const Route = createFileRoute("/admin/settings")({ component: AdminSettings });

const plans = [
  { name: "Starter", price: "KES 9,000 / mo", limit: "Up to 300 students", modules: "SIS, fees, basic reports" },
  { name: "Growth", price: "KES 26,000 / mo", limit: "Up to 1,000 students", modules: "M-PESA, CBC, exams, SMS" },
  { name: "Scale", price: "KES 58,000 / mo", limit: "Unlimited, multi-campus", modules: "All modules, priority support" },
];

function AdminSettings() {
  return (
    <>
      <PageHeader
        eyebrow="System"
        title="Platform settings"
        description="Default plans, tenant templates, retention policies, and table boundaries."
      />
      <PageBody>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <SectionCard key={plan.name} title={plan.name} description={plan.limit}>
              <div className="font-display text-2xl font-semibold">{plan.price}</div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.modules}</p>
            </SectionCard>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Default tenant templates" description="Preload school setup to reduce manual onboarding.">
            <div className="space-y-3 text-sm">
              {[
                ["CBC Primary", "classes, strands, rubrics, fee groups"],
                ["Secondary 8-4-4", "forms, streams, grading, exam templates"],
                ["Hybrid school", "CBC + 8-4-4 setup with shared finance"],
              ].map(([name, detail]) => (
                <div key={name} className="rounded-lg border border-border bg-surface p-3">
                  <div className="font-medium">{name}</div>
                  <div className="text-xs text-muted-foreground">{detail}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Data architecture" description="Keep platform tables separate from school tables.">
            <div className="grid gap-3 text-sm">
              <div className="rounded-lg bg-primary-soft p-3 text-primary">
                <div className="font-medium">Platform tables</div>
                <div className="mt-1 text-xs">
                  tenants, subscriptions, platform_users, invoices, support_tickets, announcements, audit_logs
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3 text-muted-foreground">
                <div className="font-medium">School tables</div>
                <div className="mt-1 text-xs">students, exams, finance, attendance, staff, files, timetable</div>
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Platform defaults" description="Operational policies used by new tenants.">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Trial length", "30 days", "info"],
              ["Grace period", "14 days read-only", "warning"],
              ["Data retention", "7 years archived", "success"],
              ["MFA policy", "Required for platform users", "success"],
            ].map(([label, value, tone]) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-4">
                <div className="text-xs text-muted-foreground">{label}</div>
                <div className="mt-2"><StatusBadge tone={tone as "info" | "warning" | "success"}>{value}</StatusBadge></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
