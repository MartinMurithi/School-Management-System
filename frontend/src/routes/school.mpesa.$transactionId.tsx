import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, CreditCard, Search, ShieldCheck, Smartphone, UserRound } from "lucide-react";
import { mpesaTransactions, students } from "@/lib/school-data";

export const Route = createFileRoute("/school/mpesa/$transactionId")({ component: MpesaTransactionDetail });

function MpesaTransactionDetail() {
  const { transactionId } = Route.useParams();
  const transaction = mpesaTransactions.find((item) => item.id === transactionId);
  const probableStudent = transaction?.probableStudentId
    ? students.find((student) => student.id === transaction.probableStudentId)
    : undefined;
  const [match, setMatch] = useState(transaction?.match ?? "Review");
  const [notice, setNotice] = useState("");

  if (!transaction) {
    return (
      <>
        <PageHeader eyebrow="M-PESA" title="Transaction not found" />
        <PageBody>
          <Link to="/school/mpesa" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to M-PESA
          </Link>
        </PageBody>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="M-PESA transaction"
        title={transaction.receipt}
        description="Payment receipt, reconciliation match, probable learner, and finance operations."
      />
      <PageBody>
        {notice && <div className="rounded-lg border border-border bg-primary-soft px-4 py-3 text-sm text-primary">{notice}</div>}

        <DetailHero
          eyebrow="Safaricom receipt"
          title={transaction.receipt}
          description={`${transaction.phone} - Reference ${transaction.reference}`}
          icon={<Smartphone className="h-6 w-6" />}
          badges={<StatusBadge tone={match === "Auto" ? "success" : "warning"}>{match === "Auto" ? "Matched" : "Needs review"}</StatusBadge>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Amount" value={`KES ${transaction.amount.toLocaleString()}`} icon={CreditCard} />
          <MetricCard label="Match" value={match === "Auto" ? "Matched" : "Review"} icon={ShieldCheck} />
          <MetricCard label="Time" value={transaction.time} icon={Smartphone} />
          <MetricCard label="Reference" value={transaction.reference} icon={Search} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Transaction details">
            <DetailGrid
              items={[
                ["Receipt", transaction.receipt],
                ["Phone", transaction.phone],
                ["Reference", transaction.reference],
                ["Student match", transaction.student],
                ["Payment time", transaction.time],
                ["Amount", `KES ${transaction.amount.toLocaleString()}`],
              ]}
            />
          </SectionCard>

          <SectionCard title="Reconciliation match">
            {probableStudent ? (
              <div className="space-y-3 text-sm">
                <div className="rounded-lg border border-border bg-surface p-3">
                  <div className="mb-2 flex items-center gap-2 font-medium">
                    <UserRound className="h-4 w-4 text-primary" />
                    {probableStudent.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{probableStudent.adm} - {probableStudent.class}</div>
                </div>
                <Button variant="outline" asChild className="w-full">
                  <Link to="/school/students/$studentId" params={{ studentId: probableStudent.id }}>
                    Open student profile
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No probable student match is available.</div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Matching timeline">
          <DetailTimeline
            items={[
              { title: "Payment received", detail: `${transaction.time} from ${transaction.phone}`, tone: "success" },
              { title: "Reference parsed", detail: transaction.reference, tone: "primary" },
              { title: "Match status", detail: match === "Auto" ? "Auto-matched and receipted" : "Manual review required", tone: match === "Auto" ? "success" : "warning" },
            ]}
          />
        </SectionCard>

        <DetailActionPanel title="Reconciliation actions" description="Match or investigate the transaction after reviewing the details.">
          <Button
            onClick={() => {
              setMatch("Auto");
              setNotice("Transaction confirmed and marked as matched.");
            }}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            Confirm match
          </Button>
          <Button variant="outline" onClick={() => setNotice("Manual search workflow opened.")}>
            Search student
          </Button>
          <Button variant="outline" onClick={() => setNotice("Transaction flagged for finance review.")}>
            Flag for review
          </Button>
        </DetailActionPanel>
      </PageBody>
    </>
  );
}
