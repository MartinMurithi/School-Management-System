import { createFileRoute } from "@tanstack/react-router";
import { SectionCard } from "@/components/shell/widgets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { teacherSchedule } from "@/lib/staff-module-data";

export const Route = createFileRoute("/school/staff/schedule")({ component: TeacherSchedulePage });

function TeacherSchedulePage() {
  return (
    <SectionCard title="Teacher Schedule" description="View timetable, substitute slots, and lesson planning queue." padded={false}>
      <Table>
        <TableHeader>
          <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
            <TableHead className="px-5 py-2.5">Day</TableHead>
            <TableHead className="px-5 py-2.5">Teacher</TableHead>
            <TableHead className="px-5 py-2.5">Time Block</TableHead>
            <TableHead className="px-5 py-2.5">Lesson</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teacherSchedule.map((item) => (
            <TableRow key={`${item.day}-${item.teacher}-${item.block}`} className="border-border/60">
              <TableCell className="px-5 py-3">{item.day}</TableCell>
              <TableCell className="px-5 py-3 font-medium">{item.teacher}</TableCell>
              <TableCell className="px-5 py-3 text-muted-foreground">{item.block}</TableCell>
              <TableCell className="px-5 py-3">{item.lesson}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </SectionCard>
  );
}
