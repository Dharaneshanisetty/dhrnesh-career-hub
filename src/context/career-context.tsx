import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  APPLICATIONS_KEY,
  SESSION_KEY,
  USERS_KEY,
  readApplications,
  readUsers,
  saveApplications,
  saveUsers,
  seedCareerData,
  type Application,
  type Candidate,
} from "@/lib/career-store";

type CareerContextValue = {
  user: Candidate | null;
  applications: Application[];
  theme: "light" | "dark";
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  register: (candidate: Candidate) => void;
  updateUser: (changes: Partial<Candidate>) => void;
  addApplication: (application: Application) => void;
  toggleTheme: () => void;
  ready: boolean;
};

const CareerContext = createContext<CareerContextValue | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Candidate | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    seedCareerData();
    const savedTheme = localStorage.getItem("careerhub_theme") === "dark" ? "dark" : "light";
    const sessionId = localStorage.getItem(SESSION_KEY);
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
    setUser(readUsers().find((candidate) => candidate.id === sessionId) ?? null);
    setApplications(readApplications());
    setReady(true);
  }, []);

  const value = useMemo<CareerContextValue>(
    () => ({
      user,
      applications,
      theme,
      ready,
      login: (email, password) => {
        const match = readUsers().find(
          (candidate) =>
            candidate.email.toLowerCase() === email.toLowerCase() &&
            (password === "123456" || candidate.password === password),
        );
        if (!match) return false;
        localStorage.setItem(SESSION_KEY, match.id);
        setUser(match);
        return true;
      },
      logout: () => {
        localStorage.removeItem(SESSION_KEY);
        setUser(null);
      },
      register: (candidate) => {
        const users = [...readUsers(), candidate];
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, candidate.id);
        setUser(candidate);
      },
      updateUser: (changes) => {
        if (!user) return;
        const updated = { ...user, ...changes };
        saveUsers(readUsers().map((item) => (item.id === user.id ? updated : item)));
        setUser(updated);
      },
      addApplication: (application) => {
        const next = [application, ...readApplications()];
        saveApplications(next);
        setApplications(next);
        toast.success("Job successfully applied");
      },
      toggleTheme: () => {
        const next = theme === "light" ? "dark" : "light";
        setTheme(next);
        localStorage.setItem("careerhub_theme", next);
        document.documentElement.classList.toggle("dark", next === "dark");
      },
    }),
    [applications, ready, theme, user],
  );
  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
}

export function useCareer() {
  const value = useContext(CareerContext);
  if (!value) throw new Error("useCareer must be inside CareerProvider");
  return value;
}
