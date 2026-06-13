import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminModal } from "@/components/admin/AdminModal";
import { AdminModalFooter, AdminSelectField, AdminTextareaField, AdminTextField } from "@/components/admin/AdminControls";
import { DetailActionPanel, DetailGrid, DetailHero } from "@/components/admin/DetailView";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ArrowLeft,
  Ban,
  Building2,
  CheckCircle2,
  FileText,
  KeyRound,
  Mail,
  Plus,
  ReceiptText,
  RotateCcw,
  School,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { type OwnershipType, type TenantBranchSchool, type TenantInvoice } from "@/lib/admin-data";
import { onboardingStatusTone, useAdminOnboardingStore } from "@/lib/admin-onboarding-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/onboarding/$onboardingId")({ component: OnboardingDetail });

function money(value: number) {
  return `KES ${value.toLocaleString()}`;
}

function OnboardingDetail() {
  const { onboardingId } = Route.useParams();
  const {
    accounts,
    auditEvents,
    updateOnboarding,
    addInvoice,
    cancelInvoice,
    recordAudit,
  } = useAdminOnboardingStore();
  const { schools, addSchool, updateSchool, addSchoolsFromTenant } = useAdminSchoolStore();
  const account = accounts.find((item) => item.id === onboardingId);
  const accountAudit = useMemo(() => auditEvents.filter((event) => event.onboardingId === onboardingId), [auditEvents, onboardingId]);

  const [notice, setNotice] = useState("");
  const [modal, setModal] = useState<"edit" | "school" | "deactivate" | "invoice" | "cancelInvoice" | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [editDraft, setEditDraft] = useState({
    tenancyName: "",
    registrationNumber: "",
    ministryRegNumber: "",
    county: "",
    subCounty: "",
    numberOfSchoolsUnderTenancy: "",
    ownershipType: "Private" as OwnershipType,
    primaryContactName: "",
    primaryContactRole: "",
    email: "",
    phone: "",
    alternatePhone: "",
    postalAddress: "",
    physicalAddress: "",
    billingContactName: "",
    billingEmail: "",
    billingPhone: "",
  });
  const [schoolDraft, setSchoolDraft] = useState({ name: "", type: "Primary" as TenantBranchSchool["type"], students: "0", branchLabel: "" });
  const [deactivationReason, setDeactivationReason] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [invoiceDraft, setInvoiceDraft] = useState({
    issueDate: "2026-05-27",
    dueDate: "2026-06-10",
    billTo: "",
    lineItems: "SchoolWise platform subscription and tenant onboarding services",
    amount: "12000",
    tax: "0",
    notes: "",
  });

  if (!account) {
    return (
      <>
        <PageHeader title="Tenant not found" description="The tenant onboarding record could not be found." />
        <PageBody>
          <Button variant="outline" asChild>
            <Link to="/admin/onboarding">
              <ArrowLeft className="h-4 w-4" />
              Back to onboarding
            </Link>
          </Button>
        </PageBody>
      </>
    );
  }

  const tenant = account;
  const tenantName = tenant.tenancyName ?? tenant.school;
  const tenantSchools: TenantBranchSchool[] =
    tenant.schools && tenant.schools.length > 0
      ? tenant.schools
      : [
          {
            id: tenant.id,
            name: tenant.school,
            county: tenant.county ?? "Nairobi",
            subCounty: tenant.subCounty ?? "Pending",
            type: tenant.schoolType ?? "Primary",
            students: tenant.expectedStudents ?? 0,
            branchLabel: "Main school",
            status: tenant.status === "Active" ? "Active" : "Trial",
          },
        ];
  const invoices = tenant.invoices ?? [];
  const activeSchoolsInRegistry = schools.filter((school) => school.tenancyId === tenant.id || tenantSchools.some((item) => item.id === school.id));

  function openEdit() {
    setEditDraft({
      tenancyName: tenantName,
      registrationNumber: tenant.registrationNumber ?? "",
      ministryRegNumber: tenant.ministryRegNumber ?? "",
      county: tenant.county ?? "",
      subCounty: tenant.subCounty ?? "",
      numberOfSchoolsUnderTenancy: String(tenant.numberOfSchoolsUnderTenancy ?? tenantSchools.length),
      ownershipType: tenant.ownershipType ?? "Private",
      primaryContactName: tenant.contactDetails?.primaryContactName ?? tenant.owner,
      primaryContactRole: tenant.contactDetails?.primaryContactRole ?? "Owner",
      email: tenant.contactDetails?.email ?? tenant.email ?? "",
      phone: tenant.contactDetails?.phone ?? tenant.phone ?? "",
      alternatePhone: tenant.contactDetails?.alternatePhone ?? "",
      postalAddress: tenant.contactDetails?.postalAddress ?? "",
      physicalAddress: tenant.contactDetails?.physicalAddress ?? "",
      billingContactName: tenant.contactDetails?.billingContactName ?? "",
      billingEmail: tenant.contactDetails?.billingEmail ?? "",
      billingPhone: tenant.contactDetails?.billingPhone ?? "",
    });
    setModal("edit");
  }

  function submitEdit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateOnboarding(
      tenant.id,
      {
        tenancyName: editDraft.tenancyName,
        school: tenantSchools[0]?.name ?? editDraft.tenancyName,
        registrationNumber: editDraft.registrationNumber,
        ministryRegNumber: editDraft.ministryRegNumber,
        county: editDraft.county,
        subCounty: editDraft.subCounty,
        numberOfSchoolsUnderTenancy: Number(editDraft.numberOfSchoolsUnderTenancy) || tenantSchools.length,
        ownershipType: editDraft.ownershipType,
        owner: editDraft.primaryContactName,
        email: editDraft.email,
        phone: editDraft.phone,
        contactDetails: {
          primaryContactName: editDraft.primaryContactName,
          primaryContactRole: editDraft.primaryContactRole,
          email: editDraft.email,
          phone: editDraft.phone,
          alternatePhone: editDraft.alternatePhone,
          postalAddress: editDraft.postalAddress,
          physicalAddress: editDraft.physicalAddress,
          billingContactName: editDraft.billingContactName,
          billingEmail: editDraft.billingEmail,
          billingPhone: editDraft.billingPhone,
        },
      },
      "Tenant updated",
      "Updated Name of the Tenancy, registration details, location, ownership type, and Contact details ( take detailed contacts).",
    );
    activeSchoolsInRegistry.forEach((school) => {
      updateSchool(
        school.id,
        {
          tenancyName: editDraft.tenancyName,
          registrationNumber: editDraft.registrationNumber,
          ministryRegNumber: editDraft.ministryRegNumber,
          county: editDraft.county,
          subCounty: editDraft.subCounty,
          ownershipType: editDraft.ownershipType,
          owner: editDraft.primaryContactName,
          email: editDraft.email,
          phone: editDraft.phone,
        },
        "Tenant details synced",
        `Synced school record from ${editDraft.tenancyName}.`,
      );
    });
    setNotice("Tenant updated and synced to schools under Tenancy.");
    setModal(null);
  }

  function submitSchool(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = `${tenant.id}-${schoolDraft.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
    const nextSchool: TenantBranchSchool = {
      id,
      name: schoolDraft.name,
      county: tenant.county ?? "Nairobi",
      subCounty: tenant.subCounty ?? "",
      type: schoolDraft.type,
      students: Number(schoolDraft.students) || 0,
      branchLabel: schoolDraft.branchLabel || `Branch ${tenantSchools.length + 1}`,
      status: "Active",
    };
    updateOnboarding(
      tenant.id,
      {
        schools: [...tenantSchools, nextSchool],
        numberOfSchoolsUnderTenancy: tenantSchools.length + 1,
        branches: tenantSchools.length + 1,
      },
      "School under Tenancy created",
      `${nextSchool.name} added under ${tenantName}.`,
    );
    addSchool({
      name: nextSchool.name,
      type: nextSchool.type ?? "Primary",
      county: nextSchool.county,
      curriculum: tenant.curriculum ?? "CBC",
      owner: tenant.contactDetails?.primaryContactName ?? tenant.owner,
      email: tenant.contactDetails?.email ?? tenant.email ?? "",
      phone: tenant.contactDetails?.phone ?? tenant.phone ?? "",
      students: String(nextSchool.students),
      branches: String(tenantSchools.length + 1),
      plan: "Starter",
      billingCycle: "Monthly",
      status: "Active",
      tenancyId: tenant.id,
      tenancyName: tenantName,
      registrationNumber: tenant.registrationNumber,
      ministryRegNumber: tenant.ministryRegNumber,
      subCounty: tenant.subCounty,
      ownershipType: tenant.ownershipType,
      branchLabel: nextSchool.branchLabel,
    });
    setSchoolDraft({ name: "", type: "Primary", students: "0", branchLabel: "" });
    setNotice("School under Tenancy created and listed on the schools side (/admin/schools).");
    setModal(null);
  }

  function activateTenant() {
    updateOnboarding(
      tenant.id,
      {
        status: "Active",
        deactivationReason: undefined,
        schools: tenantSchools.map((school) => ({ ...school, status: "Active" as const })),
      },
      "Activate",
      `${tenantName} activated by Super admin.`,
    );
    if (activeSchoolsInRegistry.length === 0) addSchoolsFromTenant(tenant);
    activeSchoolsInRegistry.forEach((school) => {
      updateSchool(school.id, { status: "Active", isolation: "Verified", users: Math.max(school.users, 1) }, "Tenant activated", `${tenantName} activated by Super admin.`);
    });
    setNotice("Tenant activated.");
  }

  function submitDeactivate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateOnboarding(
      tenant.id,
      {
        status: "Deactivated",
        deactivationReason,
        schools: tenantSchools.map((school) => ({ ...school, status: "Suspended" as const })),
      },
      "Deactivate",
      deactivationReason,
    );
    activeSchoolsInRegistry.forEach((school) => {
      updateSchool(school.id, { status: "Suspended", isolation: "Read-only", users: 0 }, "Tenant deactivated", deactivationReason);
    });
    setNotice("Tenant deactivated with reason recorded.");
    setDeactivationReason("");
    setModal(null);
  }

  function submitInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(invoiceDraft.amount) || 0;
    const tax = Number(invoiceDraft.tax) || 0;
    const invoice = addInvoice(tenant, {
      issueDate: invoiceDraft.issueDate,
      dueDate: invoiceDraft.dueDate,
      billTo: invoiceDraft.billTo || tenantName,
      lineItems: invoiceDraft.lineItems,
      amount,
      tax,
      total: amount + tax,
      notes: invoiceDraft.notes,
    });
    setNotice(`${invoice.invoiceNumber} generated for ${tenantName}.`);
    setInvoiceDraft({ issueDate: "2026-05-27", dueDate: "2026-06-10", billTo: "", lineItems: "SchoolWise platform subscription and tenant onboarding services", amount: "12000", tax: "0", notes: "" });
    setModal(null);
  }

  function openCancelInvoice(invoice: TenantInvoice) {
    setSelectedInvoiceId(invoice.id);
    setCancelReason("");
    setModal("cancelInvoice");
  }

  function submitCancelInvoice(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    cancelInvoice(tenant, selectedInvoiceId, cancelReason);
    setNotice("Invoice cancelled with reason recorded.");
    setModal(null);
  }

  function resendEmail() {
    recordAudit(tenant.id, "Email sent to tenant", `Resent login credentials to ${tenant.contactDetails?.email ?? tenant.email}.`);
    setNotice("Email sent to tenant with login credentials.");
  }

  return (
    <>
      <PageHeader title={tenantName} description="View tenant details and every school under each tenant." />
      <PageBody>
        {notice && <div className="rounded-xl border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-medium text-primary">{notice}</div>}

        <DetailHero
          eyebrow="Onboarding of a tenant"
          title={tenantName}
          description={`${tenant.registrationNumber ?? "Registration Number pending"} - ${tenant.ministryRegNumber ?? "Ministry of Education Reg Number pending"} - ${tenant.county ?? "County pending"} / ${tenant.subCounty ?? "Sub county pending"}`}
          icon={<Building2 className="h-6 w-6" />}
          badges={
            <>
              <StatusBadge tone={onboardingStatusTone(tenant.status)}>{tenant.status}</StatusBadge>
              <StatusBadge tone="info">{tenant.ownershipType ?? "Private"}</StatusBadge>
              <StatusBadge tone="primary">{tenantSchools.length} schools under Tenancy</StatusBadge>
              {tenant.documents?.some((document) => document.status === "Uploaded") && <StatusBadge tone="success">MOU uploaded</StatusBadge>}
            </>
          }
          actions={
            <>
              <Button variant="outline" onClick={openEdit} className="gap-1.5">
                <Settings className="h-4 w-4" />
                Edit tenant
              </Button>
              {tenant.status === "Deactivated" ? (
                <Button onClick={activateTenant} className="gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Activate
                </Button>
              ) : (
                <Button variant="destructive" onClick={() => setModal("deactivate")} className="gap-1.5">
                  <Ban className="h-4 w-4" />
                  Deactivate
                </Button>
              )}
            </>
          }
        />

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Number of schools under Tenancy" value={String(tenantSchools.length)} icon={School} />
          <MetricCard label="Schools listed" value={String(activeSchoolsInRegistry.length)} hint="/admin/schools" icon={ShieldCheck} />
          <MetricCard label="Invoices" value={String(invoices.length)} icon={ReceiptText} />
          <MetricCard label="Account created" value={tenant.credentials ? "Yes" : "No" } icon={KeyRound} />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
          <SectionCard title="Tenancy profile">
            <DetailGrid
              items={[
                ["Name of the Tenancy", tenantName],
                ["Registration Number", tenant.registrationNumber ?? "Pending"],
                ["Ministry of Education Reg Number", tenant.ministryRegNumber ?? "Pending"],
                ["County", tenant.county ?? "Pending"],
                ["Sub county", tenant.subCounty ?? "Pending"],
                ["Ownership type", tenant.ownershipType ?? "Private"],
              ]}
            />
          </SectionCard>

          <SectionCard title="Contact details ( take detailed contacts)">
            <DetailGrid
              columns="two"
              items={[
                ["Primary contact", `${tenant.contactDetails?.primaryContactName ?? tenant.owner} (${tenant.contactDetails?.primaryContactRole ?? "Owner"})`],
                ["Email", tenant.contactDetails?.email ?? tenant.email ?? "Pending"],
                ["Phone", tenant.contactDetails?.phone ?? tenant.phone ?? "Pending"],
                ["Alternate phone", tenant.contactDetails?.alternatePhone ?? "Pending"],
                ["Billing contact", tenant.contactDetails?.billingContactName ?? "Pending"],
                ["Billing email", tenant.contactDetails?.billingEmail ?? "Pending"],
              ]}
            />
          </SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <DetailActionPanel title="CRUD" description="Create, read, update, activate, and deactivate tenant records. Delete is replaced with activate and deactivate.">
            <Button variant="outline" onClick={openEdit} className="gap-1.5">
              <Settings className="h-4 w-4" />
              Update
            </Button>
            <Button variant="outline" onClick={() => setModal("school")} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Create school under Tenancy
            </Button>
            {tenant.status === "Deactivated" ? (
              <Button onClick={activateTenant} className="gap-1.5">
                <RotateCcw className="h-4 w-4" />
                Activate
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => setModal("deactivate")} className="gap-1.5">
                <Ban className="h-4 w-4" />
                Deactivate
              </Button>
            )}
          </DetailActionPanel>

          <DetailActionPanel title="Account and email" description="Login credentials are displayed to the super admin and sent to the tenant.">
            <Button variant="outline" onClick={resendEmail} className="gap-1.5">
              <Mail className="h-4 w-4" />
              Email sent to tenant
            </Button>
          </DetailActionPanel>

          <DetailActionPanel title="Invoice controls" description="Super admin can generate or cancel an invoice for a tenant.">
            <Button onClick={() => setModal("invoice")} className="gap-1.5">
              <FileText className="h-4 w-4" />
              Add invoice
            </Button>
          </DetailActionPanel>
        </div>

        <SectionCard title="Every school under each tenant" description="These schools are also listed on the schools side (/admin/schools)." padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">School</TableHead>
                <TableHead className="px-5 py-2.5">Branch</TableHead>
                <TableHead className="px-5 py-2.5">County</TableHead>
                <TableHead className="px-5 py-2.5">Sub county</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Students</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantSchools.map((school) => (
                <TableRow key={school.id} className="border-border/60">
                  <TableCell className="px-5 py-3">
                    <Link to="/admin/schools/$schoolId" params={{ schoolId: school.id }} className="font-medium hover:text-primary">
                      {school.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{school.type ?? "School"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3">{school.branchLabel}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{school.county}</TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{school.subCounty}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">{school.students.toLocaleString()}</TableCell>
                  <TableCell className="px-5 py-3"><StatusBadge tone={school.status === "Active" ? "success" : "warning"}>{school.status}</StatusBadge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Login credentials of the created account">
            <DetailGrid
              items={[
                ["Login URL", tenant.credentials?.loginUrl ?? "Pending"],
                ["Username", tenant.credentials?.username ?? "Pending"],
                ["Temporary password", tenant.credentials?.temporaryPassword ?? "Pending"],
                ["Email sent to tenant", tenant.emailRecord?.sentAt ?? "Pending"],
              ]}
            />
          </SectionCard>

          <SectionCard title="Documents upload (MOU between the system and the Tenancy)">
            <div className="space-y-3">
              {(tenant.documents ?? []).map((document) => (
                <div key={document.name} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface p-3 text-sm">
                  <div>
                    <div className="font-medium">{document.name}</div>
                    <div className="text-xs text-muted-foreground">{document.type}</div>
                  </div>
                  <StatusBadge tone={document.status === "Uploaded" ? "success" : "warning"}>{document.status}</StatusBadge>
                </div>
              ))}
              {(tenant.documents ?? []).length === 0 && <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">No MOU uploaded.</div>}
            </div>
          </SectionCard>
        </div>

        <SectionCard title="Tenant invoices" description="Use Add invoice to create a formal invoice, or Cancel invoice with a reason." padded={false}>
          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">Invoice</TableHead>
                <TableHead className="px-5 py-2.5">Due date</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Total</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="px-5 py-2.5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-border/60">
                  <TableCell className="px-5 py-3">
                    <div className="font-mono text-xs">{invoice.invoiceNumber}</div>
                    <div className="text-xs text-muted-foreground">{invoice.lineItems}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">{invoice.dueDate}</TableCell>
                  <TableCell className="px-5 py-3 text-right tabular-nums">{money(invoice.total)}</TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={invoice.status === "Cancelled" ? "danger" : invoice.status === "Paid" ? "success" : "warning"}>{invoice.status}</StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-right">
                    {invoice.status !== "Cancelled" && (
                      <Button variant="outline" size="sm" onClick={() => openCancelInvoice(invoice)}>
                        Cancel invoice
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {invoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No invoices yet. Use Add invoice to create a formal invoice for this tenant.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SectionCard>

        <SectionCard title="Email to tenant">
          <pre className="whitespace-pre-wrap rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
            {tenant.emailRecord?.body ?? "No email has been sent yet."}
          </pre>
        </SectionCard>

        <SectionCard title="Audit trail">
          <div className="space-y-3">
            {accountAudit.map((event) => (
              <div key={event.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">{event.action}</div>
                  <div className="text-xs text-muted-foreground">{event.time}</div>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.detail}</p>
                <div className="mt-2 text-xs text-muted-foreground">Actor: {event.actor}</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageBody>

      <AdminModal open={modal === "edit"} onOpenChange={() => setModal(null)} title="Update tenant" description="Update the tenant record instead of deleting it." className="sm:max-w-4xl">
        <form onSubmit={submitEdit}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="Name of the Tenancy" required value={editDraft.tenancyName} onChange={(event) => setEditDraft({ ...editDraft, tenancyName: event.target.value })} />
            <AdminTextField label="Registration Number" required value={editDraft.registrationNumber} onChange={(event) => setEditDraft({ ...editDraft, registrationNumber: event.target.value })} />
            <AdminTextField label="Ministry of Education Reg Number" required value={editDraft.ministryRegNumber} onChange={(event) => setEditDraft({ ...editDraft, ministryRegNumber: event.target.value })} />
            <AdminTextField label="County" required value={editDraft.county} onChange={(event) => setEditDraft({ ...editDraft, county: event.target.value })} />
            <AdminTextField label="Sub county" required value={editDraft.subCounty} onChange={(event) => setEditDraft({ ...editDraft, subCounty: event.target.value })} />
            <AdminTextField label="Number of schools under Tenancy" type="number" min="1" value={editDraft.numberOfSchoolsUnderTenancy} onChange={(event) => setEditDraft({ ...editDraft, numberOfSchoolsUnderTenancy: event.target.value })} />
            <AdminSelectField label="Ownership type" value={editDraft.ownershipType} onChange={(event) => setEditDraft({ ...editDraft, ownershipType: event.target.value as OwnershipType })}>
              <option>Private</option>
              <option>Public</option>
              <option>Sponsored</option>
            </AdminSelectField>
            <AdminTextField label="Primary contact name" required value={editDraft.primaryContactName} onChange={(event) => setEditDraft({ ...editDraft, primaryContactName: event.target.value })} />
            <AdminTextField label="Primary contact role" value={editDraft.primaryContactRole} onChange={(event) => setEditDraft({ ...editDraft, primaryContactRole: event.target.value })} />
            <AdminTextField label="Email" required type="email" value={editDraft.email} onChange={(event) => setEditDraft({ ...editDraft, email: event.target.value })} />
            <AdminTextField label="Phone" required value={editDraft.phone} onChange={(event) => setEditDraft({ ...editDraft, phone: event.target.value })} />
            <AdminTextField label="Alternate phone" value={editDraft.alternatePhone} onChange={(event) => setEditDraft({ ...editDraft, alternatePhone: event.target.value })} />
            <AdminTextField label="Postal address" value={editDraft.postalAddress} onChange={(event) => setEditDraft({ ...editDraft, postalAddress: event.target.value })} />
            <AdminTextField label="Billing contact name" value={editDraft.billingContactName} onChange={(event) => setEditDraft({ ...editDraft, billingContactName: event.target.value })} />
            <AdminTextField label="Billing email" type="email" value={editDraft.billingEmail} onChange={(event) => setEditDraft({ ...editDraft, billingEmail: event.target.value })} />
            <AdminTextField label="Billing phone" value={editDraft.billingPhone} onChange={(event) => setEditDraft({ ...editDraft, billingPhone: event.target.value })} />
            <AdminTextareaField wrapperClassName="md:col-span-2" label="Physical address" value={editDraft.physicalAddress} onChange={(event) => setEditDraft({ ...editDraft, physicalAddress: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Update tenant" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "school"} onOpenChange={() => setModal(null)} title="Create school under Tenancy">
        <form onSubmit={submitSchool}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="School name" required value={schoolDraft.name} onChange={(event) => setSchoolDraft({ ...schoolDraft, name: event.target.value })} />
            <AdminTextField label="Branch label" value={schoolDraft.branchLabel} onChange={(event) => setSchoolDraft({ ...schoolDraft, branchLabel: event.target.value })} />
            <AdminSelectField label="School type" value={schoolDraft.type} onChange={(event) => setSchoolDraft({ ...schoolDraft, type: event.target.value as TenantBranchSchool["type"] })}>
              <option>Primary</option>
              <option>Junior School</option>
              <option>Secondary</option>
              <option>Mixed</option>
            </AdminSelectField>
            <AdminTextField label="Students" type="number" min="0" value={schoolDraft.students} onChange={(event) => setSchoolDraft({ ...schoolDraft, students: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Create school under Tenancy" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "deactivate"} onOpenChange={() => setModal(null)} title="Deactivate" description="Deactivating must accompany a reason.">
        <form onSubmit={submitDeactivate}>
          <AdminTextareaField label="Reason" required value={deactivationReason} onChange={(event) => setDeactivationReason(event.target.value)} placeholder="Explain why this tenant is being deactivated." />
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Deactivate" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "invoice"} onOpenChange={() => setModal(null)} title="Add invoice" description="Fill this form to create a formal invoice for the tenant." className="sm:max-w-3xl">
        <form onSubmit={submitInvoice}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="Issue date" type="date" required value={invoiceDraft.issueDate} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, issueDate: event.target.value })} />
            <AdminTextField label="Due date" type="date" required value={invoiceDraft.dueDate} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, dueDate: event.target.value })} />
            <AdminTextField label="Bill to" value={invoiceDraft.billTo} placeholder={tenantName} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, billTo: event.target.value })} />
            <AdminTextField label="Amount" type="number" min="0" required value={invoiceDraft.amount} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, amount: event.target.value })} />
            <AdminTextField label="Tax" type="number" min="0" value={invoiceDraft.tax} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, tax: event.target.value })} />
            <AdminTextareaField wrapperClassName="md:col-span-2" label="Line items" required value={invoiceDraft.lineItems} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, lineItems: event.target.value })} />
            <AdminTextareaField wrapperClassName="md:col-span-2" label="Invoice notes" value={invoiceDraft.notes} onChange={(event) => setInvoiceDraft({ ...invoiceDraft, notes: event.target.value })} />
          </div>
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Generate invoice" />
        </form>
      </AdminModal>

      <AdminModal open={modal === "cancelInvoice"} onOpenChange={() => setModal(null)} title="Cancel invoice" description="Cancelling an invoice must accompany a reason.">
        <form onSubmit={submitCancelInvoice}>
          <AdminTextareaField label="Reason" required value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} placeholder="Explain why this invoice is being cancelled." />
          <AdminModalFooter onCancel={() => setModal(null)} submitLabel="Cancel invoice" />
        </form>
      </AdminModal>
    </>
  );
}
