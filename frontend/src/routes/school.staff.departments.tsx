import { createFileRoute } from "@tanstack/react-router";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { departments } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff/departments")({ component: StaffDepartmentsPage });

function StaffDepartmentsPage() {
  return (
    <SectionCard title="Department Management" description="Department structures, HOD assignments, and analytics.">
      <div className="space-y-3">
        {departments.map((department) => (
          <div key={department.name} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">{department.name}</p>
              <p className="text-xs text-muted-foreground">HOD: {department.hod} - {department.teachers} teachers - avg load {department.avgLoad} hrs</p>
            </div>
            <StatusBadge tone={department.status === "Balanced" ? "success" : "warning"}>{department.status}</StatusBadge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
