import { createFileRoute } from "@tanstack/react-router";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { guardians } from "@/lib/sis-data";

export const Route = createFileRoute("/school/students/guardians")({
  component: GuardianManagementPage,
});

function GuardianManagementPage() {
  return (
    <SectionCard title="Guardian Management" description="Link guardians, set billing responsibility, and communication/portal preferences." padded={false}>
      <Table>
        <TableHeader>
          <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <TableHead className="px-5 py-2.5">Learner</TableHead>
            <TableHead className="px-5 py-2.5">Guardian</TableHead>
            <TableHead className="px-5 py-2.5">Relation</TableHead>
            <TableHead className="px-5 py-2.5">Billing</TableHead>
            <TableHead className="px-5 py-2.5">Communication</TableHead>
            <TableHead className="px-5 py-2.5">Portal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {guardians.map((item) => (
            <TableRow key={`${item.learner}-${item.guardian}`} className="border-border/60">
              <TableCell className="px-5 py-3 font-medium">{item.learner}</TableCell>
              <TableCell className="px-5 py-3">{item.guardian}</TableCell>
              <TableCell className="px-5 py-3 text-muted-foreground">{item.relation}</TableCell>
              <TableCell className="px-5 py-3">{item.billing}</TableCell>
              <TableCell className="px-5 py-3 text-muted-foreground">{item.channel}</TableCell>
              <TableCell className="px-5 py-3">
                <StatusBadge tone={item.portal === "Active" ? "success" : "info"}>{item.portal}</StatusBadge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
