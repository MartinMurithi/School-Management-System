import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Eye, FileClock, KeyRound, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";

export const Route = createFileRoute("/admin/security")({ component: SecurityAudit });

const roles = [
  { name: "Owner", users: 1, scope: "Full platform control", mfa: "Required" },
  { name: "Platform Admin", users: 3, scope: "Tenant, billing, governance", mfa: "Required" },
  { name: "Billing Admin", users: 2, scope: "Invoices, plans, payments", mfa: "Required" },
  { name: "Support Agent", users: 8, scope: "Tickets and approved tenant access", mfa: "Required" },
];

const audit = [
  {
    time: "10:42",
    actor: "Jane Mwangi",
    action: "Suspended tenant",
    target: "Meru Vision Schools",
    reason: "30 days overdue",
    risk: "High",
  },
  {
    time: "09:18",
    actor: "Peter Kariuki",
    action: "Opened tenant workspace",
    target: "Kibera Junior Academy",
    reason: "Ticket #4821",
    risk: "Normal",
  },
  {
    time: "08:55",
    actor: "System",
    action: "Sent renewal reminders",
    target: "14 overdue tenants",
    reason: "Billing automation",
    risk: "Low",
  },
  {
    time: "Yesterday",
    actor: "Amina Otieno",
    action: "Changed plan limit",
    target: "Scale plan",
    reason: "Board-approved pricing update",
    risk: "Normal",
  },
];

function SecurityAudit() {
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="Security & audit"
        description="Super Admin access control, sensitive actions, tenant access monitoring, and platform audit trail."
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Super admins" value="14" delta="4 roles" icon={UserCog} />
          <MetricCard label="MFA coverage" value="100%" delta="Required" icon={KeyRound} />
          <MetricCard label="Suspicious logins" value="6" delta="+2 today" trend="down" icon={ShieldAlert} />
          <MetricCard label="Audited actions" value="1,284" delta="30 days" icon={FileClock} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
          <SectionCard title="Super Admin roles" description="Privilege separation inside the platform layer.">
            <div className="space-y-3">
              {roles.map((role) => (
                <div key={role.name} className="rounded-lg border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{role.name}</div>
                    <StatusBadge tone="success">{role.mfa}</StatusBadge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{role.scope}</div>
                  <div className="mt-3 text-xs tabular-nums text-muted-foreground">{role.users} users</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Audit log" description="Every sensitive action should be traceable." padded={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Time</th>
                    <th className="px-5 py-2.5 font-medium">Actor</th>
                    <th className="px-5 py-2.5 font-medium">Action</th>
                    <th className="px-5 py-2.5 font-medium">Target</th>
                    <th className="px-5 py-2.5 font-medium">Reason</th>
                    <th className="px-5 py-2.5 font-medium">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((entry) => (
                    <tr key={`${entry.time}-${entry.action}`} className="border-b border-border/60 last:border-0 hover:bg-muted/40">
                      <td className="px-5 py-3 text-muted-foreground">{entry.time}</td>
                      <td className="px-5 py-3 font-medium">{entry.actor}</td>
                      <td className="px-5 py-3">{entry.action}</td>
                      <td className="px-5 py-3 text-muted-foreground">{entry.target}</td>
                      <td className="px-5 py-3 text-muted-foreground">{entry.reason}</td>
                      <td className="px-5 py-3">
                        <StatusBadge tone={entry.risk === "High" ? "danger" : entry.risk === "Normal" ? "info" : "neutral"}>
                          {entry.risk}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Tenant access guardrails">
            <div className="space-y-3 text-sm">
              {["Ticket reason required", "Time-boxed access", "Visible to tenant owner"].map((guardrail) => (
                <div key={guardrail} className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span>{guardrail}</span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Login monitoring">
            <div className="space-y-3 text-sm">
              {["6 failed attempts", "2 new IP addresses", "0 impossible-travel events"].map((event) => (
                <div key={event} className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <span>{event}</span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Mandatory controls">
            <div className="space-y-3 text-sm">
              {["MFA for all platform users", "Audit billing edits", "Audit tenant suspension"].map((control) => (
                <div key={control} className="rounded-lg border border-border bg-surface p-3">
                  {control}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
