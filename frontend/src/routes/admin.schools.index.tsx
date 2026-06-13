import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AdminActionIcon,
  AdminSearchInput,
  AdminSelectField,
} from "@/components/admin/AdminControls";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Archive,
  Ban,
  Eye,
  Filter,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import {
  type BillingStatus,
  type SubscriptionPlan,
  type TenantStatus,
  billingStatusTone,
  schoolPaymentStatus,
  tenantStatusTone,
  tenantStatuses,
} from "@/lib/admin-data";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/schools/")({ component: Schools });

const plans: Array<"All" | SubscriptionPlan> = ["All", "Starter", "Growth", "Scale"];
const paymentStatuses: Array<"All" | BillingStatus> = ["All", "Paid", "Pending", "Overdue", "Draft"];
const sortOptions = ["Recently active", "Highest MRR", "Most students", "Onboarding progress", "School name"] as const;

function Schools() {
  const { schools, totals } = useAdminSchoolStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | TenantStatus>("All");
  const [plan, setPlan] = useState<"All" | SubscriptionPlan>("All");
  const [payment, setPayment] = useState<"All" | BillingStatus>("All");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>("Recently active");
  const [showFilters, setShowFilters] = useState(false);

  const filteredSchools = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const result = schools.filter((school) => {
      const paymentStatus = schoolPaymentStatus(school);
      const matchesSearch =
        !needle ||
        [
          school.name,
          school.county,
          school.curriculum,
          school.plan,
          school.owner,
          school.tenancyName,
          school.subCounty,
          school.ownershipType,
          school.branchLabel,
          school.email,
          school.type,
          school.supportOwner,
          school.onboardingStage,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesStatus = status === "All" || school.status === status;
      const matchesPlan = plan === "All" || school.plan === plan;
      const matchesPayment = payment === "All" || paymentStatus === payment;
      return matchesSearch && matchesStatus && matchesPlan && matchesPayment;
    });

    return result.sort((a, b) => {
      if (sortBy === "Highest MRR") return b.mrr - a.mrr;
      if (sortBy === "Most students") return b.students - a.students;
      if (sortBy === "Onboarding progress") return a.onboarding - b.onboarding;
      if (sortBy === "School name") return a.name.localeCompare(b.name);
      return schools.indexOf(a) - schools.indexOf(b);
    });
  }, [payment, plan, query, schools, sortBy, status]);

  return (
    <>
      <PageHeader
        title="School registry"
        description="Schools that have been onboarded are listed on the schools side (/admin/schools), including branch schools under the same tenant owner."
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Total tenants" value={String(schools.length)} delta={`${filteredSchools.length} visible`} icon={ShieldCheck} />
          <MetricCard label="Active schools" value={String(totals.active)} delta={`${totals.trial} trials`} icon={LockKeyhole} />
          <MetricCard label="Suspended" value={String(totals.suspended)} delta="safe lockout" trend="flat" icon={Ban} />
          <MetricCard label="Archived" value={String(totals.archived)} delta="data retained" trend="flat" icon={Archive} />
        </div>

        <SectionCard padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <AdminSearchInput value={query} onChange={setQuery} placeholder="Search schools, counties, plans, owners..." />
            <div className="flex items-center gap-1 rounded-md bg-muted p-1">
              {tenantStatuses.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatus(filter)}
                  className={`rounded px-2.5 py-1.5 text-xs ${
                    status === filter ? "bg-card font-medium shadow-card" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={() => setShowFilters((current) => !current)} className="gap-1.5">
              <Filter className="h-4 w-4" />
              More filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid gap-3 border-b border-border bg-surface p-4 md:grid-cols-3">
              <AdminSelectField label="Plan" value={plan} onChange={(event) => setPlan(event.target.value as typeof plan)}>
                {plans.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </AdminSelectField>
              <AdminSelectField label="Payment" value={payment} onChange={(event) => setPayment(event.target.value as typeof payment)}>
                {paymentStatuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </AdminSelectField>
              <AdminSelectField label="Sort by" value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)}>
                {sortOptions.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </AdminSelectField>
              <div className="flex justify-end md:col-span-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPlan("All");
                    setPayment("All");
                    setStatus("All");
                    setQuery("");
                    setSortBy("Recently active");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">School</TableHead>
                <TableHead className="px-5 py-2.5">Tenancy</TableHead>
                <TableHead className="px-5 py-2.5">County</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Students</TableHead>
                <TableHead className="px-5 py-2.5">Plan</TableHead>
                <TableHead className="px-5 py-2.5">Payment</TableHead>
                <TableHead className="px-5 py-2.5">Onboarding</TableHead>
                <TableHead className="px-5 py-2.5">Tenant state</TableHead>
                <TableHead className="w-20 px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => (
                <TableRow key={school.id} className="border-border/60">
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft font-display text-xs font-semibold text-primary">
                        {school.name[0]}
                      </div>
                      <div>
                        <Link to="/admin/schools/$schoolId" params={{ schoolId: school.id }} className="font-medium hover:text-primary">
                          {school.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {school.branchLabel ?? school.type ?? "School"} - {school.curriculum} - {school.owner}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="font-medium">{school.tenancyName ?? school.owner}</div>
                    <div className="text-xs text-muted-foreground">{school.ownershipType ?? "Private"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">
                    {school.county}
                    <div className="text-xs">{school.subCounty ?? "Sub county pending"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">{school.students.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="font-medium">{school.plan}</div>
                    <div className="text-xs text-muted-foreground">KES {school.mrr.toLocaleString()} MRR</div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={billingStatusTone(schoolPaymentStatus(school))}>{schoolPaymentStatus(school)}</StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex min-w-36 items-center gap-3">
                      <ProgressBar value={school.onboarding} tone={school.onboarding === 100 ? "success" : "primary"} />
                      <span className="w-9 text-right text-xs tabular-nums text-muted-foreground">{school.onboarding}%</span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{school.onboardingStage ?? "Setup wizard"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge tone={tenantStatusTone(school.status)}>{school.status}</StatusBadge>
                      <StatusBadge tone={school.isolation === "Verified" ? "success" : "warning"} dot={false}>
                        {school.isolation}
                      </StatusBadge>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{school.lastActivity ?? "No activity"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    <AdminActionIcon asChild label={`View ${school.name}`}>
                      <Link to="/admin/schools/$schoolId" params={{ schoolId: school.id }}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </AdminActionIcon>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSchools.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No schools match the current search and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SectionCard>
      </PageBody>

    </>
  );
}

