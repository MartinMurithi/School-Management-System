import { Link, createFileRoute } from "@tanstack/react-router";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BookOpen, CreditCard, Eye, FileText, MessageSquareText, Phone, ShieldCheck, UserRound } from "lucide-react";
import { initials, receipts, students } from "@/lib/school-data";
import { academicHistory, academicsSignals, attendanceSignals, financeSignals, profileDocuments, profileMedical, profileTimelineSeed } from "@/lib/sis-data";

export const Route = createFileRoute("/school/students/$studentId")({ component: StudentDetail });

function StudentDetail() {
  const { studentId } = Route.useParams();
  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return (
      <>
        <PageHeader eyebrow="Student profile" title="Student not found" />
        <PageBody>
          <Link to="/school/students" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to students
          </Link>
        </PageBody>
      </>
    );
  }

  const studentReceipts = receipts.filter((receipt) => receipt.studentId === student.id);

  return (
    <>
      <PageHeader
        eyebrow="Student profile"
        title={student.name}
        description="Learner identity, finance, guardian, attendance, receipts, and student actions."
      />
      <PageBody>
        <DetailHero
          eyebrow="Learner record"
          title={student.name}
          description={`${student.adm} - ${student.class} - ${student.curr}`}
          icon={<span className="font-display text-lg font-semibold">{initials(student.name)}</span>}
          badges={
            <>
              <StatusBadge tone={student.status === "Active" ? "success" : "neutral"}>{student.status}</StatusBadge>
              <StatusBadge tone={student.curr === "CBC" ? "info" : "primary"}>{student.curr}</StatusBadge>
              <StatusBadge tone={student.balance > 0 ? "warning" : "success"}>{student.balance > 0 ? "Balance due" : "Fees clear"}</StatusBadge>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Attendance" value={`${student.attendance}%`} icon={ShieldCheck} />
          <MetricCard label="Balance" value={student.balance > 0 ? `KES ${student.balance.toLocaleString()}` : "Cleared"} icon={CreditCard} />
          <MetricCard label="Class" value={student.class.split(" ")[0]} icon={BookOpen} />
          <MetricCard label="Receipts" value={String(studentReceipts.length)} icon={FileText} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <SectionCard title="Bio Data" description="Core learner identity and registration details.">
            <DetailGrid
              items={[
                ["Full name", student.name],
                ["Date of birth", "2014-06-14"],
                ["Gender", "Female"],
                ["Admission", student.adm],
                ["NEMIS number", "NEMIS-042-2026"],
              ]}
            />
          </SectionCard>

          <SectionCard title="Timeline">
            <DetailTimeline
              items={profileTimelineSeed}
            />
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Academic Section" description="Class assignment, history, and performance signal.">
            <DetailGrid
              items={[
                ["Class", student.class],
                ["Curriculum", student.curr],
                ["Current stream", student.class.split(" ").slice(2).join(" ") || "Main"],
                ["Academic status", student.status === "Active" ? "In session" : "Alumni"],
              ]}
            />
            <div className="mt-4 space-y-2">
              {academicHistory.map((history) => (
                <div key={`${history.term}-${history.class}`} className="rounded-md border border-border bg-surface px-3 py-2">
                  <p className="text-sm font-medium">{history.term}</p>
                  <p className="text-xs text-muted-foreground">{history.class} - Performance {history.performance} - {history.status}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Attendance & Academics" description="Attendance analytics and current academics at a glance.">
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Attendance consistency</span>
                  <span className="tabular-nums text-muted-foreground">{student.attendance}%</span>
                </div>
                <ProgressBar value={student.attendance} tone={student.attendance > 95 ? "success" : "warning"} />
              </div>
              {attendanceSignals.map((item) => (
                <div key={item.week}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span>{item.week}</span>
                    <span>{item.rate}%</span>
                  </div>
                  <ProgressBar value={item.rate} tone={item.rate >= 95 ? "success" : "warning"} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-2">
                {academicsSignals.map((signal) => (
                  <div key={signal.label} className="rounded-md border border-border bg-surface px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">{signal.label}</p>
                    <p className="text-sm font-medium">{signal.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Guardian Section" description="Linked guardian and communication details.">
            <DetailGrid
              items={[
                ["Guardian", student.guardian],
                ["Guardian phone", student.guardianPhone],
                ["Billing responsibility", "100%"],
                ["Communication preference", "SMS + Email"],
                ["Parent portal", "Active"],
              ]}
            />
          </SectionCard>
          <SectionCard title="Medical Section" description="Allergies, conditions, and emergency records.">
            <DetailGrid
              items={profileMedical.map((item) => [item.label, item.value])}
            />
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Financial Section" description="Balance, invoicing, and receipt activity.">
            <DetailGrid
              items={[
                ["Current balance", student.balance > 0 ? `KES ${student.balance.toLocaleString()}` : "Cleared"],
                ["Last payment", student.lastPayment],
                ["Fee billing status", student.balance > 0 ? "Outstanding" : "Up to date"],
              ]}
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {financeSignals.map((signal) => (
                <div key={signal.label} className="rounded-md border border-border bg-surface px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">{signal.label}</p>
                  <p className="text-sm font-medium">{signal.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Documents" description="Required student documents and verification state.">
            <ul className="space-y-2">
              {profileDocuments.map((document) => (
                <li key={document} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
                  <span className="text-sm">{document}</span>
                  <StatusBadge tone="success">Uploaded</StatusBadge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <DetailActionPanel title="Student actions" description="Actions are available here after reviewing the learner context.">
          <Button className="gap-1.5">
            <FileText className="h-4 w-4" />
            Generate statement
          </Button>
          <Button variant="outline" className="gap-1.5">
            <MessageSquareText className="h-4 w-4" />
            Message guardian
          </Button>
          <Button variant="outline" className="gap-1.5">
            <Phone className="h-4 w-4" />
            Log call
          </Button>
        </DetailActionPanel>

        <SectionCard title="Receipts" description="Payments attached to this learner." padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <TableHead className="px-5 py-2.5">Receipt</TableHead>
                <TableHead className="px-5 py-2.5">Method</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentReceipts.map((receipt) => (
                <TableRow key={receipt.id} className="border-border/60">
                  <TableCell className="px-5 py-3 font-mono text-xs">{receipt.id}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{receipt.method}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">KES {receipt.amount.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3"><StatusBadge tone="success">{receipt.status}</StatusBadge></TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to="/school/finance/$receiptId" params={{ receiptId: receipt.id }} aria-label={`View ${receipt.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {studentReceipts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-5 py-8 text-center text-muted-foreground">
                    No receipts for this learner.
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
