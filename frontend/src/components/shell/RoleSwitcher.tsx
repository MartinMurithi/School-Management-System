import { Link } from "@tanstack/react-router";
import { Building2, ShieldCheck, ArrowLeftRight } from "lucide-react";

export function RoleSwitcher({ current }: { current: "admin" | "school" }) {
  const other = current === "admin" ? "/school" : "/admin";
  const otherLabel = current === "admin" ? "School ERP" : "Super Admin";
  const Icon = current === "admin" ? ShieldCheck : Building2;
  return (
    <Link
      to={other}
      className="flex items-center gap-2.5 rounded-md border border-sidebar-border bg-card/50 px-3 py-2.5 hover:bg-sidebar-accent transition-colors"
    >
      <div className="h-8 w-8 rounded-md bg-primary-soft text-primary grid place-items-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 leading-tight min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-sidebar-muted">Switch portal</div>
        <div className="text-sm font-medium truncate">{otherLabel}</div>
      </div>
      <ArrowLeftRight className="h-3.5 w-3.5 text-sidebar-muted" />
    </Link>
  );
}
