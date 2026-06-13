import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminActionIcon } from "@/components/admin/AdminControls";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge, Sparkline } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Eye, FileText, Plus, Receipt, TrendingUp, Wallet } from "lucide-react";
import { receipts, students } from "@/lib/school-data";

export const Route = createFileRoute("/school/finance/")({ component: Finance });

const defaulters = students.filter((student) => student.balance > 0).slice(0, 4);

function Finance() {
  return (
    <>
      <PageHeader
        eyebrow="Finance"
        title="Finance & Billing"
        description="Term 2 fee structure - KES 2.4M expected this week"
        actions={
          <>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <FileText className="h-4 w-4" />
              Statements
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4" />
              Generate invoices
            </button>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Collected today" value="KES 412K" delta="+18%" trend="up" icon={Wallet} />
          <MetricCard label="Outstanding" value="KES 8.4M" delta="-4.1%" trend="down" icon={AlertTriangle} />
          <MetricCard label="Receipts today" value="64" icon={Receipt} hint="58 M-PESA - 6 bank" />
          <MetricCard label="Term collections" value="KES 18.2M" delta="+12%" trend="up" icon={TrendingUp} />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Collections vs target - this term" className="lg:col-span-2">
            <Sparkline data={[40, 60, 80, 110, 140, 160, 190, 220, 245, 270, 290, 320]} />
          </SectionCard>
          <SectionCard
            title="Top defaulters"
            action={
              <Link to="/school/finance/defaulters" className="text-sm text-primary hover:underline">
                View all
              </Link>
            }
          >
            <ul className="space-y-3 text-sm">
              {defaulters.map((student) => (
                <li key={student.id} className="flex items-center justify-between gap-3">
                  <Link to="/school/students/$studentId" params={{ studentId: student.id }} className="min-w-0 hover:text-primary">
                    <div className="font-medium">{student.name}</div>
                    <div className="text-xs text-muted-foreground">{student.class}</div>
                  </Link>
                  <div className="text-sm font-medium tabular-nums text-destructive">KES {student.balance.toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <SectionCard title="Collection rate by class">
          <ul className="space-y-3">
            {[
              { label: "Grade 4 East", value: 96 },
              { label: "Grade 6 West", value: 88 },
              { label: "JSS 1 North", value: 72 },
              { label: "Form 2 Blue", value: 81 },
              { label: "Form 4 Red", value: 65 },
            ].map((collection) => (
              <li key={collection.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{collection.label}</span>
                  <span className="tabular-nums text-muted-foreground">{collection.value}%</span>
                </div>
                <ProgressBar value={collection.value} tone={collection.value > 85 ? "success" : collection.value > 70 ? "warning" : "danger"} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent receipts" padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <TableHead className="px-5 py-2.5">Receipt</TableHead>
                <TableHead className="px-5 py-2.5">Student</TableHead>
                <TableHead className="px-5 py-2.5">Method</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Time</TableHead>
                <TableHead className="px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt) => (
                <TableRow key={receipt.id} className="border-border/60 hover:bg-muted/40">
                  <TableCell className="px-5 py-3 font-mono text-xs">{receipt.id}</TableCell>
                  <TableCell className="px-5 py-3 font-medium">{receipt.student}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{receipt.method}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">KES {receipt.amount.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3"><StatusBadge tone="success">{receipt.status}</StatusBadge></TableCell>
                  <TableCell className="px-5 py-3 text-right text-muted-foreground">{receipt.time}</TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex justify-end">
                      <AdminActionIcon asChild label={`View ${receipt.id}`}>
                        <Link to="/school/finance/$receiptId" params={{ receiptId: receipt.id }}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </AdminActionIcon>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>
      </PageBody>
    </>
  );
}
