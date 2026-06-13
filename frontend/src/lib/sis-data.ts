import { UserCheck, UserRound, Users, ArrowRightLeft, GraduationCap } from "lucide-react";

export type SisModule = {
  slug: string;
  title: string;
  shortLabel: string;
  description: string;
  to:
    | "/school/students"
    | "/school/students/admissions"
    | "/school/students/guardians"
    | "/school/students/transfers";
  icon: typeof UserRound;
};

export const sisModules: SisModule[] = [
  {
    slug: "directory",
    title: "Student Directory",
    shortLabel: "Directory",
    description: "Central operational student database and profile access.",
    to: "/school/students",
    icon: UserRound,
  },
  {
    slug: "admissions",
    title: "Student Admissions",
    shortLabel: "Admissions",
    description: "Applications, document review, approval, and enrollment triggering.",
    to: "/school/students/admissions",
    icon: UserCheck,
  },
  {
    slug: "guardians",
    title: "Guardian Management",
    shortLabel: "Guardians",
    description: "Guardian linking, billing responsibility, and portal/communication controls.",
    to: "/school/students/guardians",
    icon: Users,
  },
  {
    slug: "transfers",
    title: "Student Transfers",
    shortLabel: "Transfers",
    description: "Internal and external transfer workflows, clearances, and archives.",
    to: "/school/students/transfers",
    icon: ArrowRightLeft,
  },
];

export const sisFlow = [
  "Application",
  "Admission Review",
  "Enrollment",
  "Student Profile Creation",
  "Class Assignment",
  "Guardian Linking",
  "Fee Billing",
  "Attendance & Academics",
  "Transfers/Progression",
  "Alumni Status",
];

export const applicationPipeline = [
  { applicant: "Mercy Njeri", classTarget: "Grade 7", status: "Submitted", documents: "3/4" },
  { applicant: "Kevin Mutiso", classTarget: "Form 1", status: "Review", documents: "4/4" },
  { applicant: "Hilda Chebet", classTarget: "JSS 2", status: "Accepted", documents: "4/4" },
  { applicant: "Noah Kariuki", classTarget: "Grade 5", status: "Rejected", documents: "2/4" },
];

export const guardians = [
  { learner: "Aisha Mwende", guardian: "Mary Mwende", relation: "Mother", billing: "100%", channel: "SMS + Email", portal: "Active" },
  { learner: "Brian Otieno", guardian: "Peter Otieno", relation: "Father", billing: "70%", channel: "SMS", portal: "Active" },
  { learner: "Faith Wanjiru", guardian: "James Wanjiru", relation: "Uncle", billing: "100%", channel: "Email", portal: "Invited" },
];

export const transfers = [
  { learner: "Daniel Kiprop", move: "JSS 1 North -> JSS 1 East", type: "Internal", status: "Cleared" },
  { learner: "Esther Achieng", move: "Form 4 Red -> Exit", type: "External", status: "Pending" },
  { learner: "George Mutua", move: "Form 3 Green -> Alumni", type: "Progression", status: "Archived" },
];

export const alumniSignals = [
  { label: "Expected graduations", value: "96" },
  { label: "Completed transfers", value: "22" },
  { label: "Alumni this year", value: "104" },
  { label: "Pending clearances", value: "8" },
];

export const profileDocuments = [
  "Birth certificate",
  "KCPE results",
  "Transfer letter",
  "Medical declaration",
];

export const profileMedical = [
  { label: "Allergies", value: "None reported" },
  { label: "Conditions", value: "No chronic condition on file" },
  { label: "Emergency contact", value: "Mary Mwende (+254 712 404 112)" },
];

export const academicHistory = [
  { term: "2026 Term 1", class: "Grade 4 East", performance: "A-", status: "Promoted" },
  { term: "2025 Term 3", class: "Grade 3 East", performance: "B+", status: "Completed" },
  { term: "2025 Term 2", class: "Grade 3 East", performance: "B", status: "Completed" },
];

export const attendanceSignals = [
  { week: "Week 1", rate: 100 },
  { week: "Week 2", rate: 96 },
  { week: "Week 3", rate: 93 },
  { week: "Week 4", rate: 98 },
];

export const academicsSignals = [
  { label: "Assessments completed", value: "12" },
  { label: "CBC competencies", value: "8/10 achieved" },
  { label: "Current class rank", value: "7 of 38" },
  { label: "Interventions", value: "1 active" },
];

export const financeSignals = [
  { label: "Outstanding balance", value: "KES 4,500" },
  { label: "Invoices this term", value: "3" },
  { label: "Receipts posted", value: "6" },
  { label: "Last receipt", value: "SHB4XK19P" },
];

export const admissionsWorkflow = [
  "Applicant submits form",
  "Registrar reviews",
  "Accepted/Rejected",
  "Student profile created",
  "Billing triggered",
];

export const profileTimelineSeed = [
  { title: "Admission accepted", detail: "Profile created and linked to Grade 4 East", tone: "success" as const },
  { title: "Guardian linked", detail: "Primary billing guardian assigned", tone: "info" as const },
  { title: "Fee invoice generated", detail: "Term 2 invoice issued", tone: "primary" as const },
  { title: "Attendance watch", detail: "No active alerts", tone: "success" as const },
];

export const sisOutputFeeds = ["Finance", "Exams", "Attendance", "CBC", "NEMIS exports", "Report cards"];

export const alumniStages = [
  { stage: "Graduation checklist", owner: "Registrar", state: "In progress" },
  { stage: "Clearance", owner: "Finance", state: "Pending" },
  { stage: "Archive and alumni", owner: "SIS", state: "Queued" },
  { stage: "Portal handoff", owner: "ICT", state: "Ready" },
];

export const progressionActions = [
  { action: "Promote to next class", volume: "118 learners", tone: "success" as const },
  { action: "Handle repeat-year", volume: "7 learners", tone: "warning" as const },
  { action: "Graduate and mark alumni", volume: "96 learners", tone: "primary" as const },
  { action: "External transfer out", volume: "11 learners", tone: "info" as const },
];

export const sisKpis = [
  { label: "Active learners", value: "1,284" },
  { label: "Pending admissions", value: "42" },
  { label: "Guardians linked", value: "2,146" },
  { label: "Transfer cases", value: "19" },
  { label: "Alumni records", value: "612" },
];

export const sisHeroLabel = "Core School Engine";
export const sisHeroTitle = "Student Information System (SIS)";
export const sisHeroDescription = "The central operational database where every student process begins and flows into all academic and operational modules.";
