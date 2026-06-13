import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  AdminActionIcon,
  AdminModalFooter,
  AdminSearchInput,
  AdminSelectField,
  AdminTextField,
} from "@/components/admin/AdminControls";
import { AdminModal } from "@/components/admin/AdminModal";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { MetricCard, MiniBars, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertCircle,
  CalendarClock,
  CreditCard,
  Eye,
  FileText,
  LineChart,
  Plus,
  Receipt,
  Smartphone,
  Wallet,
} from "lucide-react";
import {
  type BillingStatus,
  type SaaSInvoice,
  billingStatusTone,
  billingStatuses,
  schoolPaymentStatus,
  tenantStatusTone,
} from "@/lib/admin-data";
import { billingRisk, subscriptionStatus, useAdminBillingStore } from "@/lib/admin-billing-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/billing/")({ component: BillingDashboard });

const subscriptionFilters = ["All", "Active", "Trial", "Overdue", "Suspended", "Expired"] as const;

function riskTone(risk: string) {
  if (risk === "High") return "danger" as const;
  if (risk === "Medium") return "warning" as const;
  if (risk === "Low") return "info" as const;
  return "success" as const;
}

function BillingDashboard() {
  const navigate = useNavigate();
  const { schools } = useAdminSchoolStore();
  const { invoices, payments, plans, metrics, createInvoice } = useAdminBillingStore();
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [subscriptionFilter, setSubscriptionFilter] = useState<(typeof subscriptionFilters)[number]>("All");
  const [invoiceStatus, setInvoiceStatus] = useState<"All" | BillingStatus>("All");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [form, setForm] = useState({
    schoolId: schools[0]?.id ?? "",
    cycle: "Monthly" as SaaSInvoice["cycle"],
    method: "M-PESA" as SaaSInvoice["method"],
    amount: "",
    dueDate: "June 01, 2026",
  });

  const filteredSchools = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return schools.filter((school) => {
      const status = subscriptionStatus(school);
      const paymentStatus = schoolPaymentStatus(school);
      const matchesSearch =
        !needle ||
        [school.name, school.owner, school.plan, school.billingCycle, school.county, paymentStatus, status]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesStatus = subscriptionFilter === "All" || status === subscriptionFilter;
      return matchesSearch && matchesStatus;
    });
  }, [query, schools, subscriptionFilter]);

  const filteredInvoices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return invoices.filter((invoice) => {
      const matchesSearch =
        !needle || [invoice.id, invoice.school, invoice.cycle, invoice.method, invoice.status].join(" ").toLowerCase().includes(needle);
      const matchesStatus = invoiceStatus === "All" || invoice.status === invoiceStatus;
      return matchesSearch && matchesStatus;
    });
  }, [invoiceStatus, invoices, query]);

  function submitInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invoice = createInvoice(form, schools);
    setShowInvoiceForm(false);
    setNotice(`${invoice.id} created as a draft for ${invoice.school}.`);
    navigate({ to: "/admin/billing/invoices/$invoiceId", params: { invoiceId: invoice.id } });
  }

  return (
    <>
      <PageHeader
        title="Billing & MRR"
        description="Manage subscriptions, SaaS invoices, payment tracking, grace periods, plan performance, and revenue control."
        actions={
          <Button onClick={() => setShowInvoiceForm(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New invoice
          </Button>
        }
      />
      <PageBody>
        {notice && <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary">{notice}</div>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="MRR" value={`KES ${metrics.mrr.toLocaleString()}`} delta="+8.4%" icon={CreditCard} />
          <MetricCard label="ARR" value={`KES ${metrics.arr.toLocaleString()}`} delta="projected" trend="flat" icon={LineChart} />
          <MetricCard label="Collected" value={`KES ${metrics.paid.toLocaleString()}`} delta={`${metrics.collectionRate}% paid`} icon={Wallet} />
          <MetricCard label="Overdue" value={`KES ${metrics.overdue.toLocaleString()}`} delta={`${invoices.filter((i) => i.status === "Overdue").length} invoices`} trend="down" icon={AlertCircle} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <SectionCard title="MRR command center" description="Monthly recurring revenue, collections, and growth signals.">
            <MiniBars data={[240, 270, 310, 340, 350, 380, 400, 420, 440, 455, 470, 482]} />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["New MRR", "KES 212K", "schools activated this month"],
                ["Expansion MRR", "KES 96K", "plan upgrades and modules"],
                ["Churn risk", "KES 58K", "overdue or suspended"],
              ].map(([label, value, detail]) => (
                <div key={label} className="rounded-xl border border-border bg-surface p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
                  <div className="mt-1 font-display text-xl font-semibold">{value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Grace and suspension policy" description="Safe billing enforcement without deleting tenant data.">
            <div className="space-y-3">
              {[
                ["Due date", "Invoice reminder sent to owner and bursar.", "info"],
                ["14 days overdue", "Tenant enters read-only warning mode.", "warning"],
                ["30 days overdue", "Full lockout can be applied by Super Admin.", "danger"],
                ["After payment", "Access is restored instantly with audit trail.", "success"],
              ].map(([title, detail, tone]) => (
                <div key={title} className="rounded-xl border border-border bg-surface p-3">
                  <StatusBadge tone={tone as "info" | "warning" | "danger" | "success"}>{title}</StatusBadge>
                  <p className="mt-2 text-sm text-muted-foreground">{detail}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="School subscriptions" description="Each school tenant's plan, billing cycle, payment state, grace risk, and dedicated billing workspace." padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <AdminSearchInput value={query} onChange={setQuery} placeholder="Search subscriptions, schools, plans..." />
            <div className="flex items-center gap-1 rounded-md bg-muted p-1">
              {subscriptionFilters.map((item) => (
                <button
                  key={item}
                  onClick={() => setSubscriptionFilter(item)}
                  className={`rounded px-2.5 py-1.5 text-xs ${
                    subscriptionFilter === item ? "bg-card font-medium shadow-card" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">School</TableHead>
                <TableHead className="px-5 py-2.5">Plan</TableHead>
                <TableHead className="px-5 py-2.5">Cycle</TableHead>
                <TableHead className="px-5 py-2.5 text-right">MRR</TableHead>
                <TableHead className="px-5 py-2.5">Payment</TableHead>
                <TableHead className="px-5 py-2.5">Risk</TableHead>
                <TableHead className="w-20 px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchools.map((school) => {
                const paymentStatus = schoolPaymentStatus(school);
                const risk = billingRisk(paymentStatus);
                return (
                  <TableRow key={school.id} className="border-border/60">
                    <TableCell className="px-5 py-3">
                      <div className="font-medium">{school.name}</div>
                      <div className="text-xs text-muted-foreground">{school.owner} - {school.county}</div>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge tone="info">{school.plan}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-muted-foreground">{school.billingCycle ?? "Monthly"}</TableCell>
                    <TableCell className="px-5 py-3 text-right tabular-nums">KES {school.mrr.toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge tone={billingStatusTone(paymentStatus)}>{paymentStatus}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge tone={riskTone(risk)}>{risk}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
                      <AdminActionIcon asChild label={`View ${school.name} billing`}>
                        <Link to="/admin/billing/subscriptions/$subscriptionId" params={{ subscriptionId: school.id }}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </AdminActionIcon>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredSchools.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No subscriptions match the current search and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SectionCard>

        <div className="grid gap-4 xl:grid-cols-3">
          <SectionCard title="Subscription plans" description="Plan limits, modules, and schools using each plan.">
            <div className="space-y-3">
              {plans.map((plan) => {
                const count = schools.filter((school) => school.plan === plan.id).length;
                return (
                  <Link
                    key={plan.id}
                    to="/admin/billing/plans/$planId"
                    params={{ planId: plan.id }}
                    className="block rounded-xl border border-border bg-surface p-4 transition hover:border-primary/30 hover:bg-primary-soft/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display font-semibold">{plan.name}</div>
                        <div className="text-xs text-muted-foreground">{plan.studentLimit}</div>
                      </div>
                      <StatusBadge tone="success">{plan.status}</StatusBadge>
                    </div>
                    <div className="mt-3 font-display text-xl font-semibold">KES {plan.monthly.toLocaleString()}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{count} schools on this plan</div>
                    <div className="mt-3"><ProgressBar value={(count / Math.max(schools.length, 1)) * 100} /></div>
                  </Link>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="SaaS invoices" description="Platform invoices owed to your company." padded={false} className="xl:col-span-2">
            <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
              <div className="flex items-center gap-1 rounded-md bg-muted p-1">
                {billingStatuses.map((item) => (
                  <button
                    key={item}
                    onClick={() => setInvoiceStatus(item)}
                    className={`rounded px-2.5 py-1.5 text-xs ${
                      invoiceStatus === item ? "bg-card font-medium shadow-card" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                  <TableHead className="px-5 py-2.5">Invoice</TableHead>
                  <TableHead className="px-5 py-2.5">School</TableHead>
                  <TableHead className="px-5 py-2.5">Due</TableHead>
                  <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                  <TableHead className="px-5 py-2.5">Status</TableHead>
                  <TableHead className="w-20 px-5 py-2.5 text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-border/60">
                    <TableCell className="px-5 py-3 font-mono text-xs">{invoice.id}</TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="font-medium">{invoice.school}</div>
                      <div className="text-xs text-muted-foreground">{invoice.cycle} - {invoice.method}</div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-muted-foreground">{invoice.dueDate}</TableCell>
                    <TableCell className="px-5 py-3 text-right tabular-nums">KES {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge tone={billingStatusTone(invoice.status)}>{invoice.status}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
                      <AdminActionIcon asChild label={`View ${invoice.id}`}>
                        <Link to="/admin/billing/invoices/$invoiceId" params={{ invoiceId: invoice.id }}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </AdminActionIcon>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SectionCard>
        </div>

        <SectionCard title="Payment tracking" description="M-PESA, bank, and manual payment reconciliation." padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">Payment</TableHead>
                <TableHead className="px-5 py-2.5">School</TableHead>
                <TableHead className="px-5 py-2.5">Method</TableHead>
                <TableHead className="px-5 py-2.5">Reference</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="w-20 px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.slice(0, 6).map((payment) => (
                <TableRow key={payment.id} className="border-border/60">
                  <TableCell className="px-5 py-3 font-mono text-xs">{payment.id}</TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="font-medium">{payment.school}</div>
                    <div className="text-xs text-muted-foreground">{payment.invoiceId} - {payment.date}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3">{payment.method === "M-PESA" ? <Smartphone className="inline h-4 w-4 text-primary" /> : <Receipt className="inline h-4 w-4 text-primary" />} {payment.method}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{payment.reference}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">KES {payment.amount.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={payment.status === "Confirmed" ? "success" : payment.status === "Failed" ? "danger" : "warning"}>{payment.status}</StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    <AdminActionIcon asChild label={`View ${payment.id}`}>
                      <Link to="/admin/billing/payments/$paymentId" params={{ paymentId: payment.id }}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </AdminActionIcon>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Upcoming renewals", "12 schools renew in the next 7 days.", CalendarClock],
            ["Failed payments", "2 payments require billing follow-up.", AlertCircle],
            ["Report pack", "MRR, churn, plan performance, and collection reports.", FileText],
          ].map(([title, detail, Icon]) => (
            <SectionCard key={title as string}>
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display font-semibold">{title as string}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{detail as string}</p>
                </div>
              </div>
            </SectionCard>
          ))}
        </div>
      </PageBody>

      <AdminModal
        open={showInvoiceForm}
        onOpenChange={setShowInvoiceForm}
        title="Create SaaS invoice"
        description="Generate a platform subscription invoice for a school tenant."
      >
        <form onSubmit={submitInvoice}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminSelectField label="School" wrapperClassName="md:col-span-2" value={form.schoolId} onChange={(event) => setForm({ ...form, schoolId: event.target.value })}>
              {schools.map((school) => <option key={school.id} value={school.id}>{school.name}</option>)}
            </AdminSelectField>
            <AdminSelectField label="Cycle" value={form.cycle} onChange={(event) => setForm({ ...form, cycle: event.target.value as SaaSInvoice["cycle"] })}>
              <option>Monthly</option>
              <option>Termly</option>
              <option>Annual</option>
            </AdminSelectField>
            <AdminSelectField label="Method" value={form.method} onChange={(event) => setForm({ ...form, method: event.target.value as SaaSInvoice["method"] })}>
              <option>M-PESA</option>
              <option>Bank</option>
              <option>Card</option>
            </AdminSelectField>
            <AdminTextField label="Amount" type="number" min="0" placeholder="Use plan amount if blank" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} />
            <AdminTextField label="Due date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setShowInvoiceForm(false)} submitLabel="Create invoice" />
        </form>
      </AdminModal>
    </>
  );
}
