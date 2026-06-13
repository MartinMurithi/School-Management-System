import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminActionIcon } from "@/components/admin/AdminControls";
import { DetailActionPanel, DetailHero } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Banknote, Eye, MessageSquareText, Users } from "lucide-react";
import { students } from "@/lib/school-data";

export const Route = createFileRoute("/school/finance/defaulters")({ component: Defaulters });

const defaulters = students.filter((student) => student.balance > 0);

function Defaulters() {
  const total = defaulters.reduce((sum, student) => sum + student.balance, 0);

  return (
    <>
      <PageHeader
        eyebrow="Finance"
        title="Fee defaulters"
        description="Learners with active outstanding balances."
      />
      <PageBody>
        <DetailHero
          eyebrow="Collection workspace"
          title="Outstanding balances"
          description="Review learners with balances before sending reminders, printing statements, or opening student profiles."
          icon={<Banknote className="h-6 w-6" />}
          badges={<StatusBadge tone="warning">Requires follow-up</StatusBadge>}
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <MetricCard label="Defaulters" value={String(defaulters.length)} icon={Users} />
          <MetricCard label="Outstanding" value={`KES ${total.toLocaleString()}`} icon={Banknote} />
          <MetricCard label="SMS reminders" value="Ready" icon={MessageSquareText} />
        </div>

        <SectionCard title="Outstanding balances" description="Open a student profile before making collection decisions." padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <TableHead className="px-5 py-2.5">Student</TableHead>
                <TableHead className="px-5 py-2.5">Class</TableHead>
                <TableHead className="px-5 py-2.5">Guardian</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Balance</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {defaulters.map((student) => (
                <TableRow key={student.id} className="border-border/60 hover:bg-muted/40">
                  <TableCell className="px-5 py-3 font-medium">{student.name}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{student.class}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{student.guardian}</TableCell>
                  <TableCell className="px-5 py-3 text-right font-medium tabular-nums text-destructive">
                    KES {student.balance.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone="warning">Outstanding</StatusBadge>
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
            </TableBody>
          </Table>
        </SectionCard>

        <DetailActionPanel title="Collection actions" description="Use after reviewing the outstanding balance list.">
          <Button className="gap-1.5">
            <MessageSquareText className="h-4 w-4" />
            Send reminders
          </Button>
          <Button variant="outline">Export list</Button>
          <Button variant="outline">Print statements</Button>
        </DetailActionPanel>
      </PageBody>
    </>
  );
}
