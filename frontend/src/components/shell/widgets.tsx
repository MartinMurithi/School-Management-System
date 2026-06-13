import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "flat";
  icon?: LucideIcon;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card hover:shadow-elevated transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
        {Icon && (
          <div className="h-8 w-8 rounded-md bg-primary-soft text-primary grid place-items-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-2 font-display text-3xl font-semibold tracking-tight tabular-nums">{value}</div>
      <div className="mt-2 flex items-center gap-2 text-xs">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium rounded px-1.5 py-0.5",
              trend === "up" && "text-success bg-success/10",
              trend === "down" && "text-destructive bg-destructive/10",
              trend === "flat" && "text-muted-foreground bg-muted"
            )}
          >
            {trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
            {delta}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

type BadgeTone = "success" | "warning" | "danger" | "info" | "neutral" | "primary";
export function StatusBadge({ tone = "neutral", children, dot = true }: { tone?: BadgeTone; children: React.ReactNode; dot?: boolean }) {
  const map: Record<BadgeTone, string> = {
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    danger: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
    primary: "bg-primary-soft text-primary",
    neutral: "bg-muted text-muted-foreground",
  };
  const dotMap: Record<BadgeTone, string> = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
    info: "bg-info",
    primary: "bg-primary",
    neutral: "bg-muted-foreground",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium", map[tone])}>
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotMap[tone])} />}
      {children}
    </span>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  padded = true,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("rounded-xl border border-border bg-card shadow-card", className)}>
      {(title || action) && (
        <header className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
          <div>
            {title && <h3 className="font-display font-semibold tracking-tight">{title}</h3>}
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {action}
        </header>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

export function MiniBars({ data, color = "var(--color-primary)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((v, i) => (
        <div key={i} className="flex-1 rounded-sm" style={{ height: `${(v / max) * 100}%`, background: color, opacity: 0.25 + (v / max) * 0.75 }} />
      ))}
    </div>
  );
}

export function Sparkline({ data, color = "var(--color-primary)" }: { data: number[]; color?: string }) {
  const w = 200;
  const h = 60;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((v, i) => `${i * step},${h - ((v - min) / range) * h}`).join(" ");
  const area = `0,${h} ${points} ${w},${h}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16">
      <polygon points={area} fill={color} opacity="0.1" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProgressBar({ value, tone = "primary" }: { value: number; tone?: "primary" | "success" | "warning" | "danger" }) {
  const map = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" };
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full transition-all", map[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
