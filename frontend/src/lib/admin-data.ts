export type TenantStatus = "Active" | "Trial" | "Suspended" | "Expired" | "Archived";
export type SubscriptionPlan = "Starter" | "Growth" | "Scale";
export type BillingStatus = "Paid" | "Pending" | "Overdue" | "Draft";
export type TicketPriority = "Urgent" | "High" | "Normal" | "Low";
export type AnnouncementStatus = "Draft" | "Scheduled" | "Sent";
export type OnboardingStage = "Registration" | "Tenant creation" | "Setup wizard" | "Data import" | "Activation" | "Live";
export type OnboardingStatus = "Demo" | "Trial" | "Guided setup" | "Active" | "Deactivated" | "Cancelled" | "Expired";
export type OwnershipType = "Private" | "Public" | "Sponsored";
export type TenantInvoiceStatus = "Draft" | "Pending" | "Paid" | "Cancelled";
export type SchoolMode = "Day" | "Boarding" | "Both";
export type SchoolCurriculum = "CBC" | "8-4-4" | "GSCE";
export type ConfiguredClass = {
  name: string;
  streams: string[];
};
export type AdministrativePosition = {
  position: string;
  staffName: string;
  seniority: number;
};
export type AcademicCalendarEvent = {
  id: string;
  title: string;
  date: string;
};
export type AcademicTermConfig = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  events: AcademicCalendarEvent[];
};
export type AcademicYearConfig = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  numberOfTerms: number;
  status: "Open" | "Closed";
  terms: AcademicTermConfig[];
};

export type SchoolTenant = {
  id: string;
  name: string;
  tenancyId?: string;
  tenancyName?: string;
  registrationNumber?: string;
  ministryRegNumber?: string;
  subCounty?: string;
  ownershipType?: OwnershipType;
  branchLabel?: string;
  type?: "Primary" | "Secondary" | "Junior School" | "Mixed" | "Junior Secondary" | "Senior Secondary";
  logoName?: string;
  motto?: string;
  vision?: string;
  mission?: string;
  nemisCode?: string;
  mode?: SchoolMode;
  configured?: boolean;
  configuredAt?: string;
  configuredByTenant?: string;
  configuredClasses?: ConfiguredClass[];
  configuredSubjects?: string[];
  configuredDepartments?: string[];
  administrativeStructure?: AdministrativePosition[];
  academicYears?: AcademicYearConfig[];
  county: string;
  curriculum: string;
  students: number;
  users: number;
  plan: SubscriptionPlan;
  mrr: number;
  status: TenantStatus;
  paymentStatus?: BillingStatus;
  billingCycle?: "Monthly" | "Termly" | "Annual";
  onboarding: number;
  onboardingStage?: "Registration" | "Tenant creation" | "Setup wizard" | "Data import" | "Activation" | "Live";
  isolation: "Verified" | "Read-only" | "Archived";
  owner: string;
  phone: string;
  email: string;
  subdomain: string;
  branches?: number;
  supportOwner?: string;
  lastActivity?: string;
  trialEnds?: string;
  modules?: string[];
};

export type TenantContactDetails = {
  primaryContactName: string;
  primaryContactRole: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  postalAddress?: string;
  physicalAddress?: string;
  billingContactName?: string;
  billingEmail?: string;
  billingPhone?: string;
};

export type TenantBranchSchool = {
  id: string;
  name: string;
  county: string;
  subCounty: string;
  type: SchoolTenant["type"];
  students: number;
  branchLabel: string;
  status: TenantStatus;
  configured?: boolean;
};

export type TenantCredentials = {
  loginUrl: string;
  username: string;
  temporaryPassword: string;
};

export type TenantDocument = {
  name: string;
  type: string;
  status: "Uploaded" | "Pending";
};

export type TenantEmailRecord = {
  to: string;
  subject: string;
  body: string;
  sentAt: string;
};

export type TenantInvoice = {
  id: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  billTo: string;
  lineItems: string;
  amount: number;
  tax: number;
  total: number;
  status: TenantInvoiceStatus;
  notes?: string;
};

export type SaaSInvoice = {
  id: string;
  schoolId: string;
  school: string;
  cycle: "Monthly" | "Termly" | "Annual";
  method: "M-PESA" | "Bank" | "Card";
  amount: number;
  status: BillingStatus;
  grace: string;
  dueDate: string;
};

export type SupportTicket = {
  id: string;
  title: string;
  schoolId: string;
  school: string;
  priority: TicketPriority;
  assignee: string;
  updated: string;
  status: "Open" | "Waiting" | "Resolved";
  messages: { author: string; body: string; time: string; internal?: boolean }[];
};

export type OnboardingAccount = {
  id: string;
  school: string;
  tenancyName?: string;
  registrationNumber?: string;
  ministryRegNumber?: string;
  subCounty?: string;
  numberOfSchoolsUnderTenancy?: number;
  ownershipType?: OwnershipType;
  contactDetails?: TenantContactDetails;
  documents?: TenantDocument[];
  schools?: TenantBranchSchool[];
  credentials?: TenantCredentials;
  emailRecord?: TenantEmailRecord;
  invoices?: TenantInvoice[];
  deactivationReason?: string;
  owner: string;
  email?: string;
  phone?: string;
  county?: string;
  schoolType?: SchoolTenant["type"];
  curriculum?: string;
  expectedStudents?: number;
  branches?: number;
  supportOwner?: string;
  template: string;
  progress: number;
  stage: OnboardingStage;
  trialEnds: string;
  status: OnboardingStatus;
  tenantId?: string;
  lastActivity?: string;
  blockers?: Array<{ id: string; title: string; status: "Open" | "In progress" | "Resolved" }>;
};

export type PlatformAnnouncement = {
  id: string;
  title: string;
  detail: string;
  tag: string;
  target: string;
  channel: string;
  status: AnnouncementStatus;
};

export type AuditEvent = {
  id: string;
  schoolId: string;
  actor: string;
  action: string;
  detail: string;
  time: string;
};

export type OnboardingAuditEvent = {
  id: string;
  onboardingId: string;
  actor: string;
  action: string;
  detail: string;
  time: string;
};

export const tenantStatuses: Array<"All" | TenantStatus> = ["All", "Active", "Trial", "Suspended", "Expired", "Archived"];
export const billingStatuses: Array<"All" | BillingStatus> = ["All", "Paid", "Pending", "Overdue", "Draft"];
export const ticketPriorities: Array<"All" | TicketPriority> = ["All", "Urgent", "High", "Normal", "Low"];

export const initialSchools: SchoolTenant[] = [
  {
    id: "mwangaza-academy",
    name: "Mwangaza Academy",
    county: "Nairobi",
    type: "Primary",
    curriculum: "CBC",
    students: 1284,
    users: 76,
    plan: "Growth",
    mrr: 32000,
    status: "Active",
    paymentStatus: "Paid",
    billingCycle: "Monthly",
    onboarding: 100,
    onboardingStage: "Live",
    isolation: "Verified",
    owner: "Jane Mwangi",
    phone: "+254 722 118 440",
    email: "admin@mwangaza.ac.ke",
    subdomain: "mwangaza.shulesoft.co.ke",
    branches: 2,
    supportOwner: "Jane Mwangi",
    lastActivity: "12 minutes ago",
    modules: ["Finance", "Students", "Exams", "M-PESA", "CBC"],
  },
  {
    id: "kibera-junior-academy",
    name: "Kibera Junior Academy",
    county: "Nairobi",
    type: "Junior School",
    curriculum: "CBC",
    students: 412,
    users: 24,
    plan: "Starter",
    mrr: 12000,
    status: "Trial",
    paymentStatus: "Paid",
    billingCycle: "Monthly",
    onboarding: 84,
    onboardingStage: "Data import",
    isolation: "Verified",
    owner: "Patrick Otieno",
    phone: "+254 733 540 002",
    email: "office@kiberajunior.ac.ke",
    subdomain: "kiberajunior.shulesoft.co.ke",
    branches: 1,
    supportOwner: "Patrick Kamau",
    lastActivity: "28 minutes ago",
    trialEnds: "6 days",
    modules: ["Students", "Finance", "M-PESA"],
  },
  {
    id: "eldoret-highlands-secondary",
    name: "Eldoret Highlands Secondary",
    county: "Uasin Gishu",
    type: "Secondary",
    curriculum: "8-4-4",
    students: 1820,
    users: 118,
    plan: "Scale",
    mrr: 58000,
    status: "Active",
    paymentStatus: "Pending",
    billingCycle: "Termly",
    onboarding: 72,
    onboardingStage: "Data import",
    isolation: "Verified",
    owner: "W. Kosgei",
    phone: "+254 701 884 221",
    email: "principal@eldorethighlands.ac.ke",
    subdomain: "eldorethighlands.shulesoft.co.ke",
    branches: 1,
    supportOwner: "Peter Kariuki",
    lastActivity: "1 hour ago",
    modules: ["Students", "Exams", "Finance"],
  },
  {
    id: "mombasa-coastal-prep",
    name: "Mombasa Coastal Prep",
    county: "Mombasa",
    type: "Primary",
    curriculum: "CBC",
    students: 168,
    users: 13,
    plan: "Starter",
    mrr: 9000,
    status: "Expired",
    paymentStatus: "Overdue",
    billingCycle: "Monthly",
    onboarding: 100,
    onboardingStage: "Live",
    isolation: "Verified",
    owner: "Asha Said",
    phone: "+254 711 220 997",
    email: "admin@coastalprep.ac.ke",
    subdomain: "coastalprep.shulesoft.co.ke",
    branches: 1,
    supportOwner: "Amina Yusuf",
    lastActivity: "3 days ago",
    modules: ["Students", "CBC"],
  },
  {
    id: "nakuru-hills-academy",
    name: "Nakuru Hills Academy",
    county: "Nakuru",
    type: "Mixed",
    curriculum: "Hybrid",
    students: 624,
    users: 41,
    plan: "Growth",
    mrr: 0,
    status: "Trial",
    paymentStatus: "Draft",
    billingCycle: "Monthly",
    onboarding: 48,
    onboardingStage: "Setup wizard",
    isolation: "Verified",
    owner: "Mary Wanjiku",
    phone: "+254 722 881 103",
    email: "mary@nakuruhills.ac.ke",
    subdomain: "nakuruhills.shulesoft.co.ke",
    branches: 1,
    supportOwner: "Jane Mwangi",
    lastActivity: "2 hours ago",
    trialEnds: "5 days",
    modules: ["Students", "CBC"],
  },
  {
    id: "thika-valley-school",
    name: "Thika Valley School",
    county: "Kiambu",
    type: "Secondary",
    curriculum: "8-4-4",
    students: 2104,
    users: 156,
    plan: "Scale",
    mrr: 64000,
    status: "Active",
    paymentStatus: "Paid",
    billingCycle: "Annual",
    onboarding: 100,
    onboardingStage: "Live",
    isolation: "Verified",
    owner: "Daniel Mwangi",
    phone: "+254 700 412 903",
    email: "admin@thikavalley.ac.ke",
    subdomain: "thikavalley.shulesoft.co.ke",
    branches: 3,
    supportOwner: "Daniel Mutua",
    lastActivity: "8 minutes ago",
    modules: ["Finance", "Students", "Exams", "M-PESA", "Transport"],
  },
  {
    id: "meru-vision-schools",
    name: "Meru Vision Schools",
    county: "Meru",
    type: "Mixed",
    curriculum: "Hybrid",
    students: 1402,
    users: 0,
    plan: "Scale",
    mrr: 0,
    status: "Suspended",
    paymentStatus: "Overdue",
    billingCycle: "Monthly",
    onboarding: 100,
    onboardingStage: "Live",
    isolation: "Read-only",
    owner: "Lucy Karimi",
    phone: "+254 724 600 102",
    email: "accounts@meruvision.ac.ke",
    subdomain: "meruvision.shulesoft.co.ke",
    branches: 2,
    supportOwner: "Lucy Njeri",
    lastActivity: "21 days ago",
    modules: ["Students", "Finance"],
  },
  {
    id: "garissa-north-academy",
    name: "Garissa North Academy",
    county: "Garissa",
    type: "Primary",
    curriculum: "CBC",
    students: 0,
    users: 0,
    plan: "Starter",
    mrr: 0,
    status: "Archived",
    paymentStatus: "Draft",
    billingCycle: "Monthly",
    onboarding: 100,
    onboardingStage: "Live",
    isolation: "Archived",
    owner: "Hassan Abdi",
    phone: "+254 710 004 210",
    email: "admin@garissanorth.ac.ke",
    subdomain: "garissanorth.shulesoft.co.ke",
    branches: 1,
    supportOwner: "Unassigned",
    lastActivity: "Archived",
    modules: ["Students"],
  },
];

export const initialAuditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    schoolId: "mwangaza-academy",
    actor: "Jane Mwangi",
    action: "Tenant reviewed",
    detail: "Verified active tenant health and support access boundary.",
    time: "Today, 8:10 AM",
  },
  {
    id: "audit-002",
    schoolId: "meru-vision-schools",
    actor: "Billing Admin",
    action: "Tenant suspended",
    detail: "Moved tenant to read-only mode after grace period expired.",
    time: "May 18, 2026, 4:30 PM",
  },
];

export const initialInvoices: SaaSInvoice[] = [
  { id: "INV-2026-0421", schoolId: "mwangaza-academy", school: "Mwangaza Academy", cycle: "Monthly", method: "M-PESA", amount: 32000, status: "Paid", grace: "-", dueDate: "May 12, 2026" },
  { id: "INV-2026-0420", schoolId: "thika-valley-school", school: "Thika Valley School", cycle: "Annual", method: "Bank", amount: 696000, status: "Paid", grace: "-", dueDate: "May 11, 2026" },
  { id: "INV-2026-0419", schoolId: "eldoret-highlands-secondary", school: "Eldoret Highlands Secondary", cycle: "Termly", method: "M-PESA", amount: 174000, status: "Pending", grace: "12d left", dueDate: "May 31, 2026" },
  { id: "INV-2026-0418", schoolId: "meru-vision-schools", school: "Meru Vision Schools", cycle: "Monthly", method: "Bank", amount: 58000, status: "Overdue", grace: "Expired", dueDate: "Apr 28, 2026" },
  { id: "INV-2026-0417", schoolId: "kibera-junior-academy", school: "Kibera Junior Academy", cycle: "Monthly", method: "M-PESA", amount: 12000, status: "Paid", grace: "-", dueDate: "May 09, 2026" },
];

export const initialTickets: SupportTicket[] = [
  {
    id: "4821",
    title: "M-PESA paybill not matching",
    schoolId: "kibera-junior-academy",
    school: "Kibera Junior Academy",
    priority: "Urgent",
    assignee: "JM",
    updated: "5m ago",
    status: "Open",
    messages: [
      { author: "Bursar", time: "4:21 PM", body: "Our paybill received KES 12,500 but it shows as unmatched. Reference is JK4-2026." },
      { author: "Jane Mwangi", time: "4:23 PM", body: "Looking now. Reference parsed admission number incorrectly; matching to student 042/2026.", internal: true },
    ],
  },
  {
    id: "4818",
    title: "Bulk import of Form 1 students",
    schoolId: "eldoret-highlands-secondary",
    school: "Eldoret Highlands Secondary",
    priority: "High",
    assignee: "PK",
    updated: "1h ago",
    status: "Waiting",
    messages: [{ author: "Principal", time: "3:02 PM", body: "We need help importing 418 new Form 1 students from Excel." }],
  },
  {
    id: "4810",
    title: "Report card layout request",
    schoolId: "thika-valley-school",
    school: "Thika Valley School",
    priority: "Normal",
    assignee: "-",
    updated: "3h ago",
    status: "Open",
    messages: [{ author: "Deputy Principal", time: "1:41 PM", body: "Can we show class teacher comments above the grading table?" }],
  },
  {
    id: "4804",
    title: "Add Swahili subject category",
    schoolId: "mombasa-coastal-prep",
    school: "Mombasa Coastal Prep",
    priority: "Low",
    assignee: "-",
    updated: "1d ago",
    status: "Open",
    messages: [{ author: "Academic Lead", time: "Yesterday", body: "We need a subject grouping for Kiswahili activities." }],
  },
];

export const initialOnboardingAccounts: OnboardingAccount[] = [
  {
    id: "starlight-education-group",
    school: "Starlight Preparatory School",
    tenancyName: "Starlight Education Group",
    registrationNumber: "REG-SEG-2026",
    ministryRegNumber: "MOE/NRB/MULTI/2026",
    subCounty: "Westlands",
    numberOfSchoolsUnderTenancy: 3,
    ownershipType: "Private",
    contactDetails: {
      primaryContactName: "Irene Njeri",
      primaryContactRole: "Group Director",
      email: "director@starlight.ac.ke",
      phone: "+254 722 450 118",
      alternatePhone: "+254 733 450 118",
      postalAddress: "P.O. Box 45018, Nairobi",
      physicalAddress: "Westlands, Nairobi",
      billingContactName: "Samuel Kariuki",
      billingEmail: "accounts@starlight.ac.ke",
      billingPhone: "+254 711 450 118",
    },
    documents: [{ name: "MOU between the system and the Tenancy", type: "MOU", status: "Uploaded" }],
    schools: [
      {
        id: "starlight-preparatory-school",
        name: "Starlight Preparatory School",
        county: "Nairobi",
        subCounty: "Westlands",
        type: "Primary",
        students: 420,
        branchLabel: "Main school",
        status: "Active",
      },
      {
        id: "starlight-junior-secondary",
        name: "Starlight Junior Secondary",
        county: "Nairobi",
        subCounty: "Westlands",
        type: "Junior Secondary",
        students: 260,
        branchLabel: "Branch 2",
        status: "Active",
      },
      {
        id: "starlight-senior-secondary",
        name: "Starlight Senior Secondary",
        county: "Kiambu",
        subCounty: "Kiambaa",
        type: "Senior Secondary",
        students: 310,
        branchLabel: "Branch 3",
        status: "Active",
      },
    ],
    credentials: {
      loginUrl: "https://starlight-education-group.schoolwise.co.ke/login",
      username: "director@starlight.ac.ke",
      temporaryPassword: "Tenant-SEGI!",
    },
    emailRecord: {
      to: "director@starlight.ac.ke",
      subject: "Tenant account created for Starlight Education Group",
      body: "Your tenant account has been created. Login URL: https://starlight-education-group.schoolwise.co.ke/login Username: director@starlight.ac.ke Temporary password: Tenant-SEGI!",
      sentAt: "Today, 10:15 AM",
    },
    owner: "Irene Njeri",
    email: "director@starlight.ac.ke",
    phone: "+254 722 450 118",
    county: "Nairobi",
    schoolType: "Mixed",
    curriculum: "CBC",
    expectedStudents: 990,
    branches: 3,
    supportOwner: "Super admin",
    template: "Multi-branch private school",
    progress: 100,
    stage: "Live",
    trialEnds: "-",
    status: "Active",
    tenantId: "starlight-education-group",
    lastActivity: "Just now",
    blockers: [],
    invoices: [],
  },
  {
    id: "eldoret-highlands-secondary",
    school: "Eldoret Highlands Secondary",
    tenancyName: "Eldoret Highlands Secondary",
    registrationNumber: "REG-EHS-2024",
    ministryRegNumber: "MOE/UAS/SEC/1182",
    subCounty: "Eldoret East",
    numberOfSchoolsUnderTenancy: 1,
    ownershipType: "Sponsored",
    contactDetails: {
      primaryContactName: "Principal W. Kosgei",
      primaryContactRole: "Principal",
      email: "principal@eldorethighlands.ac.ke",
      phone: "+254 701 884 221",
      alternatePhone: "+254 720 110 332",
      postalAddress: "P.O. Box 1182, Eldoret",
      physicalAddress: "Eldoret East, Uasin Gishu",
      billingContactName: "School Bursar",
      billingEmail: "accounts@eldorethighlands.ac.ke",
      billingPhone: "+254 701 884 221",
    },
    documents: [{ name: "MOU between the system and the Tenancy", type: "MOU", status: "Uploaded" }],
    schools: [
      {
        id: "eldoret-highlands-secondary",
        name: "Eldoret Highlands Secondary",
        county: "Uasin Gishu",
        subCounty: "Eldoret East",
        type: "Secondary",
        students: 1820,
        branchLabel: "Main school",
        status: "Trial",
      },
    ],
    credentials: {
      loginUrl: "https://eldoret-highlands-secondary.schoolwise.co.ke/login",
      username: "principal@eldorethighlands.ac.ke",
      temporaryPassword: "Temp-1182!",
    },
    emailRecord: {
      to: "principal@eldorethighlands.ac.ke",
      subject: "Tenant account created for Eldoret Highlands Secondary",
      body: "Your tenant account has been created. Login URL: https://eldoret-highlands-secondary.schoolwise.co.ke/login Username: principal@eldorethighlands.ac.ke Temporary password: Temp-1182!",
      sentAt: "Today, 9:25 AM",
    },
    invoices: [],
    owner: "Principal W. Kosgei",
    email: "principal@eldorethighlands.ac.ke",
    phone: "+254 701 884 221",
    county: "Uasin Gishu",
    schoolType: "Secondary",
    curriculum: "8-4-4",
    expectedStudents: 1820,
    branches: 1,
    supportOwner: "Peter Kariuki",
    template: "Secondary 8-4-4",
    progress: 72,
    stage: "Data import",
    trialEnds: "2 days",
    status: "Guided setup",
    tenantId: "eldoret-highlands-secondary",
    lastActivity: "1 hour ago",
    blockers: [{ id: "fee-import", title: "Fee balance import needs review", status: "In progress" }],
  },
  {
    id: "nakuru-hills-academy",
    school: "Nakuru Hills Academy",
    tenancyName: "Nakuru Hills Academy",
    registrationNumber: "REG-NHA-2025",
    ministryRegNumber: "MOE/NAK/MIX/0624",
    subCounty: "Nakuru Town East",
    numberOfSchoolsUnderTenancy: 1,
    ownershipType: "Private",
    contactDetails: {
      primaryContactName: "Mary Wanjiku",
      primaryContactRole: "Director",
      email: "mary@nakuruhills.ac.ke",
      phone: "+254 722 881 103",
      postalAddress: "P.O. Box 624, Nakuru",
      physicalAddress: "Nakuru Town East",
      billingContactName: "Mary Wanjiku",
      billingEmail: "mary@nakuruhills.ac.ke",
      billingPhone: "+254 722 881 103",
    },
    documents: [{ name: "MOU between the system and the Tenancy", type: "MOU", status: "Uploaded" }],
    schools: [
      {
        id: "nakuru-hills-academy",
        name: "Nakuru Hills Academy",
        county: "Nakuru",
        subCounty: "Nakuru Town East",
        type: "Mixed",
        students: 624,
        branchLabel: "Main school",
        status: "Trial",
      },
    ],
    credentials: {
      loginUrl: "https://nakuru-hills-academy.schoolwise.co.ke/login",
      username: "mary@nakuruhills.ac.ke",
      temporaryPassword: "Temp-0624!",
    },
    emailRecord: {
      to: "mary@nakuruhills.ac.ke",
      subject: "Tenant account created for Nakuru Hills Academy",
      body: "Your tenant account has been created. Login URL: https://nakuru-hills-academy.schoolwise.co.ke/login Username: mary@nakuruhills.ac.ke Temporary password: Temp-0624!",
      sentAt: "Yesterday, 3:45 PM",
    },
    invoices: [],
    owner: "Mary Wanjiku",
    email: "mary@nakuruhills.ac.ke",
    phone: "+254 722 881 103",
    county: "Nakuru",
    schoolType: "Mixed",
    curriculum: "Hybrid",
    expectedStudents: 624,
    branches: 1,
    supportOwner: "Jane Mwangi",
    template: "CBC Primary",
    progress: 48,
    stage: "Setup wizard",
    trialEnds: "5 days",
    status: "Trial",
    tenantId: "nakuru-hills-academy",
    lastActivity: "2 hours ago",
    blockers: [{ id: "academic-year", title: "Academic year not confirmed", status: "Open" }],
  },
  {
    id: "kitale-greenfield-school",
    school: "Kitale Greenfield School",
    tenancyName: "Kitale Greenfield School",
    registrationNumber: "REG-KGS-2026",
    ministryRegNumber: "MOE/TNZ/MIX/0780",
    subCounty: "Kiminini",
    numberOfSchoolsUnderTenancy: 1,
    ownershipType: "Private",
    contactDetails: {
      primaryContactName: "Daniel Mutua",
      primaryContactRole: "Director",
      email: "admin@kitalegreenfield.ac.ke",
      phone: "+254 712 100 422",
      physicalAddress: "Kiminini, Trans Nzoia",
      billingContactName: "Daniel Mutua",
      billingEmail: "admin@kitalegreenfield.ac.ke",
      billingPhone: "+254 712 100 422",
    },
    documents: [{ name: "MOU between the system and the Tenancy", type: "MOU", status: "Pending" }],
    schools: [
      {
        id: "kitale-greenfield-school",
        name: "Kitale Greenfield School",
        county: "Trans Nzoia",
        subCounty: "Kiminini",
        type: "Mixed",
        students: 780,
        branchLabel: "Main school",
        status: "Trial",
      },
    ],
    invoices: [],
    owner: "Daniel Mutua",
    email: "admin@kitalegreenfield.ac.ke",
    phone: "+254 712 100 422",
    county: "Trans Nzoia",
    schoolType: "Mixed",
    curriculum: "Hybrid",
    expectedStudents: 780,
    branches: 1,
    supportOwner: "Unassigned",
    template: "Hybrid CBC + 8-4-4",
    progress: 18,
    stage: "Registration",
    trialEnds: "9 days",
    status: "Demo",
    lastActivity: "Yesterday",
    blockers: [{ id: "contacts", title: "Missing billing contact", status: "Open" }],
  },
];

export const initialOnboardingAuditEvents: OnboardingAuditEvent[] = [
  {
    id: "onb-audit-001",
    onboardingId: "eldoret-highlands-secondary",
    actor: "Peter Kariuki",
    action: "Data import started",
    detail: "Uploaded Form 1 student import workbook for validation.",
    time: "Today, 9:20 AM",
  },
  {
    id: "onb-audit-002",
    onboardingId: "nakuru-hills-academy",
    actor: "Jane Mwangi",
    action: "Setup wizard advanced",
    detail: "Completed class and stream configuration.",
    time: "Yesterday, 3:40 PM",
  },
];

export const initialAnnouncements: PlatformAnnouncement[] = [
  { id: "maintenance-12-may", title: "Scheduled maintenance - 12 May 02:00 EAT", detail: "30-minute database upgrade. M-PESA queue continues; payments reconcile after maintenance.", tag: "Maintenance", target: "All schools", channel: "In-app + email", status: "Scheduled" },
  { id: "cbc-rubric-library-v2", title: "CBC rubric library v2", detail: "Pre-built Grade 1-6 CBC rubrics, editable per school and subject.", tag: "Release", target: "CBC schools", channel: "In-app", status: "Sent" },
  { id: "term-2-billing-reminders", title: "Term 2 billing reminders", detail: "Subscription renewal notices for schools entering grace period.", tag: "Billing", target: "Overdue schools", channel: "Email + SMS", status: "Draft" },
];

export function priorityTone(priority: TicketPriority) {
  if (priority === "Urgent") return "danger" as const;
  if (priority === "High") return "warning" as const;
  if (priority === "Normal") return "info" as const;
  return "neutral" as const;
}

export function tenantStatusTone(status: TenantStatus) {
  if (status === "Active") return "success" as const;
  if (status === "Trial") return "warning" as const;
  if (status === "Suspended" || status === "Expired") return "danger" as const;
  return "neutral" as const;
}

export function billingStatusTone(status: BillingStatus) {
  if (status === "Paid") return "success" as const;
  if (status === "Pending" || status === "Draft") return "warning" as const;
  return "danger" as const;
}

export function planMrr(plan: SubscriptionPlan) {
  if (plan === "Starter") return 12000;
  if (plan === "Growth") return 32000;
  return 58000;
}

export function schoolPaymentStatus(school: SchoolTenant): BillingStatus {
  if (school.paymentStatus) return school.paymentStatus;
  if (school.status === "Expired" || school.status === "Suspended") return "Overdue";
  if (school.status === "Trial" && school.mrr === 0) return "Draft";
  return "Paid";
}

export function makeId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
