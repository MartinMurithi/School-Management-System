import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AdminActionIcon,
  AdminModalFooter,
  AdminSearchInput,
  AdminSelectField,
  AdminTextareaField,
  AdminTextField,
} from "@/components/admin/AdminControls";
import { AdminModal } from "@/components/admin/AdminModal";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Building2,
  CheckCircle2,
  Eye,
  FileCheck2,
  Filter,
  KeyRound,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";
import { type OnboardingStatus, type OwnershipType } from "@/lib/admin-data";
import {
  emptyOnboardingDraft,
  onboardingStatusTone,
  useAdminOnboardingStore,
} from "@/lib/admin-onboarding-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/admin/onboarding/")({ component: OnboardingIndex });

const statuses: Array<"All" | OnboardingStatus> = ["All", "Demo", "Trial", "Guided setup", "Active", "Deactivated", "Cancelled", "Expired"];
const ownershipTypes: Array<"All" | OwnershipType> = ["All", "Private", "Public", "Sponsored"];

function OnboardingIndex() {
  const navigate = useNavigate();
  const { accounts, totals, createOnboarding } = useAdminOnboardingStore();
  const { addSchoolsFromTenant } = useAdminSchoolStore();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | OnboardingStatus>("All");
  const [ownershipType, setOwnershipType] = useState<"All" | OwnershipType>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState(emptyOnboardingDraft);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return accounts.filter((account) => {
      const matchesSearch =
        !needle ||
        [
          account.tenancyName,
          account.school,
          account.registrationNumber,
          account.ministryRegNumber,
          account.county,
          account.subCounty,
          account.ownershipType,
          account.contactDetails?.primaryContactName,
          account.contactDetails?.email,
          account.contactDetails?.phone,
          account.status,
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle);
      const matchesStatus = status === "All" || account.status === status;
      const matchesOwnership = ownershipType === "All" || account.ownershipType === ownershipType;
      return matchesSearch && matchesStatus && matchesOwnership;
    });
  }, [accounts, ownershipType, query, status]);

  function submitOnboarding(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = createOnboarding(form);
    if (!account) return;
    const schools = addSchoolsFromTenant(account);
    setSuccess(
      `Success: tenant account created, email sent to tenant, and ${schools.length} school${schools.length === 1 ? "" : "s"} listed on the schools side (/admin/schools). Login credentials are displayed to the super admin and included in the email.`,
    );
    setShowForm(false);
    setForm(emptyOnboardingDraft);
    navigate({ to: "/admin/onboarding/$onboardingId", params: { onboardingId: account.id } });
  }

  return (
    <>
      <PageHeader
        title="Onboarding of a tenant"
        description="Onboard a tenant that can have one school, or have multiple branches under the same owner."
        actions={
          <Button onClick={() => setShowForm(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Onboarding of a tenant
          </Button>
        }
      />
      <PageBody>
        {success && <div className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success">{success}</div>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Tenants" value={String(accounts.length)} delta={`${filtered.length} visible`} icon={Building2} />
          <MetricCard label="Schools under Tenancy" value={String(accounts.reduce((sum, account) => sum + (account.schools?.length ?? account.branches ?? 1), 0))} icon={ShieldCheck} />
          <MetricCard label="Active tenants" value={String(totals.active)} delta={`${totals.deactivated} deactivated`} trend="flat" icon={CheckCircle2} />
          <MetricCard label="Account credentials" value={String(accounts.filter((account) => account.credentials).length)} delta="created accounts" icon={KeyRound} />
        </div>

        <SectionCard title="Tenants" description="View every tenant and open the tenant to see every school under each tenant." padded={false}>
          <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
            <AdminSearchInput value={query} onChange={setQuery} placeholder="Search tenants, registration numbers, contacts..." className="max-w-none" />
            <Button variant="outline" onClick={() => setShowFilters((current) => !current)} className="gap-1.5">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="grid gap-3 border-b border-border bg-surface p-4 md:grid-cols-3">
              <AdminSelectField label="Status" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                {statuses.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </AdminSelectField>
              <AdminSelectField label="Ownership type" value={ownershipType} onChange={(event) => setOwnershipType(event.target.value as typeof ownershipType)}>
                {ownershipTypes.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </AdminSelectField>
              <div className="flex items-end justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatus("All");
                    setOwnershipType("All");
                    setQuery("");
                  }}
                >
                  Reset filters
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                <TableHead className="px-5 py-2.5">Name of the Tenancy</TableHead>
                <TableHead className="px-5 py-2.5">Registration Number</TableHead>
                <TableHead className="px-5 py-2.5">County</TableHead>
                <TableHead className="px-5 py-2.5">Number of schools under Tenancy</TableHead>
                <TableHead className="px-5 py-2.5">Ownership type</TableHead>
                <TableHead className="px-5 py-2.5">Status</TableHead>
                <TableHead className="px-5 py-2.5 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((account) => (
                <TableRow key={account.id} className="border-border/60">
                  <TableCell className="px-5 py-3">
                    <Link to="/admin/onboarding/$onboardingId" params={{ onboardingId: account.id }} className="font-medium hover:text-primary">
                      {account.tenancyName ?? account.school}
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {account.contactDetails?.primaryContactName ?? account.owner} - {account.contactDetails?.email ?? account.email}
                    </div>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="font-medium">{account.registrationNumber ?? "Pending"}</div>
                    <div className="text-xs text-muted-foreground">MoE: {account.ministryRegNumber ?? "Pending"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 text-muted-foreground">
                    {account.county ?? "Pending"}
                    <div className="text-xs">{account.subCounty ?? "Sub county pending"}</div>
                  </TableCell>
                  <TableCell className="px-5 py-3 tabular-nums">{account.schools?.length ?? account.numberOfSchoolsUnderTenancy ?? account.branches ?? 1}</TableCell>
                  <TableCell className="px-5 py-3">{account.ownershipType ?? "Private"}</TableCell>
                  <TableCell className="px-5 py-3">
                    <StatusBadge tone={onboardingStatusTone(account.status)}>{account.status}</StatusBadge>
                  </TableCell>
                  <TableCell className="px-5 py-3">
                    <div className="flex justify-end">
                      <AdminActionIcon asChild label={`View ${account.tenancyName ?? account.school}`}>
                        <Link to="/admin/onboarding/$onboardingId" params={{ onboardingId: account.id }}>
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </AdminActionIcon>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                    No tenants match the current search and filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </SectionCard>
      </PageBody>

      <AdminModal
        open={showForm}
        onOpenChange={setShowForm}
        title="Onboarding of a tenant"
        description="After this form is sent, the system automatically creates an account for the tenant, sends an email to the tenant, and displays the login credentials to the super admin."
        className="sm:max-w-4xl"
      >
        <form onSubmit={submitOnboarding}>
          <div className="grid gap-3 md:grid-cols-2">
            <AdminTextField label="Name of the Tenancy" required value={form.tenancyName} onChange={(event) => setForm({ ...form, tenancyName: event.target.value })} />
            <AdminTextField label="Registration Number" required value={form.registrationNumber} onChange={(event) => setForm({ ...form, registrationNumber: event.target.value })} />
            <AdminTextField label="Ministry of Education Reg Number" required value={form.ministryRegNumber} onChange={(event) => setForm({ ...form, ministryRegNumber: event.target.value })} />
            <AdminTextField label="County" required value={form.county} onChange={(event) => setForm({ ...form, county: event.target.value })} />
            <AdminTextField label="Sub county" required value={form.subCounty} onChange={(event) => setForm({ ...form, subCounty: event.target.value })} />
            <AdminTextField label="Number of schools under Tenancy" required type="number" min="1" value={form.numberOfSchoolsUnderTenancy} onChange={(event) => setForm({ ...form, numberOfSchoolsUnderTenancy: event.target.value })} />
            <AdminSelectField label="Ownership type" value={form.ownershipType} onChange={(event) => setForm({ ...form, ownershipType: event.target.value as OwnershipType })}>
              <option>Private</option>
              <option>Public</option>
              <option>Sponsored</option>
            </AdminSelectField>
            <AdminSelectField label="School type" value={form.schoolType} onChange={(event) => setForm({ ...form, schoolType: event.target.value as typeof form.schoolType })}>
              <option>Primary</option>
              <option>Junior School</option>
              <option>Secondary</option>
              <option>Mixed</option>
            </AdminSelectField>
            <AdminTextField label="Expected students per school" type="number" min="0" value={form.expectedStudents} onChange={(event) => setForm({ ...form, expectedStudents: event.target.value })} />
            <AdminTextareaField wrapperClassName="md:col-span-2" label="Schools under Tenancy" value={form.schoolNames} onChange={(event) => setForm({ ...form, schoolNames: event.target.value })} placeholder="One school per line. Leave blank to auto-create branch names from the tenancy name." />
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 font-medium">
              <Send className="h-4 w-4 text-primary" />
              Contact details ( take detailed contacts)
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <AdminTextField label="Primary contact name" required value={form.primaryContactName} onChange={(event) => setForm({ ...form, primaryContactName: event.target.value })} />
              <AdminTextField label="Primary contact role" value={form.primaryContactRole} onChange={(event) => setForm({ ...form, primaryContactRole: event.target.value })} />
              <AdminTextField label="Email" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              <AdminTextField label="Phone" required value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
              <AdminTextField label="Alternate phone" value={form.alternatePhone} onChange={(event) => setForm({ ...form, alternatePhone: event.target.value })} />
              <AdminTextField label="Postal address" value={form.postalAddress} onChange={(event) => setForm({ ...form, postalAddress: event.target.value })} />
              <AdminTextareaField wrapperClassName="md:col-span-2" label="Physical address" value={form.physicalAddress} onChange={(event) => setForm({ ...form, physicalAddress: event.target.value })} />
              <AdminTextField label="Billing contact name" value={form.billingContactName} onChange={(event) => setForm({ ...form, billingContactName: event.target.value })} />
              <AdminTextField label="Billing email" type="email" value={form.billingEmail} onChange={(event) => setForm({ ...form, billingEmail: event.target.value })} />
              <AdminTextField label="Billing phone" value={form.billingPhone} onChange={(event) => setForm({ ...form, billingPhone: event.target.value })} />
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2 font-medium">
              <FileCheck2 className="h-4 w-4 text-primary" />
              Documents upload (MOU between the system and the Tenancy)
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <AdminTextField label="MOU between the system and the Tenancy" required value={form.mouDocumentName} onChange={(event) => setForm({ ...form, mouDocumentName: event.target.value })} />
              <AdminTextField label="Documents upload" type="file" />
            </div>
          </div>

          <AdminModalFooter onCancel={() => setShowForm(false)} submitLabel="Send onboarding form" />
        </form>
      </AdminModal>
    </>
  );
}
