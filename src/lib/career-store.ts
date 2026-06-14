export type Plan = "FREE" | "PRO";
export type Candidate = {
  id: string; firstName: string; lastName: string; email: string; phone: string; password: string;
  plan: Plan; headline: string; location: string; skills: string[]; completion: number;
  verified: boolean; resume: string; education?: string; experience?: string; summary?: string;
};
export type Application = { id: string; userId: string; title: string; company: string; location: string; date: string; status: "Applied" | "Reviewing" | "Interview" | "Rejected" | "Offer"; category: string };

export const USERS_KEY = "careerhub_users";
export const SESSION_KEY = "careerhub_current_user";
export const APPLICATIONS_KEY = "careerhub_applications";

const freeUser: Candidate = { id: "free-demo", firstName: "Rahul", lastName: "Sharma", email: "free.demo@careerhub.com", phone: "+91 98765 43210", password: "Free@123", plan: "FREE", headline: "Frontend Engineer crafting accessible products", location: "Bengaluru, India", skills: ["React", "TypeScript", "Design Systems"], completion: 48, verified: false, resume: "Rahul_Sharma_Resume.pdf", education: "B.Tech, Computer Science" };
const proUser: Candidate = { id: "pro-demo", firstName: "Priya", lastName: "Reddy", email: "pro.demo@careerhub.com", phone: "+91 99887 76655", password: "Pro@123", plan: "PRO", headline: "Senior Product Engineer · AI Platforms", location: "Hyderabad, India", skills: ["React", "Node.js", "AI", "Product Strategy"], completion: 94, verified: true, resume: "Priya_Reddy_Resume.pdf", education: "M.S. Software Engineering", experience: "8 years building enterprise SaaS", summary: "Product-minded engineer focused on elegant, scalable candidate experiences." };

const companies = ["Stripe", "Atlassian", "Razorpay", "Microsoft", "Notion", "Figma", "Linear", "Airbnb"];
const roles = ["Senior Product Engineer", "Frontend Platform Engineer", "Full Stack Engineer", "Product Manager", "AI Solutions Engineer"];
const statuses: Application["status"][] = ["Applied", "Reviewing", "Interview", "Rejected", "Offer"];

export function seedCareerData() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(USERS_KEY)) localStorage.setItem(USERS_KEY, JSON.stringify([freeUser, proUser]));
  if (!localStorage.getItem(APPLICATIONS_KEY)) {
    const apps: Application[] = Array.from({ length: 70 }, (_, i) => ({
      id: `app-${i}`, userId: i < 12 ? freeUser.id : proUser.id, title: roles[i % roles.length], company: companies[i % companies.length],
      location: ["Bengaluru", "Remote", "Hyderabad", "Pune", "Singapore"][i % 5], date: new Date(2026, 5 - (i % 6), 12 - (i % 10)).toISOString(), status: statuses[i % statuses.length], category: ["Engineering", "Product", "AI & Data"][i % 3],
    }));
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
  }
  if (!localStorage.getItem("careerhub_connected_apps")) localStorage.setItem("careerhub_connected_apps", JSON.stringify({ "pro-demo": ["LinkedIn", "Naukri", "HackerRank", "LeetCode"] }));
}

export function readUsers(): Candidate[] { try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as Candidate[]; } catch { return []; } }
export function saveUsers(users: Candidate[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
export function readApplications(): Application[] { try { return JSON.parse(localStorage.getItem(APPLICATIONS_KEY) ?? "[]") as Application[]; } catch { return []; } }
export function saveApplications(items: Application[]) { localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(items)); }

export const suggestedJobs = [
  { id: "job-1", title: "Senior Frontend Engineer", company: "Arc", location: "Remote", category: "Engineering", type: "Full-time", salary: "₹35L–₹52L", match: 96, quick: true },
  { id: "job-2", title: "Product Engineer, AI", company: "Notion", location: "San Francisco / Remote", category: "AI & Data", type: "Full-time", salary: "$180k–$240k", match: 93, quick: true },
  { id: "job-3", title: "Design Systems Lead", company: "Atlassian", location: "Bengaluru", category: "Engineering", type: "Full-time", salary: "₹42L–₹60L", match: 89, quick: false },
  { id: "job-4", title: "Senior Product Manager", company: "Razorpay", location: "Bengaluru", category: "Product", type: "Full-time", salary: "₹38L–₹55L", match: 86, quick: true },
];

export const certifications = [
  ["Advanced React Architecture", "Frontend Masters", "8 weeks", "Frontend", "Paid"], ["AWS Solutions Architect", "Amazon Web Services", "12 weeks", "Cloud", "Paid"],
  ["Generative AI Fundamentals", "Google Cloud", "4 weeks", "AI/ML", "Free"], ["DevOps Professional", "Linux Foundation", "10 weeks", "DevOps", "Paid"],
  ["Product Strategy", "Reforge", "6 weeks", "Product", "Paid"], ["Playwright Automation", "Microsoft Learn", "3 weeks", "Testing", "Free"],
];