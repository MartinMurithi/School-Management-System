import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminActionIcon } from "@/components/admin/AdminControls";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, ClipboardCheck, Eye, Megaphone, UserSquare2 } from "lucide-react";
import { pendingMarks, teacherProfiles, todayLessons } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff/")({ component: StaffDashboardPage });

function StaffDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Teaching staff" value="72" icon={UserSquare2} />
        <MetricCard label="Today's lessons" value="38" icon={BookOpen} />
        <MetricCard label="Pending marks" value="14" icon={ClipboardCheck} />
        <MetricCard label="Announcements" value="3" icon={Megaphone} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Today's lessons" description="Live lesson queue for teaching teams.">
          <ul className="space-y-2">
            {todayLessons.map((lesson) => (
              <li key={`${lesson.teacher}-${lesson.time}`} className="rounded-md border border-border bg-surface px-3 py-2">
                <p className="text-sm font-medium">{lesson.lesson}</p>
                <p className="text-xs text-muted-foreground">{lesson.time} - {lesson.teacher}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Pending marks" description="Marks entry tasks that need completion.">
          <ul className="space-y-2">
            {pendingMarks.map((item) => (
              <li key={`${item.teacher}-${item.exam}`} className="rounded-md border border-border bg-surface px-3 py-2">
                <p className="text-sm font-medium">{item.exam}</p>
                <p className="text-xs text-muted-foreground">{item.teacher} - {item.due}</p>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Attendance tasks" description="Class attendance follow-up actions.">
          <ul className="space-y-2">
            {teacherProfiles.slice(0, 3).map((teacher) => (
              <li key={teacher.id} className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2">
                <span className="text-sm">{teacher.name}</span>
                <StatusBadge tone="warning">{teacher.attendanceTasks} tasks</StatusBadge>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <SectionCard title="Teacher directory" padded={false}>
        <Table>
          <TableHeader>
            <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <TableHead className="px-5 py-2.5">Teacher</TableHead>
              <TableHead className="px-5 py-2.5">Department</TableHead>
              <TableHead className="px-5 py-2.5">Lessons today</TableHead>
              <TableHead className="px-5 py-2.5">Pending marks</TableHead>
              <TableHead className="px-5 py-2.5 text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherProfiles.map((teacher) => (
              <TableRow key={teacher.id} className="border-border/60">
                <TableCell className="px-5 py-3 font-medium">{teacher.name}</TableCell>
                <TableCell className="px-5 py-3 text-muted-foreground">{teacher.dept}</TableCell>
                <TableCell className="px-5 py-3">{teacher.lessonsToday}</TableCell>
                <TableCell className="px-5 py-3">{teacher.pendingMarks}</TableCell>
                <TableCell className="px-5 py-3 text-right">
                  <AdminActionIcon asChild label={`View ${teacher.name}`}>
                    <Link to="/school/staff/$teacherId" params={{ teacherId: teacher.id }}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </AdminActionIcon>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  );
}
