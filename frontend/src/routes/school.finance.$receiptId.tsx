import { Link, createFileRoute } from "@tanstack/react-router";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Banknote, CheckCircle2, CreditCard, FileText, Printer, Receipt, UserRound } from "lucide-react";
import { receipts, students } from "@/lib/school-data";

export const Route = createFileRoute("/school/finance/$receiptId")({ component: ReceiptDetail });

function ReceiptDetail() {
  const { receiptId } = Route.useParams();
  const receipt = receipts.find((item) => item.id === receiptId);
  const student = receipt ? students.find((item) => item.id === receipt.studentId) : undefined;

  if (!receipt) {
    return (
      <>
        <PageHeader eyebrow="Receipt" title="Receipt not found" />
        <PageBody>
          <Link to="/school/finance" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to finance
          </Link>
        </PageBody>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Receipt detail"
        title={receipt.id}
        description="Official payment record, student linkage, and receipt operations."
      />
      <PageBody>
        <DetailHero
          eyebrow="Payment receipt"
          title={receipt.id}
          description={`${receipt.student} paid KES ${receipt.amount.toLocaleString()} via ${receipt.method}`}
          icon={<Receipt className="h-6 w-6" />}
          badges={<StatusBadge tone="success">{receipt.status}</StatusBadge>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Amount" value={`KES ${receipt.amount.toLocaleString()}`} icon={Banknote} />
          <MetricCard label="Method" value={receipt.method} icon={CreditCard} />
          <MetricCard label="Status" value={receipt.status} icon={CheckCircle2} />
          <MetricCard label="Student" value={receipt.student.split(" ")[0]} icon={UserRound} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Payment details">
            <DetailGrid
              items={[
                ["Receipt", receipt.id],
                ["Reference", receipt.reference],
                ["Student", receipt.student],
                ["Admission", student?.adm ?? "Unknown"],
                ["Class", student?.class ?? "Unknown"],
                ["Posted", receipt.time],
              ]}
            />
          </SectionCard>

          <SectionCard title="Audit trail">
            <DetailTimeline
              items={[
                { title: "Payment received", detail: `${receipt.method} reference ${receipt.reference}`, tone: "success" },
                { title: "Student matched", detail: student ? `${student.adm} - ${student.name}` : "No student match found", tone: student ? "success" : "warning" },
                { title: "Receipt posted", detail: receipt.time, tone: "primary" },
              ]}
            />
          </SectionCard>
        </div>

        <DetailActionPanel title="Receipt actions" description="Finance actions after confirming the receipt record.">
          <Button className="gap-1.5">
            <Printer className="h-4 w-4" />
            Print receipt
          </Button>
          <Button variant="outline" className="gap-1.5">
            <FileText className="h-4 w-4" />
            Download statement
          </Button>
          {student && (
            <Button variant="outline" asChild>
              <Link to="/school/students/$studentId" params={{ studentId: student.id }}>
                Open student profile
              </Link>
            </Button>
          )}
        </DetailActionPanel>
      </PageBody>
    </>
  );
}
