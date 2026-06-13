import { type TeacherRecord, teachers } from "@/lib/school-data";

export type StaffModule = {
  slug: string;
  shortLabel: string;
  to:
    | "/school/staff"
    | "/school/staff/subject-allocation"
    | "/school/staff/departments"
    | "/school/staff/schedule"
    | "/school/staff/workload";
};

export const staffModules: StaffModule[] = [
  { slug: "dashboard", shortLabel: "Teacher Dashboard", to: "/school/staff" },
  { slug: "subject-allocation", shortLabel: "Subject Allocation", to: "/school/staff/subject-allocation" },
  { slug: "departments", shortLabel: "Departments", to: "/school/staff/departments" },
  { slug: "schedule", shortLabel: "Teacher Schedule", to: "/school/staff/schedule" },
  { slug: "workload", shortLabel: "Workload Analytics", to: "/school/staff/workload" },
];

export const teacherProfiles: Array<
  TeacherRecord & {
    dob: string;
    gender: "Female" | "Male";
    qualifications: string;
    employment: "Permanent" | "Contract";
    lessonsToday: number;
    pendingMarks: number;
    attendanceTasks: number;
  }
> = teachers.map((teacher, index) => ({
  ...teacher,
  dob: index % 2 === 0 ? "1986-04-18" : "1990-09-07",
  gender: index % 2 === 0 ? "Male" : "Female",
  qualifications: index % 2 === 0 ? "B.Ed (Arts), PGDE" : "B.Sc, PGDE",
  employment: index % 2 === 0 ? "Permanent" : "Contract",
  lessonsToday: 3 + (index % 3),
  pendingMarks: index % 3,
  attendanceTasks: 1 + (index % 2),
}));

export const todayLessons = [
  { lesson: "Grade 6 West - Mathematics", time: "08:00-08:40", teacher: "Joseph Kimani" },
  { lesson: "Form 2 Blue - English", time: "09:20-10:00", teacher: "Mary Atieno" },
  { lesson: "JSS 1 North - Integrated Science", time: "10:40-11:20", teacher: "Samuel Owino" },
];

export const pendingMarks = [
  { teacher: "Joseph Kimani", exam: "Grade 5 CAT 2", due: "Today 5:00 PM" },
  { teacher: "Mary Atieno", exam: "Form 1 Essay 3", due: "Today 4:00 PM" },
  { teacher: "Peter Mwangi", exam: "Form 3 Geography quiz", due: "Tomorrow 8:00 AM" },
];

export const subjectAllocations = [
  { subject: "Mathematics", classGroup: "Grade 6 West", teacher: "Joseph Kimani", load: 8 },
  { subject: "English", classGroup: "Form 2 Blue", teacher: "Mary Atieno", load: 7 },
  { subject: "Integrated Science", classGroup: "JSS 1 North", teacher: "Samuel Owino", load: 9 },
  { subject: "History", classGroup: "Form 3 Green", teacher: "Peter Mwangi", load: 6 },
];

export const departments = [
  { name: "Sciences", hod: "Samuel Owino", teachers: 12, avgLoad: 29, status: "Balanced" },
  { name: "Languages", hod: "Mary Atieno", teachers: 9, avgLoad: 24, status: "Balanced" },
  { name: "Humanities", hod: "Peter Mwangi", teachers: 7, avgLoad: 31, status: "Overload risk" },
];

export const teacherSchedule = [
  { day: "Monday", teacher: "Joseph Kimani", block: "08:00-10:40", lesson: "Math - Grade 6 West" },
  { day: "Monday", teacher: "Mary Atieno", block: "11:20-12:40", lesson: "English - Form 2 Blue" },
  { day: "Tuesday", teacher: "Samuel Owino", block: "08:40-11:20", lesson: "Integrated Science - JSS 1 North" },
  { day: "Wednesday", teacher: "Peter Mwangi", block: "09:20-11:20", lesson: "Geography - Form 3 Green" },
];

export const workloadAnalytics = [
  { teacher: "Samuel Owino", weekly: 32, state: "Overload" },
  { teacher: "Joseph Kimani", weekly: 28, state: "Optimal" },
  { teacher: "Peter Mwangi", weekly: 26, state: "Optimal" },
  { teacher: "Mary Atieno", weekly: 24, state: "Under target" },
  { teacher: "Grace Wairimu", weekly: 22, state: "Under target" },
];
