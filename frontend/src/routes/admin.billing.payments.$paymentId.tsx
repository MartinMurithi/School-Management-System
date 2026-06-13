import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AdminModalFooter, AdminTextareaField } from "@/components/admin/AdminControls";
import { AdminModal } from "@/components/admin/AdminModal";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, CreditCard, FileText, Receipt, RefreshCcw, Smartphone, Wallet } from "lucide-react";
import { useAdminBillingStore } from "@/lib/admin-billing-store";

export const Route = createFileRoute("/admin/billing/payments/$paymentId")({ component: PaymentDetail });

function PaymentDetail() {
  const { paymentId } = Route.useParams();
  const { payments, invoices, notes, addNote, updateInvoice } = useAdminBillingStore();
  const payment = payments.find((item) => item.id === paymentId);
  const linkedInvoice = payment ? invoices.find((invoice) => invoice.id === payment.invoiceId) : undefined;
  const paymentNotes = notes.filter((note) => note.targetId === paymentId);
  const [notice, setNotice] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");

  if (!payment) {
    return (
      <>
        <PageHeader title="Payment not found" description="The payment record could not be found." />
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

  const currentPayment = payment;

  function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addNote(currentPayment.id, note);
    setNote("");
    setShowNote(false);
    setNotice("Payment note added.");
  }

  return (
    <>
      <PageHeader
        title={payment.id}
        description="Payment receipt, reconciliation status, linked invoice, and billing follow-up actions."
      />
      <PageBody>
        {notice && <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary">{notice}</div>}

        <DetailHero
          eyebrow="Payment record"
          title={payment.id}
          description={`${payment.school} - ${payment.method} payment reference ${payment.reference}`}
          icon={payment.method === "M-PESA" ? <Smartphone className="h-6 w-6" /> : <Receipt className="h-6 w-6" />}
          badges={
            <>
              <StatusBadge tone={payment.status === "Confirmed" ? "success" : payment.status === "Failed" ? "danger" : "warning"}>{payment.status}</StatusBadge>
              <StatusBadge tone={payment.reconciliation === "Matched" ? "success" : payment.reconciliation === "Unmatched" ? "danger" : "warning"}>{payment.reconciliation}</StatusBadge>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Amount" value={`KES ${payment.amount.toLocaleString()}`} icon={Wallet} />
          <MetricCard label="Method" value={payment.method} icon={CreditCard} />
          <MetricCard label="Invoice" value={payment.invoiceId} icon={FileText} />
          <MetricCard label="Date" value={payment.date} icon={Receipt} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Payment details" description="Reconciliation data for platform billing.">
            <DetailGrid
              items={[
                ["School", <Link key="school" to="/admin/billing/subscriptions/$subscriptionId" params={{ subscriptionId: payment.schoolId }} className="text-primary hover:underline">{payment.school}</Link>],
                ["Invoice", <Link key="invoice" to="/admin/billing/invoices/$invoiceId" params={{ invoiceId: payment.invoiceId }} className="text-primary hover:underline">{payment.invoiceId}</Link>],
                ["Reference", payment.reference],
                ["Method", payment.method],
                ["Status", payment.status],
                ["Reconciliation", payment.reconciliation],
              ]}
            />
          </SectionCard>

          <SectionCard title="Reconciliation timeline">
            <DetailTimeline
              items={[
                { title: "Payment captured", detail: `${payment.method} reference recorded on ${payment.date}.`, tone: "primary" },
                { title: payment.reconciliation, detail: linkedInvoice ? "Payment is linked to a SaaS invoice." : "No invoice match found.", tone: payment.reconciliation === "Matched" ? "success" : "warning" },
                { title: "Audit ready", detail: "Finance team can add notes before closing reconciliation.", tone: "info" },
              ]}
            />
          </SectionCard>
        </div>

        <DetailActionPanel title="Payment actions" description="Use these for reconciliation follow-up.">
          <Button
            onClick={() => {
              if (linkedInvoice) updateInvoice(linkedInvoice.id, { status: "Paid", grace: "-" });
              setNotice("Payment matched and linked invoice marked as paid.");
            }}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm match
          </Button>
          <Button variant="outline" onClick={() => setNotice("Reversal review queued for billing team.")} className="gap-1.5">
            <RefreshCcw className="h-4 w-4" />
            Review reversal
          </Button>
          <Button variant="outline" onClick={() => setShowNote(true)} className="gap-1.5">
            <FileText className="h-4 w-4" />
            Add note
          </Button>
        </DetailActionPanel>

        <SectionCard title="Payment notes" description="Internal billing reconciliation notes.">
          <div className="grid gap-3 md:grid-cols-2">
            {paymentNotes.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{item.author}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
            {paymentNotes.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No notes for this payment yet.</div>}
          </div>
        </SectionCard>
      </PageBody>

      <AdminModal open={showNote} onOpenChange={setShowNote} title="Add payment note" description="Record internal context for this payment.">
        <form onSubmit={submitNote}>
          <AdminTextareaField label="Note" required value={note} onChange={(event) => setNote(event.target.value)} />
          <AdminModalFooter onCancel={() => setShowNote(false)} submitLabel="Save note" />
        </form>
      </AdminModal>
    </>
  );
}
