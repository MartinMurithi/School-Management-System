import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { Button } from "@/components/ui/button";
import { staffModules } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff")({ component: StaffLayout });

function StaffLayout() {
  return (
    <>
      <PageHeader
        eyebrow="Academic Operations Engine"
        title="Staff & Teacher Module"
        description="Manage workforce registration, allocation, schedules, marks, and performance tracking."
      />
      <PageBody>
        <div className="flex flex-wrap gap-2">
          {staffModules.map((module) => (
            <Button key={module.slug} asChild variant={module.slug === "dashboard" ? "default" : "outline"} size="sm">
              <Link to={module.to}>{module.shortLabel}</Link>
            </Button>
          ))}
        </div>
        <Outlet />
      </PageBody>
    </>
  );
}
