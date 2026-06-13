import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DetailHeroProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function DetailHero({ eyebrow, title, description, icon, badges, actions, className }: DetailHeroProps) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-border bg-card shadow-card", className)}>
      <div className="relative bg-gradient-to-br from-primary-soft/80 via-card to-info/10 p-6">
        <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-info/10 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="flex min-w-0 items-start gap-4">
            {icon && (
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-card/80 text-primary shadow-card ring-1 ring-border/70">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
              <h2 className="mt-1 break-words font-display text-2xl font-semibold tracking-tight">{title}</h2>
              {description && <p className="mt-1 max-w-3xl break-words text-sm leading-6 text-muted-foreground">{description}</p>}
              {badges && <div className="mt-3 flex flex-wrap gap-2">{badges}</div>}
            </div>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </div>
    </section>
  );
}

type DetailGridProps = {
  items: Array<[string, ReactNode]>;
  columns?: "two" | "three";
};

export function DetailGrid({ items, columns = "two" }: DetailGridProps) {
  return (
    <div className={cn("grid gap-3", columns === "three" ? "md:grid-cols-3" : "md:grid-cols-2")}>
      {items.map(([label, value]) => (
        <div key={label} className="min-w-0 rounded-lg border border-border bg-surface p-4">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 min-w-0 break-words font-medium leading-6">{value}</div>
        </div>
      ))}
    </div>
  );
}

type ActionPanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function DetailActionPanel({ title, description, children }: ActionPanelProps) {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-primary-soft/30 p-4 shadow-card">
      <div className="font-display font-semibold">{title}</div>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

type TimelineProps = {
  items: Array<{ title: string; detail: string; tone?: "success" | "warning" | "danger" | "primary" | "info" }>;
};

const toneClass = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
  primary: "bg-primary",
  info: "bg-info",
};

export function DetailTimeline({ items }: TimelineProps) {
  return (
    <ol className="relative ml-2 space-y-4 border-l-2 border-border">
      {items.map((item) => (
        <li key={item.title} className="ml-4">
          <span className={cn("absolute -left-[7px] h-3 w-3 rounded-full ring-2 ring-card", toneClass[item.tone ?? "primary"])} />
          <div className="text-sm font-medium">{item.title}</div>
          <div className="text-xs text-muted-foreground">{item.detail}</div>
        </li>
      ))}
    </ol>
  );
}
