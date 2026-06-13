import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell, type NavSection } from "@/components/shell/AppShell";
import { RoleSwitcher } from "@/components/shell/RoleSwitcher";
import {
  BarChart3,
  Building2,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  Megaphone,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin") throw redirect({ to: "/admin/dashboard" });
  },
});

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/admin/analytics", label: "Platform analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Operations",
    items: [
      { to: "/admin/schools", label: "Schools", icon: Building2, badge: "248" },
      { to: "/admin/onboarding", label: "Onboarding", icon: ClipboardList, badge: "17" },
      { to: "/admin/billing", label: "Billing & MRR", icon: CreditCard },
      { to: "/admin/support", label: "Support center", icon: LifeBuoy, badge: "12" },
      { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/governance", label: "Governance", icon: SlidersHorizontal },
      { to: "/admin/security", label: "Security & audit", icon: ShieldCheck, badge: "6" },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function AdminLayout() {
  return (
    <AppShell
      brand={{ name: "Shulesoft", tag: "Super Admin", accent: "bg-primary" }}
      sections={sections}
      searchPlaceholder="Search schools, invoices, tickets…"
      currentRoleSwitcher={<RoleSwitcher current="admin" />}
    >
      <Outlet />
    </AppShell>
  );
}
