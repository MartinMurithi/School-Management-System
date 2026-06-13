import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AdminModalFooter, AdminTextareaField } from "@/components/admin/AdminControls";
import { AdminModal } from "@/components/admin/AdminModal";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, CalendarClock, CheckCircle2, CreditCard, FileText, Receipt, Send } from "lucide-react";
import { billingStatusTone } from "@/lib/admin-data";
import { useAdminBillingStore } from "@/lib/admin-billing-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/billing/invoices/$invoiceId")({ component: InvoiceDetail });

function InvoiceDetail() {
  const { invoiceId } = Route.useParams();
  const { invoices, payments, notes, addNote, markInvoicePaid, sendInvoice, updateInvoice } = useAdminBillingStore();
  const { updateSchool } = useAdminSchoolStore();
  const invoice = invoices.find((item) => item.id === invoiceId);
  const invoicePayments = payments.filter((payment) => payment.invoiceId === invoiceId);
  const invoiceNotes = notes.filter((note) => note.targetId === invoiceId);
  const [notice, setNotice] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  if (!invoice) {
    return (
      <>
        <PageHeader title="Invoice not found" description="The invoice record could not be found." />
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

  const currentInvoice = invoice;

  function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addNote(currentInvoice.id, note);
    setNote("");
    setShowNote(false);
    setNotice("Billing note added to this invoice.");
  }

  function markPaid() {
    markInvoicePaid(currentInvoice);
    updateSchool(currentInvoice.schoolId, { paymentStatus: "Paid" }, "Invoice paid", `${currentInvoice.id} marked as paid from billing invoice workspace.`);
    setNotice(`${currentInvoice.id} marked as paid and payment reconciliation created.`);
  }

  return (
    <>
      <PageHeader
        title={invoice.id}
        description="Subscription invoice, payment reconciliation, grace policy, and collection actions."
      />
      <PageBody>
        {notice && <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary">{notice}</div>}

        <DetailHero
          eyebrow="SaaS invoice"
          title={invoice.id}
          description={`${invoice.school} - ${invoice.cycle} subscription billing via ${invoice.method}`}
          icon={<Receipt className="h-6 w-6" />}
          badges={<StatusBadge tone={billingStatusTone(invoice.status)}>{invoice.status}</StatusBadge>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Amount" value={`KES ${invoice.amount.toLocaleString()}`} icon={CreditCard} />
          <MetricCard label="Method" value={invoice.method} icon={CreditCard} />
          <MetricCard label="Due date" value={invoice.dueDate} icon={CalendarClock} />
          <MetricCard label="Grace" value={invoice.grace} trend={invoice.grace === "Expired" ? "down" : "flat"} icon={Building2} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Invoice details" description="Platform billing record, separate from school fee collection.">
            <DetailGrid
              items={[
                ["School", <Link key="school" to="/admin/billing/subscriptions/$subscriptionId" params={{ subscriptionId: invoice.schoolId }} className="text-primary hover:underline">{invoice.school}</Link>],
                ["Billing cycle", invoice.cycle],
                ["Payment method", invoice.method],
                ["Grace period", invoice.grace],
                ["Tenant ID", invoice.schoolId],
                ["Collection status", invoice.status],
              ]}
            />
          </SectionCard>

          <SectionCard title="Collection timeline">
            <DetailTimeline
              items={[
                { title: "Invoice generated", detail: "Subscription invoice prepared for tenant billing contact.", tone: "primary" },
                { title: invoice.status === "Draft" ? "Ready to send" : "Reminder policy active", detail: "Owner and bursar receive renewal reminders.", tone: "info" },
                { title: "Safe suspension", detail: "Overdue tenants enter grace before read-only or full lockout.", tone: "warning" },
              ]}
            />
          </SectionCard>
        </div>

        <DetailActionPanel title="Invoice actions" description="Operational actions live here, not in the table row.">
          <Button onClick={markPaid} disabled={invoice.status === "Paid"} className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Mark paid
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              sendInvoice(invoice.id);
              setNotice(`Invoice reminder queued for ${invoice.school}.`);
            }}
            className="gap-1.5"
          >
            <Send className="h-4 w-4" />
            Send reminder
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              updateInvoice(invoice.id, { status: "Overdue", grace: "Expired" });
              updateSchool(invoice.schoolId, { paymentStatus: "Overdue" }, "Invoice overdue", `${invoice.id} marked overdue from billing workspace.`);
              setNotice("Invoice moved to overdue. Tenant is now eligible for grace-period review.");
            }}
            className="gap-1.5"
          >
            <CalendarClock className="h-4 w-4" />
            Mark overdue
          </Button>
          <Button variant="outline" onClick={() => setShowNote(true)} className="gap-1.5">
            <FileText className="h-4 w-4" />
            Add note
          </Button>
        </DetailActionPanel>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Payment reconciliation" description="Payments linked to this invoice.">
            <div className="space-y-3">
              {invoicePayments.map((payment) => (
                <Link
                  key={payment.id}
                  to="/admin/billing/payments/$paymentId"
                  params={{ paymentId: payment.id }}
                  className="block rounded-xl border border-border bg-surface p-4 transition hover:border-primary/30 hover:bg-primary-soft/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-xs">{payment.id}</div>
                      <div className="mt-1 text-sm font-medium">KES {payment.amount.toLocaleString()} via {payment.method}</div>
                    </div>
                    <StatusBadge tone={payment.status === "Confirmed" ? "success" : payment.status === "Failed" ? "danger" : "warning"}>{payment.status}</StatusBadge>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">{payment.reference} - {payment.reconciliation}</div>
                </Link>
              ))}
              {invoicePayments.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No payment has been matched to this invoice yet.</div>}
            </div>
          </SectionCard>

          <SectionCard title="Billing notes" description="Internal follow-up context for the billing team.">
            <div className="space-y-3">
              {invoiceNotes.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium">{item.author}</div>
                    <div className="text-xs text-muted-foreground">{item.time}</div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
              {invoiceNotes.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No billing notes yet.</div>}
            </div>
          </SectionCard>
        </div>
      </PageBody>

      <AdminModal open={showNote} onOpenChange={setShowNote} title="Add billing note" description="Record internal context for this invoice.">
        <form onSubmit={submitNote}>
          <AdminTextareaField label="Note" required value={note} onChange={(event) => setNote(event.target.value)} />
          <AdminModalFooter onCancel={() => setShowNote(false)} submitLabel="Save note" />
        </form>
      </AdminModal>
    </>
  );
}
