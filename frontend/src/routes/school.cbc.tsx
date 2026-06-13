import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { SectionCard } from "@/components/shell/widgets";
import { BookOpen, MessageSquare, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/school/cbc")({ component: CBC });

const levels = [
  { l: "Exceeding Expectation", k: "EE", tone: "bg-success text-success-foreground" },
  { l: "Meeting Expectation", k: "ME", tone: "bg-info text-info-foreground" },
  { l: "Approaching Expectation", k: "AE", tone: "bg-warning text-warning-foreground" },
  { l: "Below Expectation", k: "BE", tone: "bg-destructive text-destructive-foreground" },
];

const learners = [
  { name: "Aisha Mwende", picks: ["EE", "ME", "ME"] },
  { name: "Brian Otieno", picks: ["ME", "AE", "ME"] },
  { name: "Faith Wanjiru", picks: ["EE", "EE", "EE"] },
  { name: "Daniel Kiprop", picks: ["AE", "AE", "BE"] },
  { name: "Esther Achieng", picks: ["ME", "ME", "ME"] },
];

const competencies = [
  "Communication & Collaboration",
  "Critical Thinking & Problem Solving",
  "Creativity & Imagination",
];

function CBC() {
  return (
    <>
      <PageHeader eyebrow="Competency-Based Curriculum" title="CBC Assessment" description="Grade 3 · Environmental Activities · Strand: Social Environment" />
      <PageBody>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <SectionCard title="Performance levels · tap to mark" description="Quick rubric selection per learner">
              <div className="space-y-3">
                {learners.map((l) => (
                  <div key={l.name} className="rounded-lg border border-border bg-surface p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-info text-primary-foreground grid place-items-center text-xs font-semibold">
                          {l.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="font-medium">{l.name}</div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 flex-1 min-w-[280px] max-w-md">
                        {competencies.map((c, i) => (
                          <div key={c}>
                            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 truncate">{c.split(" ")[0]}</div>
                            <div className="flex gap-0.5">
                              {levels.map((lev) => (
                                <button
                                  key={lev.k}
                                  className={cn(
                                    "flex-1 h-8 rounded text-[11px] font-semibold transition-all",
                                    l.picks[i] === lev.k ? lev.tone : "bg-muted text-muted-foreground hover:bg-muted/70"
                                  )}
                                  title={lev.l}
                                >
                                  {lev.k}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-4">
            <SectionCard title="Legend">
              <ul className="space-y-2 text-sm">
                {levels.map((l) => (
                  <li key={l.k} className="flex items-center gap-2">
                    <span className={cn("h-6 w-9 rounded text-[11px] font-semibold grid place-items-center", l.tone)}>{l.k}</span>
                    <span>{l.l}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="Comment bank" description="Tap to insert into report card">
              <div className="space-y-2">
                {[
                  "Demonstrates exemplary leadership and collaboration with peers.",
                  "Shows steady improvement in problem-solving across activities.",
                  "Needs continued support in following multi-step instructions.",
                  "Brings creative ideas to group projects and class discussions.",
                ].map((c) => (
                  <button key={c} className="w-full text-left text-xs rounded-md border border-border bg-surface px-3 py-2 hover:bg-muted">
                    <MessageSquare className="h-3 w-3 inline mr-1.5 text-primary" />{c}
                  </button>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="CBC report preview">
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Aisha Mwende · Grade 3</div>
                <div className="font-display font-semibold text-sm mt-0.5">Environmental Activities</div>
                <div className="mt-3 space-y-1.5 text-xs">
                  {competencies.map((c, i) => (
                    <div key={c} className="flex items-center justify-between">
                      <span className="text-muted-foreground truncate pr-2">{c}</span>
                      <span className={cn("h-5 px-1.5 rounded text-[10px] font-semibold grid place-items-center", levels.find((l) => l.k === ["EE", "ME", "ME"][i])!.tone)}>{["EE", "ME", "ME"][i]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground italic">
                  "Aisha demonstrates exemplary leadership and shows excellent collaboration with peers."
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </PageBody>
    </>
  );
}
