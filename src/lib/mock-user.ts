// Mock signed-in user + application state.
// TODO: Replace with real Supabase Auth + `applications`/`documents` tables.

export const MOCK_USER = {
  id: "u_001",
  name: "Ananya Sharma",
  email: "ananya@example.com",
  phone: "+91 98765 43210",
  aadhaar: "XXXX-XXXX-4321",
  pan: "ABCDE1234F",
  dob: "1998-04-12",
  gender: "Female",
  fatherName: "Rakesh Sharma",
  motherName: "Sunita Sharma",
  address: "12-4-56, Jubilee Hills, Hyderabad, Telangana 500033",
  language: "en",
};

export type AppStatus =
  | "Submitted"
  | "Under Verification"
  | "Documents Pending"
  | "Appointment Scheduled"
  | "Approved"
  | "Rejected";

export const MOCK_APPLICATIONS = [
  {
    id: "APP-2409-0012",
    serviceId: "caste-certificate",
    submittedOn: "2026-06-20",
    status: "Under Verification" as AppStatus,
    progress: 55,
    timeline: [
      { label: "Application Submitted", date: "2026-06-20", done: true },
      { label: "Under Verification", date: "2026-06-24", done: true },
      { label: "Documents Pending", date: "", done: false },
      { label: "Appointment Scheduled", date: "", done: false },
      { label: "Approved", date: "", done: false },
    ],
  },
  {
    id: "APP-2405-0007",
    serviceId: "passport",
    submittedOn: "2026-05-11",
    status: "Appointment Scheduled" as AppStatus,
    progress: 75,
    timeline: [
      { label: "Application Submitted", date: "2026-05-11", done: true },
      { label: "Under Verification", date: "2026-05-14", done: true },
      { label: "Appointment Scheduled", date: "2026-05-20", done: true },
      { label: "Approved", date: "", done: false },
    ],
  },
  {
    id: "APP-2403-0021",
    serviceId: "pan",
    submittedOn: "2026-03-02",
    status: "Approved" as AppStatus,
    progress: 100,
    timeline: [
      { label: "Application Submitted", date: "2026-03-02", done: true },
      { label: "Under Verification", date: "2026-03-04", done: true },
      { label: "Approved", date: "2026-03-09", done: true },
    ],
  },
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Appointment confirmed", body: "Passport appointment on 12 Jul at 11:30 AM", time: "2h ago", unread: true },
  { id: 2, title: "Document required", body: "Upload residence proof for Caste Certificate", time: "1d ago", unread: true },
  { id: 3, title: "Application approved", body: "Your PAN Card has been dispatched", time: "5d ago", unread: false },
];
