import { Link, useRouterState } from "@tanstack/react-router";
import { Children, createContext, useContext, useRef, type MutableRefObject, type ReactNode } from "react";
import { Bell, Search, ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavSection = {
  label: string;
  items: { to: string; label: string; icon: LucideIcon; badge?: string }[];
};

type Props = {
  brand: { name: string; tag: string; accent: string };
  sections: NavSection[];
  currentRoleSwitcher?: ReactNode;
  children: ReactNode;
  searchPlaceholder?: string;
};

const PageActionContext = createContext<MutableRefObject<ReactNode | null> | null>(null);

const breadcrumbLabels: Record<string, string> = {
  admin: "Super Admin",
  administration: "Administration",
  school: "School",
  analytics: "Platform analytics",
  announcements: "Announcements",
  billing: "Billing & MRR",
  cbc: "CBC",
  dashboard: "Dashboard",
  defaulters: "Defaulters",
  exams: "Exams",
  finance: "Finance",
  governance: "Governance",
  invoices: "Invoices",
  mpesa: "M-PESA",
  nemis: "NEMIS",
  onboarding: "Onboarding",
  payments: "Payments",
  plans: "Plans",
  reports: "Reports",
  schools: "Schools",
  security: "Security & audit",
  settings: "Settings",
  staff: "Staff",
  students: "Students",
  subscriptions: "Subscriptions",
  support: "Support center",
  timetable: "Timetable",
  "academic-years": "Academic years",
  "classes-streams": "Classes & streams",
  subjects: "Subjects",
  departments: "Departments",
  campuses: "Campuses",
  promotions: "Promotions",
  "roles-permissions": "Roles & permissions",
  admissions: "Admissions",
  guardians: "Guardians",
  transfers: "Transfers",
  "subject-allocation": "Subject allocation",
  workload: "Workload analytics",
};

function formatBreadcrumbSegment(segment: string) {
  return breadcrumbLabels[segment] ?? decodeURIComponent(segment).replace(/[-_]+/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getPathBreadcrumbs(pathname: string) {
  const segments = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  return segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return {
      href,
      label: formatBreadcrumbSegment(segment),
      isCurrent: index === segments.length - 1,
    };
  });
}

export function AppShell({ brand, sections, children, searchPlaceholder, currentRoleSwitcher }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const pageActionsRef = useRef<ReactNode | null>(null);

  return (
    <PageActionContext.Provider value={pageActionsRef}>
      <div className="flex min-h-dvh w-full bg-surface">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar sticky top-0 h-dvh">
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border">
          <div className={cn("h-9 w-9 rounded-lg grid place-items-center text-primary-foreground font-display font-semibold", brand.accent)}>
            {brand.name[0]}
          </div>
          <div className="leading-tight">
            <div className="font-display font-semibold text-sidebar-foreground">{brand.name}</div>
            <div className="text-[11px] text-sidebar-muted uppercase tracking-wider">{brand.tag}</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.label}>
              <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted">
                {section.label}
              </div>
              <ul className="space-y-0.5">
                {section.items.map((item) => {
                  const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                          active
                            ? "bg-sidebar-accent text-accent-foreground font-medium"
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-sidebar-muted group-hover:text-sidebar-foreground")} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-primary-soft text-primary">{item.badge}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          {currentRoleSwitcher}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 h-16 px-4 lg:px-6 border-b border-border bg-background/85 backdrop-blur">
          <div className="lg:hidden flex items-center gap-2">
            <div className={cn("h-8 w-8 rounded-md grid place-items-center text-primary-foreground font-display font-semibold text-sm", brand.accent)}>
              {brand.name[0]}
            </div>
            <span className="font-display font-semibold">{brand.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-2 max-w-md flex-1 rounded-md border border-border bg-surface/80 px-3 h-9">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder={searchPlaceholder ?? "Search…"}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="hidden sm:inline text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
          <div className="flex-1 md:hidden" />
          <button className="relative h-9 w-9 grid place-items-center rounded-md hover:bg-muted" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
          </button>
          <button className="flex items-center gap-2 h-9 px-2 rounded-md hover:bg-muted">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-info text-primary-foreground grid place-items-center text-xs font-semibold">JM</div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-sm font-medium">Jane Mwangi</div>
              <div className="text-[11px] text-muted-foreground">Administrator</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </header>
        <nav aria-label="Breadcrumb" className="border-b border-border bg-background px-4 py-2 lg:px-6">
          <div className="flex min-w-0 items-center gap-1 overflow-hidden text-[11px] font-medium text-muted-foreground">
            {getPathBreadcrumbs(pathname).map((crumb, index) => (
              <span key={crumb.href} className="flex min-w-0 items-center gap-1">
                {index > 0 && <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/60" />}
                {crumb.isCurrent ? (
                  <span className="truncate text-foreground">{crumb.label}</span>
                ) : (
                  <a className="truncate transition hover:text-primary" href={crumb.href}>
                    {crumb.label}
                  </a>
                )}
              </span>
            ))}
          </div>
        </nav>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
    </PageActionContext.Provider>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  const pageActionsRef = useContext(PageActionContext);
  if (pageActionsRef) pageActionsRef.current = actions ?? null;

  return (
    <section className="relative overflow-hidden border-b border-border bg-background px-4 py-3 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,var(--color-background)_0%,var(--color-surface)_62%,var(--color-primary-soft)_100%)] opacity-55" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25 [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
      <div className="relative max-w-6xl">
        <div className="rounded-xl border border-border/75 bg-card/82 px-4 py-3 shadow-card backdrop-blur md:px-5">
          <div className="min-w-0 space-y-1.5">
            <h1 className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl md:leading-tight">
              {title}
            </h1>
            {description && <p className="max-w-3xl text-xs leading-5 text-muted-foreground md:text-sm">{description}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageActions({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-2 shadow-card backdrop-blur">
      <div className="flex flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  const pageActionsRef = useContext(PageActionContext);
  const actions = pageActionsRef?.current;
  const bodyChildren = Children.toArray(children);

  if (!actions) {
    return <div className="space-y-6 px-4 py-5 lg:px-8">{children}</div>;
  }

  return (
    <div className="space-y-6 px-4 py-5 lg:px-8">
      {bodyChildren[0]}
      <PageActions>{actions}</PageActions>
      {bodyChildren.slice(1)}
    </div>
  );
}
