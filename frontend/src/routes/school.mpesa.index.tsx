import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminActionIcon } from "@/components/admin/AdminControls";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CheckCircle2, Eye, RefreshCw, Smartphone } from "lucide-react";
import { mpesaTransactions } from "@/lib/school-data";

export const Route = createFileRoute("/school/mpesa/")({ component: Mpesa });

function Mpesa() {
  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="M-PESA Reconciliation"
        description="Live Paybill 247247 - STK Push enabled"
        actions={
          <>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <RefreshCw className="h-4 w-4" />
              Sync now
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm text-primary-foreground hover:opacity-90">
              <Smartphone className="h-4 w-4" />
              Send STK Push
            </button>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Today's transactions" value="64" delta="+8" trend="up" icon={Smartphone} />
          <MetricCard label="Auto-matched" value="58" delta="90.6%" trend="up" icon={CheckCircle2} hint="of total" />
          <MetricCard label="Needs review" value="6" delta="-3" trend="down" icon={AlertTriangle} />
          <MetricCard label="Collected" value="KES 388K" delta="+22%" trend="up" icon={Smartphone} />
        </div>

        <SectionCard
          title="Live transactions"
          description="Auto-refreshing - last sync 8s ago"
          action={
            <div className="flex items-center gap-1 rounded-md bg-muted p-1 text-xs">
              <button className="rounded bg-card px-2.5 py-1.5 font-medium shadow-card">All</button>
              <button className="rounded px-2.5 py-1.5 text-muted-foreground hover:text-foreground">Matched</button>
              <button className="rounded px-2.5 py-1.5 text-muted-foreground hover:text-foreground">Review - 6</button>
              <button className="rounded px-2.5 py-1.5 text-muted-foreground hover:text-foreground">Failed</button>
            </div>
          }
          padded={false}
        >
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <TableHead className="px-5 py-2.5">Time</TableHead>
                <TableHead className="px-5 py-2.5">Receipt</TableHead>
                <TableHead className="px-5 py-2.5">Phone</TableHead>
                <TableHead className="px-5 py-2.5">Reference</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                <TableHead className="px-5 py-2.5">Match</TableHead>
                <TableHead className="px-5 py-2.5">Student</TableHead>
                <TableHead className="px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mpesaTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-border/60 hover:bg-muted/40">
                  <TableCell className="px-5 py-3 tabular-nums text-muted-foreground">{transaction.time}</TableCell>
                  <TableCell className="px-5 py-3 font-mono text-xs">{transaction.receipt}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{transaction.phone}</TableCell>
                  <TableCell className="px-5 py-3 font-mono text-xs">{transaction.reference}</TableCell>
                  <TableCell className="px-5 py-3 text-right font-medium tabular-nums">KES {transaction.amount.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={transaction.match === "Auto" ? "success" : "warning"}>
                      {transaction.match === "Auto" ? "Matched" : "Review"}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-sm">{transaction.student}</TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex justify-end">
                      <AdminActionIcon asChild label={`View transaction ${transaction.receipt}`}>
                        <Link to="/school/mpesa/$transactionId" params={{ transactionId: transaction.id }}>
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

        <SectionCard title="Reconciliation queue" description="Unmatched payments awaiting manual matching">
          <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-warning/20 text-warning-foreground">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm">
                KES 12,500 - ref <span className="font-mono">JK4-2026</span>
              </div>
              <div className="text-xs text-muted-foreground">From +254 711 ... 003 - 14:22</div>
              <div className="mt-3 text-xs">
                <div className="mb-1.5 text-muted-foreground">Probable matches:</div>
                <div className="flex flex-wrap gap-1.5">
                  <Link to="/school/mpesa/$transactionId" params={{ transactionId: "SHB4XK18M" }} className="rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                    Review transaction <span className="ml-1 text-success">92%</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
