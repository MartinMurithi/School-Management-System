import { Link, createFileRoute } from "@tanstack/react-router";
import { DetailActionPanel, DetailGrid, DetailHero } from "@/components/admin/DetailView";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, CreditCard, Eye, PackageCheck, Settings, Users, Wallet } from "lucide-react";
import { billingPlans, subscriptionAmount } from "@/lib/admin-billing-store";
import { schoolPaymentStatus, type SubscriptionPlan } from "@/lib/admin-data";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/billing/plans/$planId")({ component: PlanDetail });

function PlanDetail() {
  const { planId } = Route.useParams();
  const { schools } = useAdminSchoolStore();
  const plan = billingPlans.find((item) => item.id === planId);
  const schoolsOnPlan = schools.filter((school) => school.plan === planId);

  if (!plan) {
    return (
      <>
        <PageHeader title="Plan not found" description="The subscription plan could not be found." />
        <PageBody>
          <Button variant="outline" asChild>
            <Link to="/admin/billing">
              <ArrowLeft className="h-4 w-4" />
              Back to billing
            </Link>
          </Button>
        </PageBody>
      </>
    );
  }

  const planIdTyped = plan.id as SubscriptionPlan;
  const planMrr = schoolsOnPlan.reduce((sum, school) => sum + school.mrr, 0);

  return (
    <>
      <PageHeader
        title={`${plan.name} plan`}
        description="Plan pricing, limits, modules, support level, and schools using this subscription."
      />
      <PageBody>
        <DetailHero
          eyebrow="Subscription plan"
          title={plan.name}
          description={`${plan.studentLimit} - ${plan.campusLimit} - ${plan.support}`}
          icon={<PackageCheck className="h-6 w-6" />}
          badges={
            <>
              <StatusBadge tone="success">{plan.status}</StatusBadge>
              <StatusBadge tone="info">KES {plan.monthly.toLocaleString()} monthly</StatusBadge>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Schools" value={String(schoolsOnPlan.length)} icon={Users} />
          <MetricCard label="Plan MRR" value={`KES ${planMrr.toLocaleString()}`} icon={Wallet} />
          <MetricCard label="Termly" value={`KES ${subscriptionAmount(planIdTyped, "Termly").toLocaleString()}`} icon={CreditCard} />
          <MetricCard label="Annual" value={`KES ${subscriptionAmount(planIdTyped, "Annual").toLocaleString()}`} icon={CreditCard} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Plan details" description="Commercial rules attached to this SaaS package.">
            <DetailGrid
              items={[
                ["Monthly price", `KES ${plan.monthly.toLocaleString()}`],
                ["Termly price", `KES ${plan.termly.toLocaleString()}`],
                ["Annual price", `KES ${plan.annual.toLocaleString()}`],
                ["Student limit", plan.studentLimit],
                ["Campus limit", plan.campusLimit],
                ["Storage", plan.storage],
                ["Support", plan.support],
                ["Status", plan.status],
              ]}
            />
          </SectionCard>

          <SectionCard title="Modules included">
            <div className="space-y-2">
              {plan.modules.map((module) => (
                <div key={module} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm">
                  <PackageCheck className="h-4 w-4 text-primary" />
                  {module}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <DetailActionPanel title="Plan operations" description="Keep plan changes deliberate because they affect school limits and revenue.">
          <Button variant="outline" onClick={() => undefined} className="gap-1.5">
            <Settings className="h-4 w-4" />
            Edit plan rules
          </Button>
        </DetailActionPanel>

        <SectionCard title="Schools using this plan" description="Open a school subscription to change plan, invoice, or manage grace." padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">School</TableHead>
                <TableHead className="px-5 py-2.5">Cycle</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Students</TableHead>
                <TableHead className="px-5 py-2.5 text-right">MRR</TableHead>
                <TableHead className="px-5 py-2.5">Payment</TableHead>
                <TableHead className="w-20 px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schoolsOnPlan.map((school) => (
                <TableRow key={school.id} className="border-border/60">
                  <TableCell className="px-5 py-3">
                    <div className="font-medium">{school.name}</div>
                    <div className="text-xs text-muted-foreground">{school.owner} - {school.county}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{school.billingCycle ?? "Monthly"}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">{school.students.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">KES {school.mrr.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={schoolPaymentStatus(school) === "Paid" ? "success" : schoolPaymentStatus(school) === "Overdue" ? "danger" : "warning"}>{schoolPaymentStatus(school)}</StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/admin/billing/subscriptions/$subscriptionId" params={{ subscriptionId: school.id }} aria-label={`View ${school.name}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {schoolsOnPlan.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No schools are currently using this plan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Plan distribution" description="How much of the tenant base this plan represents.">
          <div className="flex items-center gap-4">
            <ProgressBar value={(schoolsOnPlan.length / Math.max(schools.length, 1)) * 100} />
            <span className="w-20 text-right text-sm tabular-nums text-muted-foreground">
              {Math.round((schoolsOnPlan.length / Math.max(schools.length, 1)) * 100)}%
            </span>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
