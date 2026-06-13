import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import {
  AdminModalFooter,
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/AdminControls";
import { DetailActionPanel, DetailGrid, DetailHero, DetailTimeline } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Archive,
  ArrowLeft,
  Ban,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Database,
  Eye,
  FileText,
  LifeBuoy,
  Layers3,
  LockKeyhole,
  Mail,
  Megaphone,
  RefreshCcw,
  School,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  type SaaSInvoice,
  type SubscriptionPlan,
  type TenantStatus,
  billingStatusTone,
  initialInvoices,
  initialTickets,
  planMrr,
  schoolPaymentStatus,
  tenantStatusTone,
} from "@/lib/admin-data";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/schools/$schoolId")({ component: SchoolDetail });

const availableModules = ["Students", "Finance", "Exams", "M-PESA", "CBC", "Transport", "HR", "Library"];

function SchoolDetail() {
  const { schoolId } = Route.useParams();
  const {
    schools,
    auditEvents,
    updateSchool,
    changeStatus,
    changePlan,
    setModule,
    recordAudit,
  } = useAdminSchoolStore();
  const school = schools.find((item) => item.id === schoolId);
  const [invoices, setInvoices] = useState<SaaSInvoice[]>(initialInvoices);
  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"edit" | "status" | "plan" | "invoice" | "support" | "announcement" | null>(null);
  const [statusDraft, setStatusDraft] = useState<{ status: TenantStatus; reason: string }>({ status: "Suspended", reason: "" });
  const [planDraft, setPlanDraft] = useState<{ plan: SubscriptionPlan; billingCycle: "Monthly" | "Termly" | "Annual" }>({
    plan: "Starter",
    billingCycle: "Monthly",
  });
  const [invoiceDraft, setInvoiceDraft] = useState({ amount: "", method: "M-PESA" as SaaSInvoice["method"], note: "" });
  const [supportDraft, setSupportDraft] = useState({ title: "", detail: "" });
  const [announcementDraft, setAnnouncementDraft] = useState({ title: "", detail: "" });
  const [editDraft, setEditDraft] = useState({
    name: "",
    county: "",
    owner: "",
    email: "",
    phone: "",
    students: "",
    branches: "",
  });

  const schoolInvoices = useMemo(() => invoices.filter((invoice) => invoice.schoolId === schoolId), [invoices, schoolId]);
  const schoolTickets = useMemo(() => initialTickets.filter((ticket) => ticket.schoolId === schoolId), [schoolId]);
  const schoolAudit = useMemo(() => auditEvents.filter((event) => event.schoolId === schoolId), [auditEvents, schoolId]);

  if (!school) {
    return (
      <>
        <PageHeader title="School not found" description="The tenant record could not be found." />
        <PageBody>
          <Button variant="outline" asChild>
            <Link to="/admin/schools">
              <ArrowLeft className="h-4 w-4" />
              Back to school registry
            </Link>
          </Button>
        </PageBody>
      </>
    );
  }

  const tenant = school;

  function openEdit() {
    setEditDraft({
      name: tenant.name,
      county: tenant.county,
      owner: tenant.owner,
      email: tenant.email,
      phone: tenant.phone,
      students: String(tenant.students),
      branches: String(tenant.branches ?? 1),
    });
    setModal("edit");
  }

  function openStatus(status: TenantStatus) {
    setStatusDraft({ status, reason: "" });
    setModal("status");
  }

  function openPlan() {
    setPlanDraft({ plan: tenant.plan, billingCycle: tenant.billingCycle ?? "Monthly" });
    setModal("plan");
  }

  function submitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSchool(
      tenant.id,
      {
        name: editDraft.name,
        county: editDraft.county,
        owner: editDraft.owner,
        email: editDraft.email,
        phone: editDraft.phone,
        students: Number(editDraft.students) || 0,
        branches: Number(editDraft.branches) || 1,
      },
      "Tenant details updated",
      "Updated school profile, contact, and registry metadata.",
    );
    setNotice("School profile updated and audit log recorded.");
    setModal(null);
  }

  function submitStatus(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changeStatus(tenant, statusDraft.status, statusDraft.reason || `Changed tenant status to ${statusDraft.status}.`);
    setNotice(`Tenant status changed to ${statusDraft.status}. The action was recorded in the audit trail.`);
    setModal(null);
  }

  function submitPlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    changePlan(tenant, planDraft.plan, planDraft.billingCycle);
    setNotice(`Subscription changed to ${planDraft.plan}. Billing and MRR controls updated.`);
    setModal(null);
  }

  function submitInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(invoiceDraft.amount) || planMrr(tenant.plan);
    const invoice: SaaSInvoice = {
      id: `INV-2026-${String(invoices.length + 421).padStart(4, "0")}`,
      schoolId: tenant.id,
      school: tenant.name,
      cycle: tenant.billingCycle ?? "Monthly",
      method: invoiceDraft.method,
      amount,
      status: "Pending",
      grace: "14d left",
      dueDate: "Jun 06, 2026",
    };
    setInvoices((current) => [invoice, ...current]);
    recordAudit(tenant.id, "Invoice generated", `Generated ${invoice.id} for KES ${amount.toLocaleString()}. ${invoiceDraft.note}`);
    updateSchool(tenant.id, { paymentStatus: "Pending" }, "Billing status updated", "New platform invoice is pending payment.");
    setNotice(`${invoice.id} generated and attached to this tenant.`);
    setInvoiceDraft({ amount: "", method: "M-PESA", note: "" });
    setModal(null);
  }

  function recordManualPayment(invoice: SaaSInvoice) {
    setInvoices((current) => current.map((item) => (item.id === invoice.id ? { ...item, status: "Paid", grace: "-" } : item)));
    updateSchool(tenant.id, { paymentStatus: "Paid" }, "Manual payment recorded", `Marked ${invoice.id} as paid.`);
    setNotice(`${invoice.id} marked as paid. Payment status updated.`);
  }

  function completeOnboardingStep(step: string, progress: number) {
    updateSchool(
      tenant.id,
      {
        onboarding: Math.max(tenant.onboarding, progress),
        onboardingStage: progress >= 100 ? "Live" : "Data import",
        status: progress >= 100 && tenant.status === "Trial" ? "Active" : tenant.status,
      },
      "Onboarding advanced",
      `Completed onboarding step: ${step}.`,
    );
    setNotice(`Onboarding advanced: ${step}.`);
  }

  function extendTrial() {
    updateSchool(tenant.id, { status: "Trial", trialEnds: "21 days", paymentStatus: "Draft" }, "Trial extended", "Extended trial by 21 days.");
    setNotice("Trial extended by 21 days and audit log recorded.");
  }

  function resetAdminInvite() {
    recordAudit(tenant.id, "Admin invite reset", `New admin invite prepared for ${tenant.owner} (${tenant.email}).`);
    setNotice("Admin invite reset and recorded in the audit trail.");
  }

  function verifyBoundary() {
    updateSchool(tenant.id, { isolation: "Verified" }, "Data boundary verified", "Confirmed tenant-scoped data, files, roles, and support boundary.");
    setNotice("Tenant data boundary verified.");
  }

  function submitSupport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    recordAudit(tenant.id, "Support ticket opened", `${supportDraft.title}: ${supportDraft.detail}`);
    setSupportDraft({ title: "", detail: "" });
    setNotice("Support ticket simulated and audit log recorded.");
    setModal(null);
  }

  function submitAnnouncement(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    recordAudit(tenant.id, "Announcement sent", `${announcementDraft.title}: ${announcementDraft.detail}`);
    setAnnouncementDraft({ title: "", detail: "" });
    setNotice("Tenant announcement recorded and queued for delivery.");
    setModal(null);
  }

  const paymentStatus = schoolPaymentStatus(tenant);

  return (
    <>
      <PageHeader
        title={tenant.name}
        description="Tenant control center for school identity, billing, onboarding, modules, support, suspension, and audit history."
      />
      <PageBody>
        {notice && (
          <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary">
            {notice}
          </div>
        )}

        <DetailHero
          eyebrow="Tenant workspace"
          title={tenant.name}
          description={`${tenant.tenancyName ?? tenant.owner} - ${tenant.county}${tenant.subCounty ? ` / ${tenant.subCounty}` : ""} - ${tenant.type ?? "School"} - ${tenant.curriculum} - ${tenant.subdomain}`}
          icon={<School className="h-6 w-6" />}
          badges={
            <>
              <StatusBadge tone={tenantStatusTone(tenant.status)}>{tenant.status}</StatusBadge>
              <StatusBadge tone={billingStatusTone(paymentStatus)}>{paymentStatus}</StatusBadge>
              <StatusBadge tone={tenant.isolation === "Verified" ? "success" : "warning"}>{tenant.isolation}</StatusBadge>
              <StatusBadge tone="info">{tenant.plan}</StatusBadge>
            </>
          }
          actions={
            <>
              <Button variant="outline" onClick={openEdit} className="gap-1.5">
                <Settings className="h-4 w-4" />
                Edit school
              </Button>
              <Button variant="outline" onClick={verifyBoundary} className="gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Verify boundary
              </Button>
            </>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Students" value={tenant.students.toLocaleString()} icon={Users} />
          <MetricCard label="Active users" value={tenant.users.toLocaleString()} icon={Users} />
          <MetricCard label="MRR" value={`KES ${tenant.mrr.toLocaleString()}`} icon={CreditCard} />
          <MetricCard label="Onboarding" value={`${tenant.onboarding}%`} hint={tenant.onboardingStage ?? "Setup wizard"} icon={SlidersHorizontal} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <SectionCard title="School profile" description="Platform-level registry details for this tenant.">
            <DetailGrid
              items={[
                ["Tenant ID", tenant.id],
                ["Name of the Tenancy", tenant.tenancyName ?? tenant.owner],
                ["Registration Number", tenant.registrationNumber ?? "Pending"],
                ["Ministry of Education Reg Number", tenant.ministryRegNumber ?? "Pending"],
                ["Contact person", tenant.owner],
                ["Email", tenant.email],
                ["Phone", tenant.phone],
                ["County", tenant.county],
                ["Sub county", tenant.subCounty ?? "Pending"],
                ["Ownership type", tenant.ownershipType ?? "Private"],
                ["Branch", tenant.branchLabel ?? "Main school"],
                ["School Logo", tenant.logoName ?? "Pending"],
                ["School Motto", tenant.motto ?? "Pending"],
                ["Nemis code", tenant.nemisCode ?? "Pending"],
                ["Mode", tenant.mode ?? "Pending"],
                ["Branches", tenant.branches ?? 1],
                ["Support owner", tenant.supportOwner ?? "Unassigned"],
                ["Last activity", tenant.lastActivity ?? "No activity"],
              ]}
            />
          </SectionCard>

          <SectionCard title="Tenant state">
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span>Onboarding progress</span>
                  <span className="tabular-nums text-muted-foreground">{tenant.onboarding}%</span>
                </div>
                <ProgressBar value={tenant.onboarding} tone={tenant.onboarding === 100 ? "success" : "primary"} />
              </div>
              <DetailTimeline
                items={[
                  { title: "Tenant created", detail: "School registry and default platform settings are available.", tone: "success" },
                  { title: tenant.onboardingStage ?? "Setup wizard", detail: "Academic setup, fee structure, and data import are tracked here.", tone: "info" },
                  { title: tenant.status, detail: "Status controls access without destroying school data.", tone: tenant.status === "Suspended" ? "danger" : "warning" },
                ]}
              />
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <SectionCard title="Configured school profile" description="Details completed by the tenant during tenant configuration.">
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="text-xs text-muted-foreground">School Vision</div>
                <div className="mt-1 leading-6">{tenant.vision ?? "Pending"}</div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="text-xs text-muted-foreground">School Mission</div>
                <div className="mt-1 leading-6">{tenant.mission ?? "Pending"}</div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                <span>Configuration status</span>
                <StatusBadge tone={tenant.configured ? "success" : "warning"}>{tenant.configured ? "Configured" : "Pending"}</StatusBadge>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Academic structure" description="Curriculum, classes, streams, subjects, and departments." className="lg:col-span-2">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Layers3 className="h-4 w-4 text-primary" />
                  Classes and streams
                </div>
                <div className="mt-3 space-y-2">
                  {(tenant.configuredClasses ?? []).map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 rounded-md bg-card px-3 py-2 text-sm">
                      <span>{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.streams.join(", ")}</span>
                    </div>
                  ))}
                  {(tenant.configuredClasses ?? []).length === 0 && <p className="text-sm text-muted-foreground">No classes configured.</p>}
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Subjects and departments
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(tenant.configuredSubjects ?? []).map((subject) => <StatusBadge key={subject} tone="neutral">{subject}</StatusBadge>)}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(tenant.configuredDepartments ?? []).map((department) => <StatusBadge key={department} tone="info">{department}</StatusBadge>)}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Administrative structure" description="Positions in order of seniority.">
            <div className="space-y-2">
              {(tenant.administrativeStructure ?? []).map((item) => (
                <div key={`${item.seniority}-${item.position}`} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
                  <div>
                    <div className="font-medium">{item.seniority}. {item.position}</div>
                    <div className="text-xs text-muted-foreground">{item.staffName}</div>
                  </div>
                  <Users className="h-4 w-4 text-primary" />
                </div>
              ))}
              {(tenant.administrativeStructure ?? []).length === 0 && <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">No administrative structure configured.</div>}
            </div>
          </SectionCard>

          <SectionCard title="Academic calendar" description="Academic years, terms, and configured events.">
            <div className="space-y-3">
              {(tenant.academicYears ?? []).map((year) => (
                <div key={year.id} className="rounded-lg border border-border bg-surface p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{year.name}</div>
                      <div className="text-xs text-muted-foreground">{year.startDate} to {year.endDate}</div>
                    </div>
                    <StatusBadge tone={year.status === "Open" ? "success" : "neutral"}>{year.status}</StatusBadge>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {year.terms.map((term) => (
                      <div key={term.id} className="rounded-md border border-border bg-card p-2 text-xs">
                        <div className="flex items-center gap-1.5 font-medium">
                          <CalendarDays className="h-3.5 w-3.5 text-primary" />
                          {term.name}
                        </div>
                        <div className="mt-1 text-muted-foreground">{term.startDate || "Start pending"} - {term.endDate || "End pending"}</div>
                        <div className="mt-2 text-muted-foreground">{term.events.length} events</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(tenant.academicYears ?? []).length === 0 && <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">No academic calendar configured.</div>}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <DetailActionPanel title="Tenant lifecycle" description="Safe status control with reason and audit trail.">
            {tenant.status === "Suspended" ? (
              <Button onClick={() => openStatus("Active")} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Reactivate
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => openStatus("Suspended")} className="gap-1.5">
                <Ban className="h-4 w-4" />
                Suspend
              </Button>
            )}
            <Button variant="outline" onClick={extendTrial} className="gap-1.5">
              <RefreshCcw className="h-4 w-4" />
              Extend trial
            </Button>
            <Button variant="outline" onClick={() => openStatus("Archived")} className="gap-1.5">
              <Archive className="h-4 w-4" />
              Archive
            </Button>
          </DetailActionPanel>

          <DetailActionPanel title="Billing controls" description="Manage the subscription and payment state for this tenant.">
            <Button variant="outline" onClick={openPlan} className="gap-1.5">
              <CreditCard className="h-4 w-4" />
              Change plan
            </Button>
            <Button onClick={() => setModal("invoice")} className="gap-1.5">
              <FileText className="h-4 w-4" />
              Generate invoice
            </Button>
          </DetailActionPanel>

          <DetailActionPanel title="Support and communication" description="Operational actions for customer success.">
            <Button variant="outline" onClick={() => setModal("support")} className="gap-1.5">
              <LifeBuoy className="h-4 w-4" />
              Open ticket
            </Button>
            <Button variant="outline" onClick={() => setModal("announcement")} className="gap-1.5">
              <Megaphone className="h-4 w-4" />
              Announce
            </Button>
            <Button variant="outline" onClick={resetAdminInvite} className="gap-1.5">
              <Mail className="h-4 w-4" />
              Reset invite
            </Button>
          </DetailActionPanel>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Subscription and billing" description="Platform invoices and payment controls." padded={false}>
            <Table>
              <TableHeader>
                <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                  <TableHead className="px-5 py-2.5">Invoice</TableHead>
                  <TableHead className="px-5 py-2.5 text-right">Amount</TableHead>
                  <TableHead className="px-5 py-2.5">Status</TableHead>
                  <TableHead className="px-5 py-2.5 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schoolInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-border/60">
                    <TableCell className="px-5 py-3">
                      <div className="font-mono text-xs">{invoice.id}</div>
                      <div className="text-xs text-muted-foreground">{invoice.cycle} - {invoice.method} - due {invoice.dueDate}</div>
                    </TableCell>
                    <TableCell className="px-5 py-3 text-right tabular-nums">KES {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="px-5 py-3">
                      <StatusBadge tone={billingStatusTone(invoice.status)}>{invoice.status}</StatusBadge>
                    </TableCell>
                    <TableCell className="px-5 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to="/admin/billing/invoices/$invoiceId" params={{ invoiceId: invoice.id }} aria-label={`View ${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {invoice.status !== "Paid" && (
                          <Button variant="outline" size="sm" onClick={() => recordManualPayment(invoice)}>
                            Mark paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {schoolInvoices.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="px-5 py-8 text-center text-muted-foreground">
                      No invoices yet. Generate the first platform invoice from the billing controls.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </SectionCard>

          <SectionCard title="Onboarding checklist" description="Move the tenant from setup to activation.">
            <div className="space-y-3">
              {[
                ["School registration", 20],
                ["Tenant creation", 40],
                ["Academic setup wizard", 60],
                ["Student and staff import", 85],
                ["Activation", 100],
              ].map(([step, progress]) => {
                const done = tenant.onboarding >= Number(progress);
                return (
                  <div key={step} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`h-4 w-4 ${done ? "text-success" : "text-muted-foreground"}`} />
                      {step}
                    </div>
                    <Button variant={done ? "ghost" : "outline"} size="sm" disabled={done} onClick={() => completeOnboardingStep(String(step), Number(progress))}>
                      {done ? "Done" : "Complete"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Modules enabled" description="Per-tenant feature flags and module access.">
            <div className="grid gap-3 sm:grid-cols-2">
              {availableModules.map((moduleName) => {
                const enabled = (tenant.modules ?? []).includes(moduleName);
                return (
                  <button
                    key={moduleName}
                    onClick={() => setModule(school, moduleName, !enabled)}
                    className={`rounded-xl border p-4 text-left transition ${
                      enabled ? "border-primary/30 bg-primary-soft/70" : "border-border bg-surface hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{moduleName}</span>
                      <StatusBadge tone={enabled ? "success" : "neutral"}>{enabled ? "Enabled" : "Off"}</StatusBadge>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {enabled ? "Available to this school tenant." : "Hidden from school users until enabled."}
                    </p>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Support tickets" description="Tenant support context for platform operators.">
            <div className="space-y-3">
              {schoolTickets.map((ticket) => (
                <div key={ticket.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-xs text-muted-foreground">#{ticket.id} - {ticket.updated} - {ticket.assignee}</div>
                    </div>
                    <StatusBadge tone={ticket.priority === "Urgent" ? "danger" : ticket.priority === "High" ? "warning" : "info"}>{ticket.priority}</StatusBadge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{ticket.messages[0]?.body}</p>
                </div>
              ))}
              {schoolTickets.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No active support tickets.</div>}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Security and audit trail" description="Every sensitive action should leave a clear operational record.">
          <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
            <div className="space-y-3">
              {[
                "Tenant id required on school tables",
                "Files stored under tenant namespace",
                "School roles cannot access platform routes",
                "Support access requires reason and timestamp",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm">
                  <Database className="h-4 w-4 text-primary" />
                  {item}
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {schoolAudit.map((event) => (
                <div key={event.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">{event.action}</div>
                    <div className="text-xs text-muted-foreground">{event.time}</div>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
                  <div className="mt-2 text-xs text-muted-foreground">Actor: {event.actor}</div>
                </div>
              ))}
              {schoolAudit.length === 0 && <div className="rounded-xl border border-border bg-surface p-5 text-sm text-muted-foreground">No audit events yet.</div>}
            </div>
          </div>
        </SectionCard>
      </PageBody>

      <AdminModal open={modal === "edit"} onOpenChange={() => setModal(null)} title="Edit school details" description="Update registry metadata for this tenant." className="sm:max-w-2xl">
        <form onSubmit={submitEdit}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="School name" required value={editDraft.name} onChange={(event) => setEditDraft({ ...editDraft, name: event.target.value })} />
            <AdminTextField label="County" value={editDraft.county} onChange={(event) => setEditDraft({ ...editDraft, county: event.target.value })} />
            <AdminTextField label="Contact person" required value={editDraft.owner} onChange={(event) => setEditDraft({ ...editDraft, owner: event.target.value })} />
            <AdminTextField label="Email" required type="email" value={editDraft.email} onChange={(event) => setEditDraft({ ...editDraft, email: event.target.value })} />
            <AdminTextField label="Phone" value={editDraft.phone} onChange={(event) => setEditDraft({ ...editDraft, phone: event.target.value })} />
            <AdminTextField label="Students" type="number" min="0" value={editDraft.students} onChange={(event) => setEditDraft({ ...editDraft, students: event.target.value })} />
            <AdminTextField label="Branches" type="number" min="1" value={editDraft.branches} onChange={(event) => setEditDraft({ ...editDraft, branches: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Save changes" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "status"} onOpenChange={() => setModal(null)} title="Change tenant status" description="Status changes preserve data and are written to the audit trail.">
        <form onSubmit={submitStatus}>
          <div className="space-y-3">
            <AdminSelectField label="New status" value={statusDraft.status} onChange={(event) => setStatusDraft({ ...statusDraft, status: event.target.value as TenantStatus })}>
              <option>Active</option>
              <option>Trial</option>
              <option>Suspended</option>
              <option>Expired</option>
              <option>Archived</option>
            </AdminSelectField>
            <AdminTextareaField label="Reason" required value={statusDraft.reason} onChange={(event) => setStatusDraft({ ...statusDraft, reason: event.target.value })} placeholder="Explain why this access change is being made." />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Confirm status change" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "plan"} onOpenChange={() => setModal(null)} title="Change subscription plan" description="Update the SaaS plan and billing cadence for this tenant.">
        <form onSubmit={submitPlan}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminSelectField label="Plan" value={planDraft.plan} onChange={(event) => setPlanDraft({ ...planDraft, plan: event.target.value as SubscriptionPlan })}>
              <option>Starter</option>
              <option>Growth</option>
              <option>Scale</option>
            </AdminSelectField>
            <AdminSelectField label="Billing cycle" value={planDraft.billingCycle} onChange={(event) => setPlanDraft({ ...planDraft, billingCycle: event.target.value as typeof planDraft.billingCycle })}>
              <option>Monthly</option>
              <option>Termly</option>
              <option>Annual</option>
            </AdminSelectField>
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Update subscription" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "invoice"} onOpenChange={() => setModal(null)} title="Generate platform invoice" description="Create a SaaS invoice for this school tenant.">
        <form onSubmit={submitInvoice}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="Amount" type="number" min="0" placeholder={String(planMrr(tenant.plan))} value={invoiceDraft.amount} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, amount: event.target.value })} />
            <AdminSelectField label="Payment method" value={invoiceDraft.method} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, method: event.target.value as SaaSInvoice["method"] })}>
              <option>M-PESA</option>
              <option>Bank</option>
              <option>Card</option>
            </AdminSelectField>
            <AdminTextareaField wrapperClassName="md:col-span-2" label="Invoice note" value={invoiceDraft.note} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, note: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Generate invoice" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "support"} onOpenChange={() => setModal(null)} title="Open support ticket" description="Log a platform support intervention for this tenant.">
        <form onSubmit={submitSupport}>
          <div className="space-y-3">
            <AdminTextField label="Ticket title" required value={supportDraft.title} onChange={(event) => setSupportDraft({ ...supportDraft, title: event.target.value })} />
            <AdminTextareaField label="Support note" required value={supportDraft.detail} onChange={(event) => setSupportDraft({ ...supportDraft, detail: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Open ticket" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "announcement"} onOpenChange={() => setModal(null)} title="Send tenant announcement" description="Queue a tenant-specific operational message.">
        <form onSubmit={submitAnnouncement}>
          <div className="space-y-3">
            <AdminTextField label="Announcement title" required value={announcementDraft.title} onChange={(event) => setAnnouncementDraft({ ...announcementDraft, title: event.target.value })} />
            <AdminTextareaField label="Message" required value={announcementDraft.detail} onChange={(event) => setAnnouncementDraft({ ...announcementDraft, detail: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Queue announcement" />
        </form>
      </AdminModal>
    </>
  );
}
