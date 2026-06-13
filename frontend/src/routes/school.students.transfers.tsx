import { createFileRoute } from "@tanstack/react-router";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { alumniStages, progressionActions, transfers } from "@/lib/sis-data";

export const Route = createFileRoute("/school/students/transfers")({
  component: StudentTransfersPage,
});

function StudentTransfersPage() {
  return (
    <div className="space-y-4">
      <SectionCard title="Student Transfers" description="Internal/external transfers, clearances, and transfer archive management." padded={false}>
        <Table>
          <TableHeader>
            <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <TableHead className="px-5 py-2.5">Learner</TableHead>
              <TableHead className="px-5 py-2.5">Movement</TableHead>
              <TableHead className="px-5 py-2.5">Type</TableHead>
              <TableHead className="px-5 py-2.5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.map((item) => (
              <TableRow key={`${item.learner}-${item.move}`} className="border-border/60">
                <TableCell className="px-5 py-3 font-medium">{item.learner}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{item.move}</TableCell>
                <TableCell className="px-5 py-3">{item.type}</TableCell>
                <TableCell className="px-5 py-3">
                  <StatusBadge tone={item.status === "Cleared" ? "success" : item.status === "Pending" ? "warning" : "neutral"}>{item.status}</StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Progression Actions" description="Class advancement, repeat-year handling, and graduation batches.">
          <ul className="space-y-2">
            {progressionActions.map((item) => (
              <li key={item.action} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
                <span className="text-sm">{item.action}</span>
                <StatusBadge tone={item.tone}>{item.volume}</StatusBadge>
              </li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard title="Alumni Workflow" description="Clearance and archival path from graduation to alumni status.">
          <ul className="space-y-2">
            {alumniStages.map((item) => (
              <li key={item.stage} className="rounded-md border border-border bg-surface px-3 py-2">
                <p className="text-sm font-medium">{item.stage}</p>
                <p className="text-xs text-muted-foreground">Owner: {item.owner} - {item.state}</p>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
