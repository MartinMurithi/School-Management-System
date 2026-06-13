import { useEffect, useMemo, useState } from "react";
import {
  type OnboardingAccount,
  type OnboardingAuditEvent,
  type OnboardingStage,
  type OnboardingStatus,
  type OwnershipType,
  type TenantInvoice,
  initialOnboardingAccounts,
  initialOnboardingAuditEvents,
  makeId,
} from "@/lib/admin-data";

const onboardingKey = "schoolwise.admin.onboarding";
const onboardingAuditKey = "schoolwise.admin.onboarding-audit";

export type OnboardingDraft = {
  tenancyName: string;
  registrationNumber: string;
  ministryRegNumber: string;
  county: string;
  subCounty: string;
  numberOfSchoolsUnderTenancy: string;
  ownershipType: OwnershipType;
  primaryContactName: string;
  primaryContactRole: string;
  email: string;
  phone: string;
  alternatePhone: string;
  postalAddress: string;
  physicalAddress: string;
  billingContactName: string;
  billingEmail: string;
  billingPhone: string;
  mouDocumentName: string;
  schoolNames: string;
  schoolType: OnboardingAccount["schoolType"];
  expectedStudents: string;
};

export const emptyOnboardingDraft: OnboardingDraft = {
  tenancyName: "",
  registrationNumber: "",
  ministryRegNumber: "",
  county: "Nairobi",
  subCounty: "",
  numberOfSchoolsUnderTenancy: "1",
  ownershipType: "Private",
  primaryContactName: "",
  primaryContactRole: "Owner",
  email: "",
  phone: "",
  alternatePhone: "",
  postalAddress: "",
  physicalAddress: "",
  billingContactName: "",
  billingEmail: "",
  billingPhone: "",
  mouDocumentName: "MOU between the system and the Tenancy",
  schoolNames: "",
  schoolType: "Primary",
  expectedStudents: "0",
};

export const onboardingStages: OnboardingStage[] = [
  "Registration",
  "Tenant creation",
  "Setup wizard",
  "Data import",
  "Activation",
  "Live",
];

export const onboardingStageProgress: Record<OnboardingStage, number> = {
  Registration: 18,
  "Tenant creation": 35,
  "Setup wizard": 55,
  "Data import": 76,
  Activation: 92,
  Live: 100,
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

function mergeSeededById<T extends { id: string }>(stored: T[], seeded: T[]) {
  const storedIds = new Set(stored.map((item) => item.id));
  return [...seeded.filter((item) => !storedIds.has(item.id)), ...stored];
}

function nowLabel() {
  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date());
}

export function onboardingStatusTone(status: OnboardingStatus) {
  if (status === "Active") return "success" as const;
  if (status === "Demo") return "info" as const;
  if (status === "Trial" || status === "Guided setup") return "warning" as const;
  if (status === "Expired" || status === "Cancelled" || status === "Deactivated") return "danger" as const;
  return "neutral" as const;
}

function cleanSchoolNames(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function makeTemporaryPassword(id: string) {
  const suffix = id.replace(/[^a-z0-9]/g, "").slice(0, 4).toUpperCase() || "2026";
  return `Tenant-${suffix}!`;
}

function makeTenantSchools(draft: OnboardingDraft, tenantId: string) {
  const count = Math.max(1, Number(draft.numberOfSchoolsUnderTenancy) || 1);
  const providedNames = cleanSchoolNames(draft.schoolNames);
  return Array.from({ length: count }, (_, index) => {
    const fallbackName = count === 1 ? draft.tenancyName : `${draft.tenancyName} Branch ${index + 1}`;
    const name = providedNames[index] || fallbackName;
    const id = makeId(`${tenantId}-${name}`) || `${tenantId}-school-${index + 1}`;
    return {
      id,
      name,
      county: draft.county,
      subCounty: draft.subCounty,
      type: draft.schoolType,
      students: Number(draft.expectedStudents) || 0,
      branchLabel: index === 0 ? "Main school" : `Branch ${index + 1}`,
      status: "Active" as const,
    };
  });
}

export function useAdminOnboardingStore() {
  const [accounts, setAccounts] = useState<OnboardingAccount[]>(initialOnboardingAccounts);
  const [auditEvents, setAuditEvents] = useState<OnboardingAuditEvent[]>(initialOnboardingAuditEvents);

  useEffect(() => {
    setAccounts(mergeSeededById(readStoredArray(onboardingKey, initialOnboardingAccounts), initialOnboardingAccounts));
    setAuditEvents(mergeSeededById(readStoredArray(onboardingAuditKey, initialOnboardingAuditEvents), initialOnboardingAuditEvents));
  }, []);

  useEffect(() => {
    writeStoredArray(onboardingKey, accounts);
  }, [accounts]);

  useEffect(() => {
    writeStoredArray(onboardingAuditKey, auditEvents);
  }, [auditEvents]);

  function recordAudit(onboardingId: string, action: string, detail: string, actor = "Jane Mwangi") {
    const event: OnboardingAuditEvent = {
      id: `${onboardingId}-${Date.now()}`,
      onboardingId,
      actor,
      action,
      detail,
      time: nowLabel(),
    };
    setAuditEvents((current) => {
      const next = [event, ...current];
      writeStoredArray(onboardingAuditKey, next);
      return next;
    });
    return event;
  }

  function createOnboarding(draft: OnboardingDraft) {
    const id = makeId(draft.tenancyName);
    if (!id) return null;
    const schools = makeTenantSchools(draft, id);
    const credentials = {
      loginUrl: `https://${id}.schoolwise.co.ke/login`,
      username: draft.email,
      temporaryPassword: makeTemporaryPassword(id),
    };
    const emailRecord = {
      to: draft.email,
      subject: `Tenant account created for ${draft.tenancyName}`,
      body: [
        `Your tenant account has been created for ${draft.tenancyName}.`,
        `Login URL: ${credentials.loginUrl}`,
        `Username: ${credentials.username}`,
        `Temporary password: ${credentials.temporaryPassword}`,
      ].join("\n"),
      sentAt: nowLabel(),
    };

    const account: OnboardingAccount = {
      id,
      school: schools[0]?.name ?? draft.tenancyName,
      tenancyName: draft.tenancyName,
      registrationNumber: draft.registrationNumber,
      ministryRegNumber: draft.ministryRegNumber,
      subCounty: draft.subCounty,
      numberOfSchoolsUnderTenancy: schools.length,
      ownershipType: draft.ownershipType,
      contactDetails: {
        primaryContactName: draft.primaryContactName,
        primaryContactRole: draft.primaryContactRole,
        email: draft.email,
        phone: draft.phone,
        alternatePhone: draft.alternatePhone,
        postalAddress: draft.postalAddress,
        physicalAddress: draft.physicalAddress,
        billingContactName: draft.billingContactName || draft.primaryContactName,
        billingEmail: draft.billingEmail || draft.email,
        billingPhone: draft.billingPhone || draft.phone,
      },
      documents: [{ name: draft.mouDocumentName || "MOU between the system and the Tenancy", type: "MOU", status: "Uploaded" }],
      schools,
      credentials,
      emailRecord,
      invoices: [],
      owner: draft.primaryContactName,
      email: draft.email,
      phone: draft.phone,
      county: draft.county,
      schoolType: draft.schoolType,
      curriculum: "CBC",
      expectedStudents: Number(draft.expectedStudents) || 0,
      branches: schools.length,
      supportOwner: "Super admin",
      template: schools.length > 1 ? "Multi-branch private school" : "CBC Primary",
      progress: onboardingStageProgress.Live,
      stage: "Live",
      trialEnds: "-",
      status: "Active",
      tenantId: id,
      lastActivity: "Just now",
      blockers: [],
    };

    setAccounts((current) => {
      const next = [account, ...current.filter((item) => item.id !== id)];
      writeStoredArray(onboardingKey, next);
      return next;
    });
    recordAudit(id, "Onboarding of a tenant sent", "Captured tenancy profile, detailed contacts, and Documents upload (MOU between the system and the Tenancy).");
    recordAudit(id, "Tenant account created", `Created account for ${draft.tenancyName} and displayed login credentials to the super admin.`);
    recordAudit(id, "Email sent to tenant", `Sent login credentials to ${draft.email}.`);
    return account;
  }

  function updateOnboarding(onboardingId: string, changes: Partial<OnboardingAccount>, action: string, detail: string) {
    setAccounts((current) => {
      const next = current.map((account) =>
        account.id === onboardingId
          ? {
              ...account,
              ...changes,
              lastActivity: "Just now",
            }
          : account,
      );
      writeStoredArray(onboardingKey, next);
      return next;
    });
    recordAudit(onboardingId, action, detail);
  }

  function advanceStage(account: OnboardingAccount) {
    const index = onboardingStages.indexOf(account.stage);
    const nextStage = onboardingStages[Math.min(index + 1, onboardingStages.length - 1)];
    const nextStatus = nextStage === "Live" ? "Active" : account.status === "Demo" ? "Trial" : account.status;

    updateOnboarding(
      account.id,
      {
        stage: nextStage,
        progress: Math.max(account.progress, onboardingStageProgress[nextStage]),
        status: nextStatus,
        tenantId: account.tenantId ?? (nextStage === "Tenant creation" ? account.id : account.tenantId),
      },
      "Onboarding advanced",
      `Moved from ${account.stage} to ${nextStage}.`,
    );
  }

  function completeStep(account: OnboardingAccount, stage: OnboardingStage) {
    updateOnboarding(
      account.id,
      {
        stage,
        progress: Math.max(account.progress, onboardingStageProgress[stage]),
        status: stage === "Live" ? "Active" : account.status,
      },
      "Checklist step completed",
      `Completed ${stage} checklist step.`,
    );
  }

  function addBlocker(account: OnboardingAccount, title: string) {
    const blocker = { id: makeId(title) || `blocker-${Date.now()}`, title, status: "Open" as const };
    updateOnboarding(
      account.id,
      { blockers: [blocker, ...(account.blockers ?? [])] },
      "Blocker added",
      title,
    );
  }

  function resolveBlocker(account: OnboardingAccount, blockerId: string) {
    updateOnboarding(
      account.id,
      {
        blockers: (account.blockers ?? []).map((blocker) =>
          blocker.id === blockerId ? { ...blocker, status: "Resolved" } : blocker,
        ),
      },
      "Blocker resolved",
      `Resolved blocker ${blockerId}.`,
    );
  }

  function addInvoice(account: OnboardingAccount, invoice: Omit<TenantInvoice, "id" | "invoiceNumber" | "status">) {
    const invoiceNumber = `TEN-INV-${String((account.invoices?.length ?? 0) + 1).padStart(4, "0")}`;
    const tenantInvoice: TenantInvoice = {
      ...invoice,
      id: `${account.id}-${invoiceNumber.toLowerCase()}`,
      invoiceNumber,
      status: "Pending",
    };
    updateOnboarding(
      account.id,
      { invoices: [tenantInvoice, ...(account.invoices ?? [])] },
      "Add invoice",
      `Generated ${invoiceNumber} for ${account.tenancyName ?? account.school}.`,
    );
    return tenantInvoice;
  }

  function cancelInvoice(account: OnboardingAccount, invoiceId: string, reason: string) {
    updateOnboarding(
      account.id,
      {
        invoices: (account.invoices ?? []).map((invoice) =>
          invoice.id === invoiceId ? { ...invoice, status: "Cancelled" } : invoice,
        ),
      },
      "Cancel invoice",
      reason,
    );
  }

  const totals = useMemo(
    () => ({
      active: accounts.filter((account) => account.status === "Active").length,
      demo: accounts.filter((account) => account.status === "Demo").length,
      trial: accounts.filter((account) => account.status === "Trial").length,
      deactivated: accounts.filter((account) => account.status === "Deactivated").length,
      blocked: accounts.filter((account) => (account.blockers ?? []).some((blocker) => blocker.status !== "Resolved")).length,
    }),
    [accounts],
  );

  return {
    accounts,
    auditEvents,
    totals,
    createOnboarding,
    updateOnboarding,
    advanceStage,
    completeStep,
    addBlocker,
    resolveBlocker,
    addInvoice,
    cancelInvoice,
    recordAudit,
  };
}
