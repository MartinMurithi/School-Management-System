import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/school/timetable")({ component: Timetable });

const periods = ["8:00", "8:40", "9:20", "10:20", "11:00", "11:40", "12:20", "2:00", "2:40", "3:20"];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];

type Slot = { s: string; t: string; tone: string } | null;
const grid: Slot[][] = [
  [{s:"Math",t:"Mr. Kimani",tone:"bg-info/15 text-info border-info/30"},{s:"English",t:"Ms. Atieno",tone:"bg-primary/15 text-primary border-primary/30"},null,{s:"Science",t:"Mr. Owino",tone:"bg-success/15 text-success border-success/30"},{s:"Kiswahili",t:"Ms. Wairimu",tone:"bg-warning/20 text-warning-foreground border-warning/40"}],
  [{s:"Math",t:"Mr. Kimani",tone:"bg-info/15 text-info border-info/30"},{s:"English",t:"Ms. Atieno",tone:"bg-primary/15 text-primary border-primary/30"},{s:"PE",t:"Mr. Mutua",tone:"bg-success/15 text-success border-success/30"},{s:"Science",t:"Mr. Owino",tone:"bg-success/15 text-success border-success/30"},{s:"Kiswahili",t:"Ms. Wairimu",tone:"bg-warning/20 text-warning-foreground border-warning/40"}],
  [{s:"Social",t:"Ms. Njeri",tone:"bg-primary/15 text-primary border-primary/30"},null,{s:"CRE",t:"Mr. Mwangi",tone:"bg-info/15 text-info border-info/30"},{s:"Art",t:"Ms. Chebet",tone:"bg-warning/20 text-warning-foreground border-warning/40"},{s:"Math",t:"Mr. Kimani",tone:"bg-info/15 text-info border-info/30"}],
  [{s:"Break",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Break",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Break",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Break",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Break",t:"",tone:"bg-muted text-muted-foreground border-border"}],
  [{s:"Kiswahili",t:"Ms. Wairimu",tone:"bg-warning/20 text-warning-foreground border-warning/40"},{s:"Math",t:"Mr. Kimani",tone:"bg-info/15 text-info border-info/30"},{s:"English",t:"Ms. Atieno",tone:"bg-primary/15 text-primary border-primary/30"},{s:"Music",t:"Mr. Odera",tone:"bg-success/15 text-success border-success/30"},{s:"PE",t:"Mr. Mutua",tone:"bg-success/15 text-success border-success/30"}],
  [{s:"Science",t:"Mr. Owino",tone:"bg-success/15 text-success border-success/30"},{s:"Social",t:"Ms. Njeri",tone:"bg-primary/15 text-primary border-primary/30"},{s:"Math",t:"Mr. Kimani",tone:"bg-info/15 text-info border-info/30"},{s:"CONFLICT",t:"2 teachers",tone:"bg-destructive/15 text-destructive border-destructive/40 ring-2 ring-destructive/40"},{s:"Art",t:"Ms. Chebet",tone:"bg-warning/20 text-warning-foreground border-warning/40"}],
  [{s:"Lunch",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Lunch",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Lunch",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Lunch",t:"",tone:"bg-muted text-muted-foreground border-border"},{s:"Lunch",t:"",tone:"bg-muted text-muted-foreground border-border"}],
  [{s:"Art",t:"Ms. Chebet",tone:"bg-warning/20 text-warning-foreground border-warning/40"},{s:"Science",t:"Mr. Owino",tone:"bg-success/15 text-success border-success/30"},{s:"Social",t:"Ms. Njeri",tone:"bg-primary/15 text-primary border-primary/30"},{s:"English",t:"Ms. Atieno",tone:"bg-primary/15 text-primary border-primary/30"},{s:"CRE",t:"Mr. Mwangi",tone:"bg-info/15 text-info border-info/30"}],
  [null,{s:"Library",t:"",tone:"bg-muted text-muted-foreground border-border"},null,{s:"Clubs",t:"",tone:"bg-muted text-muted-foreground border-border"},null],
  [{s:"Games",t:"",tone:"bg-success/15 text-success border-success/30"},{s:"Games",t:"",tone:"bg-success/15 text-success border-success/30"},{s:"Games",t:"",tone:"bg-success/15 text-success border-success/30"},{s:"Games",t:"",tone:"bg-success/15 text-success border-success/30"},{s:"Games",t:"",tone:"bg-success/15 text-success border-success/30"}],
];

function Timetable() {
  return (
    <>
      <PageHeader eyebrow="Schedule" title="Timetable · Grade 5 East" description="Term 2 · 2026 · Drag to reschedule"
        actions={
          <>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-card text-sm hover:bg-muted">Print</button>
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md bg-primary text-primary-foreground text-sm"><Plus className="h-4 w-4" />Add period</button>
          </>
        }
      />
      <PageBody>
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3.5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-destructive/15 text-destructive grid place-items-center"><AlertTriangle className="h-4 w-4" /></div>
          <div className="flex-1 text-sm">
            <span className="font-medium">1 conflict detected</span> · Mr. Kimani is double-booked on Thursday 11:40 (Grade 5 East & Grade 4 West)
          </div>
          <button className="text-xs px-3 py-1.5 rounded-md bg-destructive text-destructive-foreground font-medium">Resolve</button>
        </div>

        <SectionCard title="Weekly view" padded={false}>
          <div className="overflow-x-auto">
            <div className="min-w-[760px] p-3">
              <div className="grid grid-cols-[60px_repeat(5,1fr)] gap-1.5">
                <div />
                {days.map((d) => <div key={d} className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground py-2">{d}</div>)}
                {periods.map((p, pi) => (
                  <Fragment key={`row-${pi}`}>
                    <div className="text-[10px] tabular-nums text-muted-foreground text-right pr-2 py-2">{p}</div>
                    {days.map((_d, di) => {
                      const slot = grid[pi][di];
                      return (
                        <div key={`${pi}-${di}`} className={cn("min-h-[58px] rounded-md border p-1.5", slot ? slot.tone : "border-dashed border-border bg-surface/40 hover:bg-surface")}>
                          {slot && (
                            <>
                              <div className="text-[12px] font-semibold leading-tight">{slot.s}</div>
                              {slot.t && <div className="text-[10px] opacity-80 mt-0.5">{slot.t}</div>}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-muted-foreground">Subjects:</span>
          <StatusBadge tone="info" dot={false}>Math · Science</StatusBadge>
          <StatusBadge tone="primary" dot={false}>Languages · Social</StatusBadge>
          <StatusBadge tone="success" dot={false}>PE · Music</StatusBadge>
          <StatusBadge tone="warning" dot={false}>Arts · Kiswahili</StatusBadge>
          <StatusBadge tone="danger" dot={false}>Conflict</StatusBadge>
        </div>
      </PageBody>
    </>
  );
}
