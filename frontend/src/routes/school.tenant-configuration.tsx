import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AdminSelectField, AdminTextareaField, AdminTextField } from "@/components/admin/AdminControls";
import { PageHeader, PageBody } from "@/components/shell/AppShell";
import { MetricCard, ProgressBar, SectionCard, StatusBadge } from "@/components/shell/widgets";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Layers3,
  Lock,
  Plus,
  Save,
  School,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  type AcademicYearConfig,
  type AdministrativePosition,
  type ConfiguredClass,
  type SchoolCurriculum,
  type SchoolMode,
  type SchoolTenant,
  type SubscriptionPlan,
  type TenantBranchSchool,
  makeId,
  planMrr,
} from "@/lib/admin-data";
import { billingPlans, subscriptionAmount } from "@/lib/admin-billing-store";
import { useAdminOnboardingStore } from "@/lib/admin-onboarding-store";
import { useAdminSchoolStore } from "@/lib/admin-school-store";

export const Route = createFileRoute("/school/tenant-configuration")({ component: TenantConfiguration });

type AdminRow = AdministrativePosition & { id: string };

type SchoolConfigDraft = {
  id: string;
  name: string;
  type: NonNullable<SchoolTenant["type"]>;
  logoName: string;
  motto: string;
  vision: string;
  mission: string;
  nemisCode: string;
  mode: SchoolMode;
  curriculum: SchoolCurriculum;
  classesText: string;
  streamInputs: Record<string, string>;
  subjectsText: string;
  departmentsText: string;
  administrativeStructure: AdminRow[];
  academicYears: AcademicYearConfig[];
};

type WizardStep =
  | { id: string; label: string; detail: string; kind: "profile" | "structure" | "administration" | "calendar"; schoolId: string }
  | { id: string; label: string; detail: string; kind: "plan" | "publish"; schoolId?: never };

const staffOptions = [
  "Mary Wanjiku",
  "Patrick Otieno",
  "Amina Yusuf",
  "Peter Kariuki",
  "Lucy Karimi",
  "Daniel Mutua",
  "Joseph Njoroge",
  "Grace Achieng",
  "Hassan Abdi",
];

const defaultClasses = ["Grade 1", "Grade 2", "Grade 3"];
const defaultSubjects = ["English", "Kiswahili", "Mathematics", "Environmental Activities"];
const defaultDepartments = ["Academics", "Administration", "Finance"];

function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toText(items?: string[]) {
  return (items && items.length > 0 ? items : []).join("\n");
}

function modulesForPlan(plan: SubscriptionPlan) {
  if (plan === "Starter") return ["Students", "Finance", "Basic reports"];
  if (plan === "Growth") return ["Students", "Finance", "M-PESA", "Exams", "CBC", "SMS"];
  return ["Students", "Finance", "Exams", "M-PESA", "CBC", "Transport", "HR", "Library", "Advanced analytics", "Dedicated onboarding"];
}

function makeTerms(yearName: string, numberOfTerms: number) {
  return Array.from({ length: Math.max(1, numberOfTerms) }, (_, index) => ({
    id: makeId(`${yearName}-term-${index + 1}`) || `${Date.now()}-${index}`,
    name: `Term ${index + 1}`,
    startDate: "",
    endDate: "",
    events: [],
  }));
}

function makeDraftFromSchool(school: TenantBranchSchool, registrySchool?: SchoolTenant): SchoolConfigDraft {
  const configuredClasses = registrySchool?.configuredClasses ?? defaultClasses.map((name) => ({ name, streams: ["A"] }));
  return {
    id: school.id,
    name: registrySchool?.name ?? school.name,
    type: (registrySchool?.type ?? school.type ?? "Primary") as NonNullable<SchoolTenant["type"]>,
    logoName: registrySchool?.logoName ?? "",
    motto: registrySchool?.motto ?? "",
    vision: registrySchool?.vision ?? "",
    mission: registrySchool?.mission ?? "",
    nemisCode: registrySchool?.nemisCode ?? "",
    mode: registrySchool?.mode ?? "Day",
    curriculum: (registrySchool?.curriculum as SchoolCurriculum | undefined) ?? "CBC",
    classesText: configuredClasses.map((item) => item.name).join("\n"),
    streamInputs: Object.fromEntries(configuredClasses.map((item) => [item.name, item.streams.join(", ")])),
    subjectsText: toText(registrySchool?.configuredSubjects) || defaultSubjects.join("\n"),
    departmentsText: toText(registrySchool?.configuredDepartments) || defaultDepartments.join("\n"),
    administrativeStructure:
      registrySchool?.administrativeStructure?.map((item) => ({ ...item, id: `${item.seniority}-${item.position}` })) ?? [
        { id: "principal", seniority: 1, position: "Principal", staffName: staffOptions[0] },
        { id: "deputy-principal", seniority: 2, position: "Deputy Principal", staffName: staffOptions[1] },
      ],
    academicYears: registrySchool?.academicYears ?? [],
  };
}

function configurationProgress(draft: SchoolConfigDraft) {
  const checks = [
    draft.name,
    draft.logoName,
    draft.motto,
    draft.vision,
    draft.mission,
    draft.nemisCode,
    draft.classesText,
    Object.keys(draft.streamInputs).length,
    draft.subjectsText,
    draft.departmentsText,
    draft.administrativeStructure.length,
    draft.academicYears.length,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function stepComplete(step: WizardStep, draft?: SchoolConfigDraft) {
  if (step.kind === "plan" || step.kind === "publish") return true;
  if (!draft) return false;
  if (step.kind === "profile") return Boolean(draft.name && draft.logoName && draft.motto && draft.vision && draft.mission && draft.nemisCode && draft.mode);
  if (step.kind === "structure") return Boolean(draft.curriculum && draft.classesText && draft.subjectsText && draft.departmentsText);
  if (step.kind === "administration") return draft.administrativeStructure.length > 0 && draft.administrativeStructure.every((row) => row.position && row.staffName);
  return draft.academicYears.length > 0;
}

function TenantConfiguration() {
  const { accounts } = useAdminOnboardingStore();
  const { schools, upsertSchool } = useAdminSchoolStore();
  const [drafts, setDrafts] = useState<Record<string, SchoolConfigDraft>>({});
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("Starter");
  const [billingCycle, setBillingCycle] = useState<"Monthly" | "Termly" | "Annual">("Monthly");
  const [yearDraft, setYearDraft] = useState({ name: "2026 Academic Year", startDate: "2026-01-05", endDate: "2026-11-20", numberOfTerms: "3" });
  const [stepIndex, setStepIndex] = useState(0);
  const [notice, setNotice] = useState("");

  const tenants = useMemo(() => accounts.filter((account) => account.credentials || account.schools?.length), [accounts]);
  const tenant = tenants.find((account) => account.id === "starlight-education-group") ?? tenants.find((account) => (account.schools?.length ?? 0) > 1) ?? tenants[0];
  const declaredSchools: TenantBranchSchool[] = useMemo(() => {
    if (!tenant) return [];
    if (tenant.schools?.length) return tenant.schools;
    const count = Math.max(1, tenant.numberOfSchoolsUnderTenancy ?? tenant.branches ?? 1);
    return Array.from({ length: count }, (_, index) => ({
      id: `${tenant.id}-school-${index + 1}`,
      name: index === 0 ? tenant.school : `${tenant.tenancyName ?? tenant.school} Branch ${index + 1}`,
      county: tenant.county ?? "Nairobi",
      subCounty: tenant.subCounty ?? "",
      type: tenant.schoolType ?? "Primary",
      students: tenant.expectedStudents ?? 0,
      branchLabel: index === 0 ? "Main school" : `Branch ${index + 1}`,
      status: "Active",
    }));
  }, [tenant]);

  const steps: WizardStep[] = useMemo(
    () => [
      ...declaredSchools.flatMap((school, index) => [
        { id: `${school.id}-profile`, label: `School ${index + 1}: Profile`, detail: school.name, kind: "profile" as const, schoolId: school.id },
        { id: `${school.id}-structure`, label: `School ${index + 1}: Academic structure`, detail: school.name, kind: "structure" as const, schoolId: school.id },
        { id: `${school.id}-administration`, label: `School ${index + 1}: Administration`, detail: school.name, kind: "administration" as const, schoolId: school.id },
        { id: `${school.id}-calendar`, label: `School ${index + 1}: Academic calendar`, detail: school.name, kind: "calendar" as const, schoolId: school.id },
      ]),
      { id: "tenancy-plan", label: "Choose a plan/pricing/subscription", detail: "Entire tenancy", kind: "plan" as const },
      { id: "publish", label: "Publish", detail: "Send all school details to /admin/schools", kind: "publish" as const },
    ],
    [declaredSchools],
  );

  useEffect(() => {
    if (!tenant) return;
    setDrafts((current) => {
      const next = { ...current };
      declaredSchools.forEach((school) => {
        if (!next[school.id]) {
          const registrySchool = schools.find((item) => item.id === school.id || item.name === school.name);
          next[school.id] = makeDraftFromSchool(school, registrySchool);
        }
      });
      return next;
    });
    const firstConfiguredSchool = schools.find((school) => school.tenancyId === tenant.id);
    if (firstConfiguredSchool) {
      setSelectedPlan(firstConfiguredSchool.plan);
      setBillingCycle(firstConfiguredSchool.billingCycle ?? "Monthly");
    }
  }, [declaredSchools, schools, tenant]);

  useEffect(() => {
    if (stepIndex > steps.length - 1) setStepIndex(Math.max(0, steps.length - 1));
  }, [stepIndex, steps.length]);

  const activeStep = steps[stepIndex];
  const activeSchool = activeStep?.schoolId ? declaredSchools.find((school) => school.id === activeStep.schoolId) : undefined;
  const activeDraft = activeStep?.schoolId ? drafts[activeStep.schoolId] : undefined;
  const completedSchools = declaredSchools.filter((school) => configurationProgress(drafts[school.id] ?? makeDraftFromSchool(school)) >= 100).length;
  const selectedPlanConfig = billingPlans.find((plan) => plan.id === selectedPlan) ?? billingPlans[0];
  const completedSteps = steps.filter((step) => stepComplete(step, step.schoolId ? drafts[step.schoolId] : undefined)).length;
  const selectedSchoolId = activeStep.schoolId ?? declaredSchools[0]?.id ?? "";
  const schoolStepKinds = [
    { kind: "profile" as const, label: "Profile", detail: "Logo, motto, vision, mission, NEMIS and mode", icon: GraduationCap },
    { kind: "structure" as const, label: "Academic structure", detail: "Curriculum, classes, streams, subjects and departments", icon: BookOpen },
    { kind: "administration" as const, label: "Administration", detail: "Seniority positions mapped to staff", icon: Users },
    { kind: "calendar" as const, label: "Academic calendar", detail: "Academic years, terms, dates and events", icon: CalendarDays },
  ];

  function updateDraft(schoolId: string, changes: Partial<SchoolConfigDraft>) {
    setDrafts((current) => ({
      ...current,
      [schoolId]: {
        ...current[schoolId],
        ...changes,
      },
    }));
  }

  function parsedClasses(draft: SchoolConfigDraft): ConfiguredClass[] {
    return splitLines(draft.classesText).map((name) => ({
      name,
      streams: splitLines(draft.streamInputs[name] ?? "A"),
    }));
  }

  function addAdministrativePosition() {
    if (!activeDraft) return;
    const nextSeniority = activeDraft.administrativeStructure.length + 1;
    updateDraft(activeDraft.id, {
      administrativeStructure: [
        ...activeDraft.administrativeStructure,
        { id: `position-${Date.now()}`, seniority: nextSeniority, position: "", staffName: staffOptions[0] },
      ],
    });
  }

  function updateAdministrativePosition(rowId: string, changes: Partial<AdminRow>) {
    if (!activeDraft) return;
    updateDraft(activeDraft.id, {
      administrativeStructure: activeDraft.administrativeStructure.map((row) => (row.id === rowId ? { ...row, ...changes } : row)),
    });
  }

  function removeAdministrativePosition(rowId: string) {
    if (!activeDraft) return;
    updateDraft(activeDraft.id, {
      administrativeStructure: activeDraft.administrativeStructure
        .filter((row) => row.id !== rowId)
        .map((row, index) => ({ ...row, seniority: index + 1 })),
    });
  }

  function createAcademicYear() {
    if (!activeDraft) return;
    const numberOfTerms = Number(yearDraft.numberOfTerms) || 3;
    const academicYear: AcademicYearConfig = {
      id: makeId(`${activeDraft.id}-${yearDraft.name}`) || `${activeDraft.id}-${Date.now()}`,
      name: yearDraft.name,
      startDate: yearDraft.startDate,
      endDate: yearDraft.endDate,
      numberOfTerms,
      status: "Open",
      terms: makeTerms(yearDraft.name, numberOfTerms),
    };
    updateDraft(activeDraft.id, { academicYears: [academicYear, ...activeDraft.academicYears] });
    setYearDraft({ name: "2026 Academic Year", startDate: "2026-01-05", endDate: "2026-11-20", numberOfTerms: "3" });
  }

  function updateAcademicYear(yearId: string, changes: Partial<AcademicYearConfig>) {
    if (!activeDraft) return;
    updateDraft(activeDraft.id, {
      academicYears: activeDraft.academicYears.map((year) => (year.id === yearId ? { ...year, ...changes } : year)),
    });
  }

  function deleteAcademicYear(yearId: string) {
    if (!activeDraft) return;
    updateDraft(activeDraft.id, {
      academicYears: activeDraft.academicYears.filter((year) => year.id !== yearId),
    });
  }

  function updateTerm(yearId: string, termId: string, changes: Partial<AcademicYearConfig["terms"][number]>) {
    if (!activeDraft) return;
    updateDraft(activeDraft.id, {
      academicYears: activeDraft.academicYears.map((year) =>
        year.id === yearId
          ? {
              ...year,
              terms: year.terms.map((term) => (term.id === termId ? { ...term, ...changes } : term)),
            }
          : year,
      ),
    });
  }

  function addTermEvent(yearId: string, termId: string) {
    if (!activeDraft) return;
    const title = window.prompt("Event title");
    if (!title) return;
    const date = window.prompt("Event date (YYYY-MM-DD)", "2026-01-15") || "";
    const year = activeDraft.academicYears.find((item) => item.id === yearId);
    const term = year?.terms.find((item) => item.id === termId);
    if (!year || !term) return;
    updateTerm(yearId, termId, {
      events: [...term.events, { id: `${termId}-${Date.now()}`, title, date }],
    });
  }

  function publishConfiguration() {
    if (!tenant) return;
    const modules = modulesForPlan(selectedPlan);
    declaredSchools.forEach((school) => {
      const draft = drafts[school.id] ?? makeDraftFromSchool(school);
      const configuredClasses = parsedClasses(draft);
      const registrySchool = schools.find((item) => item.id === school.id);
      const schoolRecord: SchoolTenant = {
        id: school.id,
        name: draft.name,
        tenancyId: tenant.id,
        tenancyName: tenant.tenancyName ?? tenant.school,
        registrationNumber: tenant.registrationNumber,
        ministryRegNumber: tenant.ministryRegNumber,
        subCounty: tenant.subCounty,
        ownershipType: tenant.ownershipType,
        branchLabel: school.branchLabel,
        type: draft.type,
        logoName: draft.logoName,
        motto: draft.motto,
        vision: draft.vision,
        mission: draft.mission,
        nemisCode: draft.nemisCode,
        mode: draft.mode,
        configured: true,
        configuredAt: "Just now",
        configuredByTenant: tenant.tenancyName ?? tenant.school,
        configuredClasses,
        configuredSubjects: splitLines(draft.subjectsText),
        configuredDepartments: splitLines(draft.departmentsText),
        administrativeStructure: draft.administrativeStructure
          .map(({ id: _id, ...row }) => row)
          .sort((a, b) => a.seniority - b.seniority),
        academicYears: draft.academicYears,
        county: school.county || tenant.county || "Nairobi",
        curriculum: draft.curriculum,
        students: school.students,
        users: registrySchool?.users ?? 1,
        plan: selectedPlan,
        mrr: billingCycle === "Monthly" ? planMrr(selectedPlan) : Math.round(subscriptionAmount(selectedPlan, billingCycle) / (billingCycle === "Annual" ? 12 : 3)),
        status: "Active",
        paymentStatus: "Pending",
        billingCycle,
        onboarding: 100,
        onboardingStage: "Live",
        isolation: "Verified",
        owner: tenant.contactDetails?.primaryContactName ?? tenant.owner,
        phone: tenant.contactDetails?.phone ?? tenant.phone ?? "",
        email: tenant.contactDetails?.email ?? tenant.email ?? "",
        subdomain: registrySchool?.subdomain ?? `${school.id}.schoolwise.co.ke`,
        branches: declaredSchools.length,
        supportOwner: tenant.supportOwner ?? "Super admin",
        lastActivity: "Just now",
        modules,
      };
      upsertSchool(schoolRecord, "Tenant configuration published", `${draft.name} profile, academic structure, academic calendar, and plan modules were configured by ${tenant.tenancyName ?? tenant.school}.`);
    });
    setNotice(`Published. ${declaredSchools.length} school${declaredSchools.length === 1 ? "" : "s"} are now listed and updated on /admin/schools with ${selectedPlan} modules.`);
  }

  function saveAndContinue() {
    if (activeStep?.kind === "publish") {
      publishConfiguration();
      return;
    }
    setNotice(`${activeStep?.label ?? "Step"} saved.`);
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  }

  function openSchoolStep(schoolId: string, kind: WizardStep["kind"] = "profile") {
    const nextIndex = steps.findIndex((step) => step.schoolId === schoolId && step.kind === kind);
    if (nextIndex >= 0) setStepIndex(nextIndex);
  }

  function openGlobalStep(kind: "plan" | "publish") {
    const nextIndex = steps.findIndex((step) => step.kind === kind);
    if (nextIndex >= 0) setStepIndex(nextIndex);
  }

  if (!tenant || !activeStep) {
    return (
      <>
        <PageHeader title="Tenant configuration" description="No onboarded tenant account was found. Complete superadmin tenant onboarding first." />
        <PageBody>
          <SectionCard title="Waiting for onboarding">
            <p className="text-sm text-muted-foreground">After tenant onboarding creates login credentials, this page opens the configuration flow.</p>
          </SectionCard>
        </PageBody>
      </>
    );
  }

  const classes = activeDraft ? splitLines(activeDraft.classesText) : [];
  const currentProgress = activeDraft ? configurationProgress(activeDraft) : Math.round((completedSteps / Math.max(steps.length, 1)) * 100);

  return (
    <>
      <PageHeader
        title="Tenant configuration"
        description="Complete the step by step guide for each school declared during tenancy onboarding, then publish all school details."
      />
      <PageBody>
        {notice && <div className="rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm font-medium text-success">{notice}</div>}

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Declared schools" value={String(declaredSchools.length)} icon={School} />
          <MetricCard label="Schools complete" value={`${completedSchools}/${declaredSchools.length}`} icon={CheckCircle2} />
          <MetricCard label="Guide progress" value={`${completedSteps}/${steps.length}`} hint={`${Math.round((completedSteps / Math.max(steps.length, 1)) * 100)}%`} icon={Sparkles} />
          <MetricCard label="Selected plan" value={selectedPlan} hint={billingCycle} icon={Lock} />
        </div>

        <SectionCard title="Schools" description="Switch between the schools declared during tenancy onboarding.">
          <div className="grid gap-3 md:grid-cols-3">
            {declaredSchools.map((school) => {
              const draft = drafts[school.id] ?? makeDraftFromSchool(school);
              const progress = configurationProgress(draft);
              const selected = school.id === selectedSchoolId;
              const position = declaredSchools.findIndex((item) => item.id === school.id) + 1;
              return (
                <button
                  key={school.id}
                  onClick={() => openSchoolStep(school.id, "profile")}
                  className={`rounded-xl border p-3 text-left transition ${
                    selected ? "border-primary/50 bg-primary-soft shadow-card" : "border-border bg-surface hover:bg-muted"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sm font-semibold ${
                      selected ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground ring-1 ring-border"
                    }`}>
                      {position}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate font-medium">{draft.name}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{school.branchLabel} - {school.type} - {school.county}</div>
                        </div>
                        <StatusBadge tone={progress >= 100 ? "success" : "warning"}>{progress}%</StatusBadge>
                      </div>
                      <div className="mt-3">
                        <ProgressBar value={progress} tone={progress >= 100 ? "success" : "primary"} />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {schoolStepKinds.map((item) => {
                          const schoolStep = steps.find((step) => step.schoolId === school.id && step.kind === item.kind);
                          const complete = schoolStep ? stepComplete(schoolStep, draft) : false;
                          return (
                            <span key={item.kind} className={`h-1.5 w-7 rounded-full ${complete ? "bg-success" : "bg-muted"}`} />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
          <SectionCard title="Step by step guide" description="Complete the setup steps for the selected school.">
            <div className="space-y-5">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected school steps</div>
                <div className="space-y-2">
                  {schoolStepKinds.map((item) => {
                    const Icon = item.icon;
                    const schoolStep = steps.find((step) => step.schoolId === selectedSchoolId && step.kind === item.kind);
                    const complete = schoolStep ? stepComplete(schoolStep, drafts[selectedSchoolId]) : false;
                    const active = activeStep.schoolId === selectedSchoolId && activeStep.kind === item.kind;
                    return (
                      <button
                        key={item.kind}
                        onClick={() => openSchoolStep(selectedSchoolId, item.kind)}
                        className={`w-full rounded-lg border p-3 text-left transition ${active ? "border-primary/40 bg-primary-soft" : "border-border bg-surface hover:bg-muted"}`}
                      >
                        <div className="flex gap-3">
                          <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${complete ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                            {complete ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium">{item.label}</div>
                            <div className="mt-0.5 text-xs leading-4 text-muted-foreground">{item.detail}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tenancy steps</div>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  <button
                    onClick={() => openGlobalStep("plan")}
                    className={`rounded-lg border p-3 text-left transition ${activeStep.kind === "plan" ? "border-primary/40 bg-primary-soft" : "border-border bg-surface hover:bg-muted"}`}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Plan
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{selectedPlan} - {billingCycle}</div>
                  </button>
                  <button
                    onClick={() => openGlobalStep("publish")}
                    className={`rounded-lg border p-3 text-left transition ${activeStep.kind === "publish" ? "border-primary/40 bg-primary-soft" : "border-border bg-surface hover:bg-muted"}`}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Save className="h-4 w-4 text-primary" />
                      Publish
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">Send all schools to /admin/schools</div>
                  </button>
                </div>
              </div>
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard
              title={activeStep.label}
              description={activeSchool ? `${activeSchool.branchLabel} - ${activeSchool.name}` : activeStep.detail}
              action={<StatusBadge tone={stepComplete(activeStep, activeDraft) ? "success" : "warning"}>{stepComplete(activeStep, activeDraft) ? "Complete" : "In progress"}</StatusBadge>}
            >
              {activeStep.kind === "profile" && activeDraft && (
                <div className="grid gap-3 md:grid-cols-2">
                  <AdminTextField label="School name" required value={activeDraft.name} onChange={(event) => updateDraft(activeDraft.id, { name: event.target.value })} />
                  <AdminSelectField label="School type" value={activeDraft.type} onChange={(event) => updateDraft(activeDraft.id, { type: event.target.value as SchoolConfigDraft["type"] })}>
                    <option>Primary</option>
                    <option>Junior Secondary</option>
                    <option>Senior Secondary</option>
                  </AdminSelectField>
                  <AdminTextField label="School Logo" type="file" onChange={(event) => updateDraft(activeDraft.id, { logoName: event.currentTarget.files?.[0]?.name ?? activeDraft.logoName })} />
                  <AdminTextField label="Selected logo" value={activeDraft.logoName} onChange={(event) => updateDraft(activeDraft.id, { logoName: event.target.value })} />
                  <AdminTextField label="School Motto" required value={activeDraft.motto} onChange={(event) => updateDraft(activeDraft.id, { motto: event.target.value })} />
                  <AdminTextField label="Nemis code" required value={activeDraft.nemisCode} onChange={(event) => updateDraft(activeDraft.id, { nemisCode: event.target.value })} />
                  <AdminSelectField label="Mode" value={activeDraft.mode} onChange={(event) => updateDraft(activeDraft.id, { mode: event.target.value as SchoolMode })}>
                    <option>Day</option>
                    <option>Boarding</option>
                    <option>Both</option>
                  </AdminSelectField>
                  <AdminTextareaField label="School Vision" required value={activeDraft.vision} onChange={(event) => updateDraft(activeDraft.id, { vision: event.target.value })} />
                  <AdminTextareaField wrapperClassName="md:col-span-2" label="School Mission" required value={activeDraft.mission} onChange={(event) => updateDraft(activeDraft.id, { mission: event.target.value })} />
                </div>
              )}

              {activeStep.kind === "structure" && activeDraft && (
                <div className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-2">
                    <AdminSelectField label="Curriculum" value={activeDraft.curriculum} onChange={(event) => updateDraft(activeDraft.id, { curriculum: event.target.value as SchoolCurriculum })}>
                      <option>CBC</option>
                      <option>8-4-4</option>
                      <option>GSCE</option>
                    </AdminSelectField>
                    <AdminTextareaField label="Define classes" value={activeDraft.classesText} onChange={(event) => updateDraft(activeDraft.id, { classesText: event.target.value })} placeholder={"Grade 1\nGrade 2\nGrade 3"} />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                      <Layers3 className="h-4 w-4 text-primary" />
                      Define Streams in each class stated
                    </div>
                    <div className="grid gap-3 md:grid-cols-2">
                      {classes.map((className) => (
                        <AdminTextField
                          key={className}
                          label={`${className} streams`}
                          value={activeDraft.streamInputs[className] ?? ""}
                          placeholder="A, B, C"
                          onChange={(event) =>
                            updateDraft(activeDraft.id, {
                              streamInputs: { ...activeDraft.streamInputs, [className]: event.target.value },
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <AdminTextareaField label="Define all the Subjects offered in the school" value={activeDraft.subjectsText} onChange={(event) => updateDraft(activeDraft.id, { subjectsText: event.target.value })} />
                    <AdminTextareaField label="Define all the departments in the school" value={activeDraft.departmentsText} onChange={(event) => updateDraft(activeDraft.id, { departmentsText: event.target.value })} />
                  </div>
                </div>
              )}

              {activeStep.kind === "administration" && activeDraft && (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={addAdministrativePosition} className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      Add position
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                        <TableHead className="px-5 py-2.5">Seniority</TableHead>
                        <TableHead className="px-5 py-2.5">Position</TableHead>
                        <TableHead className="px-5 py-2.5">Staff name</TableHead>
                        <TableHead className="px-5 py-2.5 text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeDraft.administrativeStructure.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="px-5 py-3 tabular-nums">{row.seniority}</TableCell>
                          <TableCell className="px-5 py-3">
                            <input className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary/60" value={row.position} onChange={(event) => updateAdministrativePosition(row.id, { position: event.target.value })} />
                          </TableCell>
                          <TableCell className="px-5 py-3">
                            <select className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none focus:border-primary/60" value={row.staffName} onChange={(event) => updateAdministrativePosition(row.id, { staffName: event.target.value })}>
                              {staffOptions.map((name) => <option key={name}>{name}</option>)}
                            </select>
                          </TableCell>
                          <TableCell className="px-5 py-3 text-right">
                            <Button variant="ghost" size="sm" onClick={() => removeAdministrativePosition(row.id)}>Remove</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {activeStep.kind === "calendar" && activeDraft && (
                <div className="space-y-5">
                  <div className="grid gap-3 md:grid-cols-5">
                    <AdminTextField wrapperClassName="md:col-span-2" label="Academic year" value={yearDraft.name} onChange={(event) => setYearDraft({ ...yearDraft, name: event.target.value })} />
                    <AdminTextField label="Start date" type="date" value={yearDraft.startDate} onChange={(event) => setYearDraft({ ...yearDraft, startDate: event.target.value })} />
                    <AdminTextField label="End date" type="date" value={yearDraft.endDate} onChange={(event) => setYearDraft({ ...yearDraft, endDate: event.target.value })} />
                    <AdminTextField label="Number of terms" type="number" min="1" value={yearDraft.numberOfTerms} onChange={(event) => setYearDraft({ ...yearDraft, numberOfTerms: event.target.value })} />
                  </div>
                  <Button type="button" onClick={createAcademicYear} className="gap-1.5">
                    <Plus className="h-4 w-4" />
                    Create academic year
                  </Button>

                  {activeDraft.academicYears.map((year) => (
                    <div key={year.id} className="rounded-xl border border-border bg-surface p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <input className="h-9 rounded-md border border-border bg-card px-3 text-sm font-medium outline-none focus:border-primary/60" value={year.name} onChange={(event) => updateAcademicYear(year.id, { name: event.target.value })} />
                          <div className="mt-1 text-xs text-muted-foreground">{year.startDate} to {year.endDate} - {year.numberOfTerms} terms</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <StatusBadge tone={year.status === "Open" ? "success" : "neutral"}>{year.status}</StatusBadge>
                          <Button variant="outline" size="sm" onClick={() => updateAcademicYear(year.id, { status: year.status === "Open" ? "Closed" : "Open" })}>
                            {year.status === "Open" ? "Close academic year" : "Open academic year"}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteAcademicYear(year.id)}>Delete</Button>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 lg:grid-cols-3">
                        {year.terms.map((term) => (
                          <div key={term.id} className="rounded-lg border border-border bg-card p-3">
                            <div className="font-medium">{term.name}</div>
                            <div className="mt-3 grid gap-2">
                              <AdminTextField label="Start date" type="date" value={term.startDate} onChange={(event) => updateTerm(year.id, term.id, { startDate: event.target.value })} />
                              <AdminTextField label="End date" type="date" value={term.endDate} onChange={(event) => updateTerm(year.id, term.id, { endDate: event.target.value })} />
                            </div>
                            <div className="mt-3 rounded-md border border-border bg-surface p-2">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 text-xs font-medium">
                                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                  Events in the calendar
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => addTermEvent(year.id, term.id)}>Add</Button>
                              </div>
                              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
                                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => <div key={`${day}-${index}`}>{day}</div>)}
                                {Array.from({ length: 14 }, (_, index) => {
                                  const event = term.events[index % Math.max(term.events.length, 1)];
                                  return (
                                    <div key={index} className={`min-h-9 rounded border border-border bg-card p-1 ${event && index < term.events.length ? "text-primary" : ""}`}>
                                      {index + 1}
                                      {event && index < term.events.length && <div className="truncate text-[9px]">{event.title}</div>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {activeDraft.academicYears.length === 0 && (
                    <div className="rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
                      No academic years yet. Create one to unlock term configuration.
                    </div>
                  )}
                </div>
              )}

              {activeStep.kind === "plan" && (
                <div className="space-y-4">
                  <div className="grid gap-4 lg:grid-cols-3">
                    {billingPlans.map((plan) => {
                      const selected = selectedPlan === plan.id;
                      return (
                        <button
                          key={plan.id}
                          onClick={() => setSelectedPlan(plan.id)}
                          className={`rounded-xl border p-4 text-left transition ${selected ? "border-primary/50 bg-primary-soft" : "border-border bg-surface hover:bg-muted"}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-display text-lg font-semibold">{plan.name}</div>
                            {selected && <StatusBadge tone="primary">Selected</StatusBadge>}
                          </div>
                          <div className="mt-2 text-2xl font-semibold tabular-nums">KES {plan.monthly.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">per month - {plan.studentLimit} - {plan.campusLimit}</div>
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {modulesForPlan(plan.id).slice(0, 6).map((module) => <StatusBadge key={module} tone="neutral" dot={false}>{module}</StatusBadge>)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="max-w-xs">
                    <AdminSelectField label="Billing cycle" value={billingCycle} onChange={(event) => setBillingCycle(event.target.value as typeof billingCycle)}>
                      <option>Monthly</option>
                      <option>Termly</option>
                      <option>Annual</option>
                    </AdminSelectField>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-4 text-sm">
                    <div className="font-medium">{selectedPlanConfig.name} modules enabled based on the plan picked</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {modulesForPlan(selectedPlan).map((module) => <StatusBadge key={module} tone="success">{module}</StatusBadge>)}
                    </div>
                  </div>
                </div>
              )}

              {activeStep.kind === "publish" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-primary/20 bg-primary-soft p-4 text-sm text-primary">
                    Review all schools, then publish. Publishing creates or updates every configured school on the super admin schools side.
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow className="text-left text-[11px] uppercase tracking-wider text-muted-foreground hover:bg-transparent">
                        <TableHead className="px-5 py-2.5">School</TableHead>
                        <TableHead className="px-5 py-2.5">Profile</TableHead>
                        <TableHead className="px-5 py-2.5">Academic years</TableHead>
                        <TableHead className="px-5 py-2.5">Plan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {declaredSchools.map((school) => {
                        const draft = drafts[school.id] ?? makeDraftFromSchool(school);
                        return (
                          <TableRow key={school.id}>
                            <TableCell className="px-5 py-3">
                              <div className="font-medium">{draft.name}</div>
                              <div className="text-xs text-muted-foreground">{school.branchLabel}</div>
                            </TableCell>
                            <TableCell className="px-5 py-3">
                              <StatusBadge tone={configurationProgress(draft) >= 100 ? "success" : "warning"}>{configurationProgress(draft)}%</StatusBadge>
                            </TableCell>
                            <TableCell className="px-5 py-3">{draft.academicYears.length}</TableCell>
                            <TableCell className="px-5 py-3">{selectedPlan}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </SectionCard>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-3 shadow-card">
              <div className="text-sm text-muted-foreground">
                Step {stepIndex + 1} of {steps.length}
                {activeDraft && <span> - {currentProgress}% school completion</span>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>
                  Previous
                </Button>
                <Button onClick={saveAndContinue} className="gap-1.5">
                  {activeStep.kind === "publish" ? <Save className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {activeStep.kind === "publish" ? "Publish" : "Save and continue"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageBody>
    </>
  );
}
