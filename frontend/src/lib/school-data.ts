export type StudentRecord = {
  id: string;
  adm: string;
  name: string;
  class: string;
  curr: "CBC" | "8-4-4";
  guardian: string;
  guardianPhone: string;
  balance: number;
  status: "Active" | "Alumni";
  attendance: number;
  lastPayment: string;
};

export type ReceiptRecord = {
  id: string;
  studentId: string;
  student: string;
  method: "M-PESA" | "Bank";
  amount: number;
  status: "Cleared" | "Pending";
  time: string;
  reference: string;
};

export type MpesaTransaction = {
  id: string;
  time: string;
  receipt: string;
  phone: string;
  reference: string;
  amount: number;
  match: "Auto" | "Review";
  student: string;
  probableStudentId?: string;
};

export type TeacherRecord = {
  id: string;
  name: string;
  tsc: string;
  dept: string;
  classes: number;
  load: number;
  status: "Active" | "On leave";
};

export const students: StudentRecord[] = [
  {
    id: "042-2026",
    adm: "042/2026",
    name: "Aisha Mwende",
    class: "Grade 4 East",
    curr: "CBC",
    guardian: "Mary Mwende",
    guardianPhone: "+254 712 404 112",
    balance: 0,
    status: "Active",
    attendance: 98,
    lastPayment: "KES 12,500 - Today",
  },
  {
    id: "118-2025",
    adm: "118/2025",
    name: "Brian Otieno",
    class: "Grade 6 West",
    curr: "CBC",
    guardian: "Peter Otieno",
    guardianPhone: "+254 720 118 902",
    balance: 4500,
    status: "Active",
    attendance: 94,
    lastPayment: "KES 8,000 - Today",
  },
  {
    id: "204-2026",
    adm: "204/2026",
    name: "Faith Wanjiru",
    class: "Form 2 Blue",
    curr: "8-4-4",
    guardian: "James Wanjiru",
    guardianPhone: "+254 711 003 418",
    balance: 0,
    status: "Active",
    attendance: 96,
    lastPayment: "KES 25,000 - Today",
  },
  {
    id: "201-2026",
    adm: "201/2026",
    name: "Daniel Kiprop",
    class: "JSS 1 North",
    curr: "CBC",
    guardian: "Ruth Kiprop",
    guardianPhone: "+254 733 921 500",
    balance: 12500,
    status: "Active",
    attendance: 91,
    lastPayment: "KES 5,000 - Today",
  },
  {
    id: "099-2025",
    adm: "099/2025",
    name: "Esther Achieng",
    class: "Form 4 Red",
    curr: "8-4-4",
    guardian: "Joel Achieng",
    guardianPhone: "+254 722 551 884",
    balance: 18200,
    status: "Active",
    attendance: 89,
    lastPayment: "KES 4,200 - Last week",
  },
  {
    id: "311-2024",
    adm: "311/2024",
    name: "George Mutua",
    class: "Form 3 Green",
    curr: "8-4-4",
    guardian: "Lucy Mutua",
    guardianPhone: "+254 701 820 117",
    balance: 0,
    status: "Alumni",
    attendance: 100,
    lastPayment: "Cleared",
  },
];

export const receipts: ReceiptRecord[] = [
  { id: "R-9821", studentId: "042-2026", student: "Aisha Mwende", method: "M-PESA", amount: 12500, status: "Cleared", time: "12 min ago", reference: "SHB4XK21Q" },
  { id: "R-9820", studentId: "118-2025", student: "Brian Otieno", method: "M-PESA", amount: 8000, status: "Cleared", time: "34 min ago", reference: "SHB4XK19P" },
  { id: "R-9819", studentId: "204-2026", student: "Faith Wanjiru", method: "Bank", amount: 25000, status: "Cleared", time: "1h ago", reference: "BANK-9819" },
  { id: "R-9818", studentId: "201-2026", student: "Daniel Kiprop", method: "M-PESA", amount: 5000, status: "Cleared", time: "2h ago", reference: "SHB4XK11D" },
];

export const mpesaTransactions: MpesaTransaction[] = [
  { id: "SHB4XK21Q", time: "14:38", receipt: "SHB4XK21Q", phone: "+254 712 ... 482", reference: "042/2026", amount: 12500, match: "Auto", student: "Aisha Mwende - Grade 4 East", probableStudentId: "042-2026" },
  { id: "SHB4XK19P", time: "14:31", receipt: "SHB4XK19P", phone: "+254 720 ... 117", reference: "118/2025", amount: 8000, match: "Auto", student: "Brian Otieno - Grade 6 West", probableStudentId: "118-2025" },
  { id: "SHB4XK18M", time: "14:22", receipt: "SHB4XK18M", phone: "+254 711 ... 003", reference: "JK4-2026", amount: 12500, match: "Review", student: "Probable: 204/2026", probableStudentId: "204-2026" },
  { id: "SHB4XK14H", time: "13:58", receipt: "SHB4XK14H", phone: "+254 733 ... 921", reference: "204/2026", amount: 25000, match: "Auto", student: "Faith Wanjiru - Form 2 Blue", probableStudentId: "204-2026" },
  { id: "SHB4XK11D", time: "13:41", receipt: "SHB4XK11D", phone: "+254 712 ... 882", reference: "FORM2-DK", amount: 5000, match: "Review", student: "Probable: 201/2026", probableStudentId: "201-2026" },
];

export const teachers: TeacherRecord[] = [
  { id: "joseph-kimani", name: "Joseph Kimani", tsc: "TSC/2014/00421", dept: "Mathematics", classes: 4, load: 28, status: "Active" },
  { id: "mary-atieno", name: "Mary Atieno", tsc: "TSC/2017/04102", dept: "Languages", classes: 3, load: 24, status: "Active" },
  { id: "samuel-owino", name: "Samuel Owino", tsc: "TSC/2012/00188", dept: "Sciences", classes: 5, load: 32, status: "Active" },
  { id: "grace-wairimu", name: "Grace Wairimu", tsc: "TSC/2019/07881", dept: "Languages", classes: 3, load: 22, status: "On leave" },
  { id: "peter-mwangi", name: "Peter Mwangi", tsc: "TSC/2010/00021", dept: "Humanities", classes: 4, load: 26, status: "Active" },
];

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}
