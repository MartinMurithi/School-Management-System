import { createFileRoute } from "@tanstack/react-router";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { subjectAllocations } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff/subject-allocation")({ component: SubjectAllocationPage });

function SubjectAllocationPage() {
  return (
    <SectionCard title="Subject Allocation" description="Assign subjects and classes while balancing workload." padded={false}>
      <Table>
        <TableHeader>
          <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <TableHead className="px-5 py-2.5">Subject</TableHead>
            <TableHead className="px-5 py-2.5">Class</TableHead>
            <TableHead className="px-5 py-2.5">Teacher</TableHead>
            <TableHead className="px-5 py-2.5">Load (hrs)</TableHead>
            <TableHead className="px-5 py-2.5">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subjectAllocations.map((item) => (
            <TableRow key={`${item.subject}-${item.classGroup}`} className="border-border/60">
              <TableCell className="px-5 py-3 font-medium">{item.subject}</TableCell>
              <TableCell className="px-5 py-3 text-muted-foreground">{item.classGroup}</TableCell>
              <TableCell className="px-5 py-3">{item.teacher}</TableCell>
              <TableCell className="px-5 py-3">{item.load}</TableCell>
              <TableCell className="px-5 py-3">
                <StatusBadge tone={item.load > 8 ? "warning" : "success"}>{item.load > 8 ? "Rebalance" : "Balanced"}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
