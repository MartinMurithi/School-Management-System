import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import {
  AdminModalFooter,
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/AdminControls";
import { AdminModal } from "@/components/admin/AdminModal";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  Ban,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Eye,
  FileText,
  RefreshCcw,
  School,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import {
  type SaaSInvoice,
  type SubscriptionPlan,
  billingStatusTone,
  schoolPaymentStatus,
  tenantStatusTone,
} from "@/lib/admin-data";
import { billingPlans, billingRisk, subscriptionAmount, subscriptionStatus, useAdminBillingStore } from "@/lib/admin-billing-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/billing/subscriptions/$subscriptionId")({ component: SubscriptionDetail });

function riskTone(risk: string) {
  if (risk === "High") return "danger" as const;
  if (risk === "Medium") return "warning" as const;
  if (risk === "Low") return "info" as const;
  return "success" as const;
}

function SubscriptionDetail() {
  const { subscriptionId } = Route.useParams();
  const { schools, changePlan, changeStatus, updateSchool } = useAdminSchoolStore();
  const { invoices, payments, createInvoice, addNote, notes } = useAdminBillingStore();
  const school = schools.find((item) => item.id === subscriptionId);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"plan" | "invoice" | "grace" | "note" | null>(null);
  const [planDraft, setPlanDraft] = useState({ plan: "Starter" as SubscriptionPlan, billingCycle: "Monthly" as SaaSInvoice["cycle"] });
  const [invoiceDraft, setInvoiceDraft] = useState({ amount: "", method: "M-PESA" as SaaSInvoice["method"], dueDate: "June 01, 2026" });
  const [graceDraft, setGraceDraft] = useState({ days: "14", reason: "" });
  const [noteDraft, setNoteDraft] = useState("");

  const schoolInvoices = useMemo(() => invoices.filter((invoice) => invoice.schoolId === subscriptionId), [invoices, subscriptionId]);
  const schoolPayments = useMemo(() => payments.filter((payment) => payment.schoolId === subscriptionId), [payments, subscriptionId]);
  const schoolNotes = notes.filter((note) => note.targetId === subscriptionId);

  if (!school) {
    return (
      <>
        <PageHeader title="Subscription not found" description="The school subscription record could not be found." />
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

  const currentSchool = school;

  const paymentStatus = schoolPaymentStatus(currentSchool);
  const risk = billingRisk(paymentStatus);
  const currentPlan = billingPlans.find((plan) => plan.id === currentSchool.plan) ?? billingPlans[0];
  const latestInvoice = schoolInvoices[0];

  function openPlan() {
    setPlanDraft({ plan: currentSchool.plan, billingCycle: currentSchool.billingCycle ?? "Monthly" });
    setModal("plan");
  }

  function submitPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changePlan(currentSchool, planDraft.plan, planDraft.billingCycle);
    setNotice(`Subscription changed to ${planDraft.plan} on ${planDraft.billingCycle.toLowerCase()} billing.`);
    setModal(null);
  }

  function submitInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const invoice = createInvoice(
      {
        schoolId: currentSchool.id,
        cycle: currentSchool.billingCycle ?? "Monthly",
        method: invoiceDraft.method,
        amount: invoiceDraft.amount || String(subscriptionAmount(currentSchool.plan, currentSchool.billingCycle ?? "Monthly")),
        dueDate: invoiceDraft.dueDate,
      },
      schools,
    );
    updateSchool(currentSchool.id, { paymentStatus: "Pending" }, "Subscription invoice generated", `${invoice.id} generated from billing workspace.`);
    setNotice(`${invoice.id} generated and attached to this subscription.`);
    setModal(null);
  }

  function submitGrace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSchool(currentSchool.id, { paymentStatus: "Pending", status: currentSchool.status === "Suspended" ? "Trial" : currentSchool.status }, "Grace period updated", `${graceDraft.days} days granted. ${graceDraft.reason}`);
    addNote(currentSchool.id, `Grace period granted for ${graceDraft.days} days. ${graceDraft.reason}`);
    setNotice(`Grace period updated for ${currentSchool.name}.`);
    setModal(null);
  }

  function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addNote(currentSchool.id, noteDraft);
    setNoteDraft("");
    setNotice("Billing note added to this school subscription.");
    setModal(null);
  }

  function suspendSchool() {
    changeStatus(currentSchool, "Suspended", "Billing suspension applied from subscription workspace after overdue review.");
    setNotice("School placed into safe read-only suspension. Data remains retained.");
  }

  function reactivateSchool() {
    changeStatus(currentSchool, "Active", "Subscription reactivated after billing review.");
    setNotice("School reactivated and billing access restored.");
  }

  return (
    <>
      <PageHeader
        title={`${school.name} billing`}
        description="School subscription workspace for plan changes, invoices, payments, grace periods, suspension, and reactivation."
      />
      <PageBody>
        {notice && <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary">{notice}</div>}

        <DetailHero
          eyebrow="Subscription workspace"
          title={school.name}
          description={`${school.plan} plan - ${school.billingCycle ?? "Monthly"} billing - ${school.owner}`}
          icon={<School className="h-6 w-6" />}
          badges={
            <>
              <StatusBadge tone={tenantStatusTone(school.status)}>{subscriptionStatus(school)}</StatusBadge>
              <StatusBadge tone={billingStatusTone(paymentStatus)}>{paymentStatus}</StatusBadge>
              <StatusBadge tone={riskTone(risk)}>{risk} risk</StatusBadge>
              <StatusBadge tone="info">{school.plan}</StatusBadge>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="MRR" value={`KES ${school.mrr.toLocaleString()}`} icon={CreditCard} />
          <MetricCard label="Plan amount" value={`KES ${subscriptionAmount(school.plan, school.billingCycle ?? "Monthly").toLocaleString()}`} hint={school.billingCycle ?? "Monthly"} icon={Wallet} />
          <MetricCard label="Invoices" value={String(schoolInvoices.length)} icon={FileText} />
          <MetricCard label="Last payment" value={schoolPayments[0]?.date ?? "None"} icon={CalendarClock} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Subscription profile" description="Plan, limits, billing contact, and tenant billing state.">
            <DetailGrid
              items={[
                ["School", school.name],
                ["Billing contact", school.owner],
                ["Email", <a key="email" href={`mailto:${school.email}`} className="text-primary hover:underline">{school.email}</a>],
                ["Phone", school.phone],
                ["Plan", school.plan],
                ["Billing cycle", school.billingCycle ?? "Monthly"],
                ["Student limit", currentPlan.studentLimit],
                ["Support level", currentPlan.support],
              ]}
            />
          </SectionCard>

          <SectionCard title="Plan limits">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Student usage</span>
                  <span className="text-muted-foreground">{school.students.toLocaleString()}</span>
                </div>
                <ProgressBar value={school.plan === "Starter" ? (school.students / 300) * 100 : school.plan === "Growth" ? (school.students / 1000) * 100 : 78} tone={school.plan === "Starter" && school.students > 300 ? "warning" : "primary"} />
              </div>
              <DetailTimeline
                items={[
                  { title: "Billing active", detail: "Subscription is linked to tenant access controls.", tone: "success" },
                  { title: "Grace policy", detail: latestInvoice?.grace ?? "No active grace period", tone: paymentStatus === "Overdue" ? "danger" : "info" },
                  { title: "Data retention", detail: "Suspension never deletes tenant data.", tone: "warning" },
                ]}
              />
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <DetailActionPanel title="Subscription controls" description="Plan and billing-cycle changes.">
            <Button onClick={openPlan} className="gap-1.5">
              <CreditCard className="h-4 w-4" />
              Change plan
            </Button>
            <Button variant="outline" onClick={() => setModal("invoice")} className="gap-1.5">
              <FileText className="h-4 w-4" />
              Generate invoice
            </Button>
          </DetailActionPanel>

          <DetailActionPanel title="Grace and access" description="Safe enforcement for overdue tenants.">
            <Button variant="outline" onClick={() => setModal("grace")} className="gap-1.5">
              <RefreshCcw className="h-4 w-4" />
              Add grace
            </Button>
            {school.status === "Suspended" ? (
              <Button onClick={reactivateSchool} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Reactivate
              </Button>
            ) : (
              <Button variant="destructive" onClick={suspendSchool} className="gap-1.5">
                <Ban className="h-4 w-4" />
                Suspend
              </Button>
            )}
          </DetailActionPanel>

          <DetailActionPanel title="Follow-up" description="Keep billing context visible for the team.">
            <Button variant="outline" onClick={() => setModal("note")} className="gap-1.5">
              <FileText className="h-4 w-4" />
              Add note
            </Button>
            <Button variant="outline" onClick={() => setNotice(`Renewal reminder queued for ${school.name}.`)} className="gap-1.5">
              <Send className="h-4 w-4" />
              Send reminder
            </Button>
            <Button variant="outline" onClick={() => setNotice("Tenant billing boundary verified.")} className="gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              Verify boundary
            </Button>
          </DetailActionPanel>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Invoice history" description="Open invoice details for collection actions." padded={false}>
            <Table>
              <TableHeader>
                <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                  <TableHead className="px-5 py-2.5">Invoice</TableHead>
                  <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                  <TableHead className="px-5 py-2.5">Status</TableHead>
                  <TableHead className="w-20 px-5 py-2.5 text-right">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-border/60">
                    <TableCell className="px-5 py-3">
                      <div className="font-mono text-xs">{invoice.id}</div>
                      <div className="text-xs text-muted-foreground">{invoice.cycle} - due {invoice.dueDate}</div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right tabular-nums">KES {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge tone={billingStatusTone(invoice.status)}>{invoice.status}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link to="/admin/billing/invoices/$invoiceId" params={{ invoiceId: invoice.id }} aria-label={`View ${invoice.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {schoolInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">No invoices yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="Payment history" description="Payment receipts and reconciliation status.">
            <div className="space-y-3">
              {schoolPayments.map((payment) => (
                <Link
                  key={payment.id}
                  to="/admin/billing/payments/$paymentId"
                  params={{ paymentId: payment.id }}
                  className="block rounded-xl border border-border bg-surface p-4 transition hover:border-primary/30 hover:bg-primary-soft/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs">{payment.id}</div>
                      <div className="mt-1 font-medium">KES {payment.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{payment.reference} - {payment.date}</div>
                    </div>
                    <StatusBadge tone={payment.status === "Confirmed" ? "success" : payment.status === "Failed" ? "danger" : "warning"}>{payment.status}</StatusBadge>
                  </div>
                </Link>
              ))}
              {schoolPayments.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No payments recorded for this school.</div>}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Billing notes" description="Internal billing support trail.">
          <div className="grid gap-3 md:grid-cols-2">
            {schoolNotes.map((note) => (
              <div key={note.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{note.author}</div>
                  <div className="text-xs text-muted-foreground">{note.time}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{note.body}</p>
              </div>
            ))}
            {schoolNotes.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No billing notes yet.</div>}
          </div>
        </SectionCard>
      </PageBody>

      <AdminModal open={modal === "plan"} onOpenChange={() => setModal(null)} title="Change subscription plan" description="Update plan and billing cycle for this school.">
        <form onSubmit={submitPlan}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminSelectField label="Plan" value={planDraft.plan} onChange={(event) => setPlanDraft({ ...planDraft, plan: event.target.value as SubscriptionPlan })}>
              <option>Starter</option>
              <option>Growth</option>
              <option>Scale</option>
            </AdminSelectField>
            <AdminSelectField label="Billing cycle" value={planDraft.billingCycle} onChange={(event) => setPlanDraft({ ...planDraft, billingCycle: event.target.value as SaaSInvoice["cycle"] })}>
              <option>Monthly</option>
              <option>Termly</option>
              <option>Annual</option>
            </AdminSelectField>
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Update subscription" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "invoice"} onOpenChange={() => setModal(null)} title="Generate SaaS invoice" description="Create a platform subscription invoice for this school.">
        <form onSubmit={submitInvoice}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="Amount" type="number" min="0" placeholder={String(subscriptionAmount(school.plan, school.billingCycle ?? "Monthly"))} value={invoiceDraft.amount} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, amount: event.target.value })} />
            <AdminSelectField label="Method" value={invoiceDraft.method} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, method: event.target.value as SaaSInvoice["method"] })}>
              <option>M-PESA</option>
              <option>Bank</option>
              <option>Card</option>
            </AdminSelectField>
            <AdminTextField label="Due date" wrapperClassName="md:col-span-2" value={invoiceDraft.dueDate} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, dueDate: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Generate invoice" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "grace"} onOpenChange={() => setModal(null)} title="Add grace period" description="Temporarily prevent suspension while keeping billing follow-up visible.">
        <form onSubmit={submitGrace}>
          <div className="space-y-3">
            <AdminTextField label="Grace days" type="number" min="1" value={graceDraft.days} onChange={(event) => setGraceDraft({ ...graceDraft, days: event.target.value })} />
            <AdminTextareaField label="Reason" required value={graceDraft.reason} onChange={(event) => setGraceDraft({ ...graceDraft, reason: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Apply grace" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "note"} onOpenChange={() => setModal(null)} title="Add billing note" description="Record internal context for this subscription.">
        <form onSubmit={submitNote}>
          <AdminTextareaField label="Note" required value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} />
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Save note" />
        </form>
      </AdminModal>
    </>
  );
}
