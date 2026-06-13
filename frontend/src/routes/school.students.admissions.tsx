import { createFileRoute } from "@tanstack/react-router";
import { DetailTimeline } from "@/components/admin/DetailView";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { admissionsWorkflow, applicationPipeline } from "@/lib/sis-data";

export const Route = createFileRoute("/school/students/admissions")({
  component: StudentAdmissionsPage,
});

function StudentAdmissionsPage() {
  return (
    <div className="space-y-4">
      <SectionCard title="Student Admissions" description="Online applications, document submission, approval, and admission letter readiness.">
        <DetailTimeline
          items={admissionsWorkflow.map((step, index) => ({
            title: step,
            detail: `Stage ${index + 1}`,
            tone: index < 2 ? "success" : index < 4 ? "info" : "primary",
          }))}
        />
      </SectionCard>

      <SectionCard title="Admission Pipeline" description="Applicant to enrollment progression and billing trigger status." padded={false}>
        <Table>
          <TableHeader>
            <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <TableHead className="px-5 py-2.5">Applicant</TableHead>
              <TableHead className="px-5 py-2.5">Target Class</TableHead>
              <TableHead className="px-5 py-2.5">Documents</TableHead>
              <TableHead className="px-5 py-2.5">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicationPipeline.map((item) => (
              <TableRow key={item.applicant} className="border-border/60">
                <TableCell className="px-5 py-3 font-medium">{item.applicant}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{item.classTarget}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{item.documents}</TableCell>
                <TableCell className="px-5 py-3">
                  <StatusBadge tone={item.status === "Accepted" ? "success" : item.status === "Rejected" ? "danger" : item.status === "Review" ? "warning" : "info"}>
                    {item.status}
                  </StatusBadge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
