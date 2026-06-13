import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Layers3,
  School,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
} from "lucide-react";
import { useAdminBillingStore } from "@/lib/admin-billing-store";
import { useAdminOnboardingStore } from "@/lib/admin-onboarding-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/school/dashboard")({ component: SchoolDashboard });

function SchoolDashboard() {
  const { accounts } = useAdminOnboardingStore();
  const { schools } = useAdminSchoolStore();
  const { plans } = useAdminBillingStore();
  const tenant =
    accounts.find((account) => account.id === "starlight-education-group") ??
    accounts.find((account) => (account.schools?.length ?? 0) > 1) ??
    accounts[0];
  const declaredSchools = tenant?.schools ?? [];
  const configuredSchools = schools.filter((school) => school.tenancyId === tenant?.id);
  const configuredIds = new Set(configuredSchools.map((school) => school.id));
  const completedCount = declaredSchools.filter((school) => configuredIds.has(school.id)).length;
  const setupProgress = declaredSchools.length ? Math.round((completedCount / declaredSchools.length) * 100) : 0;
  const selectedPlan = configuredSchools[0]?.plan ?? "Starter";
  const planConfig = plans.find((plan) => plan.id === selectedPlan) ?? plans[0];
  const modules = configuredSchools[0]?.modules ?? planConfig.modules;

  return (
    <>
      <PageHeader
        title={`${tenant?.tenancyName ?? "Tenant"} dashboard`}
        description="Track tenant configuration, school readiness, plan modules, and daily operations from one workspace."
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Declared schools" value={String(declaredSchools.length)} icon={School} />
          <MetricCard label="Configured schools" value={`${completedCount}/${declaredSchools.length || 0}`} hint={`${setupProgress}% ready`} icon={CheckCircle2} />
          <MetricCard label="Selected plan" value={selectedPlan} hint={configuredSchools[0]?.billingCycle ?? "Not published"} icon={CreditCard} />
          <MetricCard label="Modules enabled" value={String(modules.length)} icon={ShieldCheck} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard
            title="Tenant configuration readiness"
            description="Complete each declared school, then publish the tenancy setup."
            action={
              <Button asChild className="gap-1.5">
                <Link to="/school/tenant-configuration">
                  <SlidersHorizontal className="h-4 w-4" />
                  Continue setup
                </Link>
              </Button>
            }
          >
            <div className="mb-3 flex items-center justify-between text-sm">
              <span>{tenant?.tenancyName ?? "Tenant"} setup</span>
              <span className="tabular-nums text-muted-foreground">{setupProgress}%</span>
            </div>
            <ProgressBar value={setupProgress} tone={setupProgress === 100 ? "success" : "primary"} />
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {declaredSchools.map((school) => {
                const configured = configuredIds.has(school.id);
                return (
                  <div key={school.id} className="rounded-lg border border-border bg-surface p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{school.name}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{school.branchLabel} - {school.type}</div>
                      </div>
                      <StatusBadge tone={configured ? "success" : "warning"}>{configured ? "Published" : "Pending"}</StatusBadge>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-primary" />
                        Academic structure
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        Administration structure
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-primary" />
                        Academic calendar
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Plan and access" description="Modules are enabled from the tenancy-level subscription.">
            <div className="rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Current plan</div>
                  <div className="mt-1 font-display text-2xl font-semibold">{selectedPlan}</div>
                </div>
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-4 text-sm text-muted-foreground">{planConfig.studentLimit} - {planConfig.campusLimit}</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {modules.map((module) => (
                <StatusBadge key={module} tone="success">{module}</StatusBadge>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Published school profiles" description="Schools appear here after the tenant configuration publish step." padded={false}>
            <Table>
              <TableHeader>
                <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                  <TableHead className="px-5 py-2.5">School</TableHead>
                  <TableHead className="px-5 py-2.5">Curriculum</TableHead>
                  <TableHead className="px-5 py-2.5">Mode</TableHead>
                  <TableHead className="px-5 py-2.5">Calendar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configuredSchools.map((school) => (
                  <TableRow key={school.id} className="border-border/60">
                    <TableCell className="px-5 py-3">
                      <div className="font-medium">{school.name}</div>
                      <div className="text-xs text-muted-foreground">{school.nemisCode ?? "NEMIS pending"}</div>
                    </TableCell>
                    <TableCell className="px-5 py-3">{school.curriculum}</TableCell>
                    <TableCell className="px-5 py-3">{school.mode ?? "Pending"}</TableCell>
                    <TableCell className="px-5 py-3">{school.academicYears?.length ?? 0} years</TableCell>
                  </TableRow>
                ))}
                {configuredSchools.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      No schools have been published yet. Continue tenant configuration to publish the declared schools.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="Next actions">
            <div className="space-y-3">
              {[
                { title: "Complete pending school setup", detail: "Use the school switcher to finish profile, academic structure, administration, and calendar.", Icon: SlidersHorizontal },
                { title: "Review plan modules", detail: "Choose one tenancy-level plan before publishing all school profiles.", Icon: ShieldCheck },
                { title: "Publish to super admin", detail: "Send completed school records to the super admin schools registry.", Icon: Layers3 },
              ].map(({ title, detail, Icon }) => (
                <div key={title} className="flex items-start gap-3 rounded-lg border border-border bg-surface p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-soft text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">{title}</div>
                    <div className="mt-1 text-sm leading-5 text-muted-foreground">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
