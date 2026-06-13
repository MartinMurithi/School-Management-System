import { Link, createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/shell/AppShell";
import { DetailGrid } from "@/components/admin/DetailView";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { teacherProfiles } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff/$teacherId")({ component: TeacherProfilePage });

function TeacherProfilePage() {
  const { teacherId } = Route.useParams();
  const teacher = teacherProfiles.find((item) => item.id === teacherId);

  if (!teacher) {
    return (
      <div className="space-y-4">
        <PageHeader title="Teacher not found" description="The teacher record could not be found." />
        <Button asChild variant="outline" size="sm">
          <Link to="/school/staff">
            <ArrowLeft className="h-4 w-4" />
            Back to staff
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader title={teacher.name} description="Teacher profile, TSC details, qualifications, and employment status." />
      <SectionCard title="Teacher Profile">
        <DetailGrid
          items={[
            ["Full name", teacher.name],
            ["TSC number", teacher.tsc],
            ["Date of birth", teacher.dob],
            ["Gender", teacher.gender],
            ["Department", teacher.dept],
            ["Qualifications", teacher.qualifications],
            ["Employment", teacher.employment],
            ["Weekly load", `${teacher.load} hrs`],
          ]}
        />
        <div className="mt-4 flex items-center gap-2">
          <StatusBadge tone={teacher.status === "Active" ? "success" : "warning"}>{teacher.status}</StatusBadge>
          <StatusBadge tone={teacher.pendingMarks > 0 ? "warning" : "success"}>{teacher.pendingMarks} pending marks</StatusBadge>
        </div>
      </SectionCard>
    </div>
  );
}
