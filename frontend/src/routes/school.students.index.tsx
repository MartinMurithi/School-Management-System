import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminActionIcon, AdminSearchInput } from "@/components/admin/AdminControls";
import { PageBody, PageHeader } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Eye, Filter, Users } from "lucide-react";
import { initials, students } from "@/lib/school-data";
import { sisFlow, sisHeroDescription, sisHeroLabel, sisHeroTitle, sisKpis, sisModules, sisOutputFeeds } from "@/lib/sis-data";

export const Route = createFileRoute("/school/students/")({ component: Students });

function Students() {
  const [query, setQuery] = useState("");
  const filteredStudents = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return students.filter((student) =>
      !needle ||
      [student.adm, student.name, student.class, student.curr, student.guardian]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  return (
    <>
      <PageHeader
        eyebrow={sisHeroLabel}
        title={sisHeroTitle}
        description={sisHeroDescription}
      />
      <PageBody>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
          {sisKpis.map((kpi) => (
            <MetricCard key={kpi.label} label={kpi.label} value={kpi.value} />
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {sisModules.map((module) => (
            <Button key={module.slug} asChild variant={module.slug === "directory" ? "default" : "outline"} size="sm">
              <Link to={module.to}>{module.shortLabel}</Link>
            </Button>
          ))}
        </div>

        <SectionCard title="SIS End-to-End Flow" description="Operational path from applicant to alumni status.">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {sisFlow.map((step, index) => (
              <div key={step} className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5">
                <span>{step}</span>
                {index < sisFlow.length - 1 && <span className="text-muted-foreground">-&gt;</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>Feeds:</span>
            {sisOutputFeeds.map((feed) => (
              <StatusBadge key={feed} tone="info" dot={false}>{feed}</StatusBadge>
            ))}
          </div>
        </SectionCard>

        <SectionCard padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <AdminSearchInput value={query} onChange={setQuery} placeholder="Search by name, admission no, NEMIS..." />
            <Button asChild variant="outline" size="sm">
              <Link to="/school/students/guardians">
                <Users className="h-4 w-4" />
                Guardians
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/school/students/transfers">
                <CheckCircle2 className="h-4 w-4" />
                Transfers
              </Link>
            </Button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm hover:bg-muted">
              <Filter className="h-4 w-4" />
              Class
            </button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <TableHead className="w-8 px-5 py-2.5">
                  <input type="checkbox" className="rounded border-border" />
                </TableHead>
                <TableHead className="px-5 py-2.5">Admission</TableHead>
                <TableHead className="px-5 py-2.5">Student</TableHead>
                <TableHead className="px-5 py-2.5">Class</TableHead>
                <TableHead className="px-5 py-2.5">Curriculum</TableHead>
                <TableHead className="px-5 py-2.5">Guardian</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Balance (KES)</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.adm} className="border-border/60 hover:bg-muted/40">
                  <TableCell className="px-5 py-3">
                    <input type="checkbox" className="rounded border-border" />
                  </TableCell>
                  <TableCell className="px-5 py-3 font-mono text-xs">{student.adm}</TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary to-info text-xs font-semibold text-primary-foreground">
                        {initials(student.name)}
                      </div>
                      <Link
                        to="/school/students/$studentId"
                        params={{ studentId: student.id }}
                        className="font-medium hover:text-primary"
                      >
                        {student.name}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{student.class}</TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={student.curr === "CBC" ? "info" : "primary"} dot={false}>
                      {student.curr}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{student.guardian}</TableCell>
                  <TableCell className={`px-5 py-3 text-right tabular-nums ${student.balance > 0 ? "font-medium text-destructive" : "text-muted-foreground"}`}>
                    {student.balance > 0 ? student.balance.toLocaleString() : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={student.status === "Active" ? "success" : "neutral"}>{student.status}</StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex justify-end">
                      <AdminActionIcon asChild label={`View ${student.name}`}>
                        <Link to="/school/students/$studentId" params={{ studentId: student.id }}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </AdminActionIcon>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No students match the current search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SectionCard>
      </PageBody>
    </>
  );
}
