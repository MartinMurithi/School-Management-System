import { useEffect, useMemo, useState } from "react";
import {
  type AuditEvent,
  type BillingStatus,
  type OnboardingAccount,
  type SchoolTenant,
  type SubscriptionPlan,
  type TenantStatus,
  initialAuditEvents,
  initialSchools,
  makeId,
  planMrr,
} from "@/lib/admin-data";

const schoolsKey = "schoolwise.admin.schools";
const auditKey = "schoolwise.admin.audit-events";

type SchoolDraft = {
  name: string;
  type: SchoolTenant["type"];
  county: string;
  curriculum: string;
  owner: string;
  email: string;
  phone: string;
  students: string;
  branches: string;
  plan: SubscriptionPlan;
  billingCycle: SchoolTenant["billingCycle"];
  status: TenantStatus;
  tenancyId?: string;
  tenancyName?: string;
  registrationNumber?: string;
  ministryRegNumber?: string;
  subCounty?: string;
  ownershipType?: SchoolTenant["ownershipType"];
  branchLabel?: string;
};

function readStoredArray<T>(key: string, fallback: T[]) {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredArray<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function nowLabel() {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

export const emptySchoolDraft: SchoolDraft = {
  name: "",
  type: "Primary",
  county: "Nairobi",
  curriculum: "CBC",
  owner: "",
  email: "",
  phone: "",
  students: "0",
  branches: "1",
  plan: "Starter",
  billingCycle: "Monthly",
  status: "Trial",
};

export function useAdminSchoolStore() {
  const [schools, setSchools] = useState<SchoolTenant[]>(initialSchools);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);

  useEffect(() => {
    setSchools(readStoredArray(schoolsKey, initialSchools));
    setAuditEvents(readStoredArray(auditKey, initialAuditEvents));
  }, []);

  useEffect(() => {
    writeStoredArray(schoolsKey, schools);
  }, [schools]);

  useEffect(() => {
    writeStoredArray(auditKey, auditEvents);
  }, [auditEvents]);

  function recordAudit(schoolId: string, action: string, detail: string, actor = "Jane Mwangi") {
    const event: AuditEvent = {
      id: `${schoolId}-${Date.now()}`,
      schoolId,
      actor,
      action,
      detail,
      time: nowLabel(),
    };
    setAuditEvents((current) => {
      const next = [event, ...current];
      writeStoredArray(auditKey, next);
      return next;
    });
    return event;
  }

  function addSchool(draft: SchoolDraft) {
    const id = makeId(draft.name);
    if (!id) return null;

    const school: SchoolTenant = {
      id,
      name: draft.name,
      tenancyId: draft.tenancyId,
      tenancyName: draft.tenancyName,
      registrationNumber: draft.registrationNumber,
      ministryRegNumber: draft.ministryRegNumber,
      subCounty: draft.subCounty,
      ownershipType: draft.ownershipType,
      branchLabel: draft.branchLabel,
      type: draft.type,
      county: draft.county,
      curriculum: draft.curriculum,
      students: Number(draft.students) || 0,
      users: 1,
      plan: draft.plan,
      mrr: draft.status === "Trial" ? 0 : planMrr(draft.plan),
      status: draft.status,
      paymentStatus: draft.status === "Trial" ? "Draft" : "Paid",
      billingCycle: draft.billingCycle,
      onboarding: 20,
      onboardingStage: "Tenant creation",
      isolation: "Verified",
      owner: draft.owner,
      phone: draft.phone,
      email: draft.email,
      subdomain: `${id}.schoolwise.co.ke`,
      branches: Number(draft.branches) || 1,
      supportOwner: "Unassigned",
      lastActivity: "Just now",
      trialEnds: draft.status === "Trial" ? "14 days" : undefined,
      modules: ["Students", "Finance"],
    };

    setSchools((current) => {
      const next = [school, ...current.filter((item) => item.id !== id)];
      writeStoredArray(schoolsKey, next);
      return next;
    });
    recordAudit(id, "Tenant created", "Created school tenant, initialized default settings, and started onboarding.");
    return school;
  }

  function addSchoolsFromTenant(account: OnboardingAccount) {
    const tenantSchools = account.schools ?? [];
    const createdSchools = tenantSchools.map((tenantSchool, index) => {
      const id = tenantSchool.id || makeId(`${account.id}-${tenantSchool.name}`) || `${account.id}-school-${index + 1}`;
      const school: SchoolTenant = {
        id,
        name: tenantSchool.name,
        tenancyId: account.id,
        tenancyName: account.tenancyName ?? account.school,
        registrationNumber: account.registrationNumber,
        ministryRegNumber: account.ministryRegNumber,
        subCounty: tenantSchool.subCounty || account.subCounty,
        ownershipType: account.ownershipType,
        branchLabel: tenantSchool.branchLabel,
        type: tenantSchool.type ?? account.schoolType ?? "Primary",
        county: tenantSchool.county || account.county || "Nairobi",
        curriculum: account.curriculum ?? "CBC",
        students: tenantSchool.students ?? account.expectedStudents ?? 0,
        users: 1,
        plan: "Starter",
        mrr: planMrr("Starter"),
        status: tenantSchool.status,
        paymentStatus: "Paid",
        billingCycle: "Monthly",
        onboarding: 100,
        onboardingStage: "Live",
        isolation: "Verified",
        owner: account.contactDetails?.primaryContactName ?? account.owner,
        phone: account.contactDetails?.phone ?? account.phone ?? "",
        email: account.contactDetails?.email ?? account.email ?? "",
        subdomain: `${id}.schoolwise.co.ke`,
        branches: tenantSchools.length,
        supportOwner: account.supportOwner ?? "Super admin",
        lastActivity: "Just now",
        modules: ["Students", "Finance"],
      };
      return school;
    });

    if (createdSchools.length === 0) return [];

    setSchools((current) => {
      const createdIds = new Set(createdSchools.map((school) => school.id));
      const next = [...createdSchools, ...current.filter((school) => !createdIds.has(school.id))];
      writeStoredArray(schoolsKey, next);
      return next;
    });
    createdSchools.forEach((school) => {
      recordAudit(school.id, "School listed from tenant onboarding", `${school.name} was listed on the schools side (/admin/schools) under ${account.tenancyName ?? account.school}.`);
    });
    return createdSchools;
  }

  function updateSchool(schoolId: string, changes: Partial<SchoolTenant>, action: string, detail: string) {
    setSchools((current) => {
      const next = current.map((school) =>
        school.id === schoolId
          ? {
              ...school,
              ...changes,
              lastActivity: "Just now",
            }
          : school,
      );
      writeStoredArray(schoolsKey, next);
      return next;
    });
    recordAudit(schoolId, action, detail);
  }

  function upsertSchool(school: SchoolTenant, action = "School configured", detail = "School profile and academic structure configured by tenant.") {
    setSchools((current) => {
      const exists = current.some((item) => item.id === school.id);
      const next = exists
        ? current.map((item) =>
            item.id === school.id
              ? {
                  ...item,
                  ...school,
                  lastActivity: "Just now",
                }
              : item,
          )
        : [school, ...current];
      writeStoredArray(schoolsKey, next);
      return next;
    });
    recordAudit(school.id, action, detail);
    return school;
  }

  function changeStatus(school: SchoolTenant, nextStatus: TenantStatus, reason: string) {
    const isolation = nextStatus === "Suspended" ? "Read-only" : nextStatus === "Archived" ? "Archived" : "Verified";
    const paymentStatus: BillingStatus =
      nextStatus === "Suspended" || nextStatus === "Expired" ? "Overdue" : nextStatus === "Trial" ? "Draft" : "Paid";

    updateSchool(
      school.id,
      {
        status: nextStatus,
        isolation,
        paymentStatus,
        users: nextStatus === "Suspended" || nextStatus === "Archived" ? 0 : Math.max(school.users, 1),
      },
      `Tenant ${nextStatus.toLowerCase()}`,
      reason,
    );
  }

  function changePlan(school: SchoolTenant, plan: SubscriptionPlan, billingCycle: SchoolTenant["billingCycle"]) {
    updateSchool(
      school.id,
      {
        plan,
        billingCycle,
        mrr: school.status === "Trial" ? 0 : planMrr(plan),
      },
      "Subscription updated",
      `Changed plan to ${plan} with ${billingCycle?.toLowerCase()} billing.`,
    );
  }

  function setModule(school: SchoolTenant, moduleName: string, enabled: boolean) {
    const modules = new Set(school.modules ?? []);
    if (enabled) modules.add(moduleName);
    else modules.delete(moduleName);
    updateSchool(
      school.id,
      { modules: Array.from(modules) },
      enabled ? "Module enabled" : "Module disabled",
      `${enabled ? "Enabled" : "Disabled"} ${moduleName} module.`,
    );
  }

  const totals = useMemo(
    () => ({
      active: schools.filter((school) => school.status === "Active").length,
      trial: schools.filter((school) => school.status === "Trial").length,
      suspended: schools.filter((school) => school.status === "Suspended").length,
      archived: schools.filter((school) => school.status === "Archived").length,
    }),
    [schools],
  );

  return {
    schools,
    auditEvents,
    totals,
    addSchool,
    addSchoolsFromTenant,
    updateSchool,
    upsertSchool,
    changeStatus,
    changePlan,
    setModule,
    recordAudit,
  };
}
