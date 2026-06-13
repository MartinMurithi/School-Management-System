import { useEffect, useMemo, useState } from "react";
import {
  type BillingStatus,
  type SaaSInvoice,
  type SchoolTenant,
  type SubscriptionPlan,
  initialInvoices,
  initialSchools,
  planMrr,
  schoolPaymentStatus,
} from "@/lib/admin-data";

const invoicesKey = "schoolwise.admin.billing.invoices";
const paymentsKey = "schoolwise.admin.billing.payments";
const notesKey = "schoolwise.admin.billing.notes";

export type PlanConfig = {
  id: SubscriptionPlan;
  name: SubscriptionPlan;
  monthly: number;
  termly: number;
  annual: number;
  studentLimit: string;
  campusLimit: string;
  storage: string;
  modules: string[];
  support: string;
  status: "Active" | "Inactive";
};

export type BillingPayment = {
  id: string;
  schoolId: string;
  school: string;
  invoiceId: string;
  amount: number;
  method: SaaSInvoice["method"];
  reference: string;
  status: "Confirmed" | "Pending" | "Failed" | "Reversed" | "Unmatched";
  date: string;
  reconciliation: "Matched" | "Needs review" | "Unmatched";
};

export type BillingNote = {
  id: string;
  targetId: string;
  author: string;
  body: string;
  time: string;
};

export type InvoiceDraft = {
  schoolId: string;
  cycle: SaaSInvoice["cycle"];
  method: SaaSInvoice["method"];
  amount: string;
  dueDate: string;
};

export const billingPlans: PlanConfig[] = [
  {
    id: "Starter",
    name: "Starter",
    monthly: 12000,
    termly: 33000,
    annual: 118800,
    studentLimit: "Up to 300 students",
    campusLimit: "1 campus",
    storage: "10 GB",
    modules: ["Students", "Fees", "Basic reports"],
    support: "Email support",
    status: "Active",
  },
  {
    id: "Growth",
    name: "Growth",
    monthly: 32000,
    termly: 90000,
    annual: 316800,
    studentLimit: "Up to 1,000 students",
    campusLimit: "2 campuses",
    storage: "50 GB",
    modules: ["Students", "Finance", "M-PESA", "Exams", "CBC", "SMS"],
    support: "Priority support",
    status: "Active",
  },
  {
    id: "Scale",
    name: "Scale",
    monthly: 58000,
    termly: 165000,
    annual: 574200,
    studentLimit: "Unlimited students",
    campusLimit: "Unlimited campuses",
    storage: "250 GB",
    modules: ["All modules", "Transport", "HR", "Advanced analytics", "Dedicated onboarding"],
    support: "Dedicated success manager",
    status: "Active",
  },
];

const initialPayments: BillingPayment[] = [
  {
    id: "PAY-2026-1881",
    schoolId: "mwangaza-academy",
    school: "Mwangaza Academy",
    invoiceId: "INV-2026-0421",
    amount: 32000,
    method: "M-PESA",
    reference: "QEM42Y7K9A",
    status: "Confirmed",
    date: "May 12, 2026",
    reconciliation: "Matched",
  },
  {
    id: "PAY-2026-1880",
    schoolId: "thika-valley-school",
    school: "Thika Valley School",
    invoiceId: "INV-2026-0420",
    amount: 696000,
    method: "Bank",
    reference: "BT-991820-TVS",
    status: "Confirmed",
    date: "May 11, 2026",
    reconciliation: "Matched",
  },
  {
    id: "PAY-2026-1874",
    schoolId: "eldoret-highlands-secondary",
    school: "Eldoret Highlands Secondary",
    invoiceId: "INV-2026-0419",
    amount: 174000,
    method: "M-PESA",
    reference: "QEL88C1L2K",
    status: "Pending",
    date: "May 20, 2026",
    reconciliation: "Needs review",
  },
  {
    id: "PAY-2026-1868",
    schoolId: "meru-vision-schools",
    school: "Meru Vision Schools",
    invoiceId: "INV-2026-0418",
    amount: 0,
    method: "Bank",
    reference: "No payment received",
    status: "Failed",
    date: "Apr 29, 2026",
    reconciliation: "Unmatched",
  },
];

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

export function subscriptionAmount(plan: SubscriptionPlan, cycle: SaaSInvoice["cycle"]) {
  const planConfig = billingPlans.find((item) => item.id === plan);
  if (!planConfig) return planMrr(plan);
  if (cycle === "Annual") return planConfig.annual;
  if (cycle === "Termly") return planConfig.termly;
  return planConfig.monthly;
}

export function subscriptionStatus(school: SchoolTenant) {
  if (school.status === "Suspended") return "Suspended";
  if (school.status === "Expired") return "Expired";
  if (school.status === "Trial") return "Trial";
  if (schoolPaymentStatus(school) === "Overdue") return "Overdue";
  return "Active";
}

export function billingRisk(status: BillingStatus) {
  if (status === "Overdue") return "High";
  if (status === "Pending") return "Medium";
  if (status === "Draft") return "Low";
  return "Healthy";
}

export function useAdminBillingStore() {
  const [invoices, setInvoices] = useState<SaaSInvoice[]>(initialInvoices);
  const [payments, setPayments] = useState<BillingPayment[]>(initialPayments);
  const [notes, setNotes] = useState<BillingNote[]>([]);

  useEffect(() => {
    setInvoices(readStoredArray(invoicesKey, initialInvoices));
    setPayments(readStoredArray(paymentsKey, initialPayments));
    setNotes(readStoredArray(notesKey, []));
  }, []);

  useEffect(() => writeStoredArray(invoicesKey, invoices), [invoices]);
  useEffect(() => writeStoredArray(paymentsKey, payments), [payments]);
  useEffect(() => writeStoredArray(notesKey, notes), [notes]);

  function createInvoice(draft: InvoiceDraft, schools = initialSchools) {
    const school = schools.find((item) => item.id === draft.schoolId) ?? schools[0];
    const invoice: SaaSInvoice = {
      id: `INV-2026-${String(4300 + invoices.length).padStart(4, "0")}`,
      schoolId: school.id,
      school: school.name,
      cycle: draft.cycle,
      method: draft.method,
      amount: Number(draft.amount) || subscriptionAmount(school.plan, draft.cycle),
      status: "Draft",
      grace: "Not sent",
      dueDate: draft.dueDate,
    };
    setInvoices((current) => [invoice, ...current]);
    return invoice;
  }

  function updateInvoice(invoiceId: string, changes: Partial<SaaSInvoice>) {
    setInvoices((current) => current.map((invoice) => (invoice.id === invoiceId ? { ...invoice, ...changes } : invoice)));
  }

  function sendInvoice(invoiceId: string) {
    updateInvoice(invoiceId, { status: "Pending", grace: "14d left" });
  }

  function markInvoicePaid(invoice: SaaSInvoice, reference = `MANUAL-${Date.now()}`) {
    updateInvoice(invoice.id, { status: "Paid", grace: "-" });
    const payment: BillingPayment = {
      id: `PAY-2026-${String(1900 + payments.length).padStart(4, "0")}`,
      schoolId: invoice.schoolId,
      school: invoice.school,
      invoiceId: invoice.id,
      amount: invoice.amount,
      method: invoice.method,
      reference,
      status: "Confirmed",
      date: nowLabel(),
      reconciliation: "Matched",
    };
    setPayments((current) => [payment, ...current]);
    return payment;
  }

  function recordPayment(payment: BillingPayment) {
    setPayments((current) => [payment, ...current]);
    return payment;
  }

  function addNote(targetId: string, body: string, author = "Jane Mwangi") {
    const note: BillingNote = {
      id: `${targetId}-${Date.now()}`,
      targetId,
      author,
      body,
      time: nowLabel(),
    };
    setNotes((current) => [note, ...current]);
    return note;
  }

  const metrics = useMemo(() => {
    const paid = invoices.filter((invoice) => invoice.status === "Paid").reduce((sum, invoice) => sum + invoice.amount, 0);
    const pending = invoices.filter((invoice) => invoice.status === "Pending").reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = invoices.filter((invoice) => invoice.status === "Overdue").reduce((sum, invoice) => sum + invoice.amount, 0);
    const mrr = initialSchools.filter((school) => school.status === "Active").reduce((sum, school) => sum + school.mrr, 0);
    return {
      paid,
      pending,
      overdue,
      mrr,
      arr: mrr * 12,
      collectionRate: invoices.length ? Math.round((invoices.filter((invoice) => invoice.status === "Paid").length / invoices.length) * 100) : 0,
    };
  }, [invoices]);

  return {
    invoices,
    payments,
    notes,
    plans: billingPlans,
    metrics,
    createInvoice,
    updateInvoice,
    sendInvoice,
    markInvoicePaid,
    recordPayment,
    addNote,
  };
}
