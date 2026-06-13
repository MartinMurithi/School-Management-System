import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell, type NavSection } from "@/components/shell/AppShell";
import { RoleSwitcher } from "@/components/shell/RoleSwitcher";
import {
  LayoutDashboard, Users, GraduationCap, Banknote, Smartphone, ClipboardCheck,
  CalendarDays, FileSpreadsheet, UserSquare2, Settings, BookOpen, SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/school")({
  component: SchoolLayout,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/school") throw redirect({ to: "/school/tenant-configuration" });
  },
});

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { to: "/school/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/school/tenant-configuration", label: "Tenant configuration", icon: SlidersHorizontal },
    ],
  },
  {
    label: "People",
    items: [
      { to: "/school/students", label: "Students (SIS)", icon: Users, badge: "1.2k" },
      { to: "/school/staff", label: "Staff & Teachers", icon: UserSquare2 },
    ],
  },
  {
    label: "Academics",
    items: [
      { to: "/school/exams", label: "Exams & Grading", icon: ClipboardCheck },
      { to: "/school/cbc", label: "CBC Competencies", icon: BookOpen },
      { to: "/school/timetable", label: "Timetable", icon: CalendarDays },
    ],
  },
  {
    label: "Finance",
    items: [
      { to: "/school/finance", label: "Finance & Billing", icon: Banknote },
      { to: "/school/mpesa", label: "M-PESA", icon: Smartphone, badge: "live" },
    ],
  },
  {
    label: "Administration",
    items: [
      { to: "/school/nemis", label: "NEMIS exports", icon: FileSpreadsheet },
      { to: "/school/settings", label: "Settings", icon: Settings },
    ],
  },
];

function SchoolLayout() {
  return (
    <AppShell
      brand={{ name: "Mwangaza", tag: "School ERP", accent: "bg-info" }}
      sections={sections}
      searchPlaceholder="Search students, invoices, classes…"
      currentRoleSwitcher={<RoleSwitcher current="school" />}
    >
      <Outlet />
    </AppShell>
  );
}
