import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import {
  Award,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronRight,
  ArrowLeft,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  CircleUserRound,
  Crown,
  ExternalLink,
  FileCheck2,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircle,
  Moon,
  Plug,
  Search,
  Send,
  Settings,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Upload,
  Users,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  certifications,
  suggestedJobs,
  type Application,
  type Candidate,
} from "@/lib/career-store";
import { useCareer } from "@/context/career-context";
import { useT, LANGUAGES, type Lang } from "@/lib/i18n";
import { Globe } from "lucide-react";

type Page =
  | "dashboard"
  | "applications"
  | "jobs"
  | "interviews"
  | "certifications"
  | "messages"
  | "integrations"
  | "profile"
  | "pro"
  | "settings";
const nav: { page: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { page: "dashboard", label: "Overview", icon: LayoutDashboard },
  { page: "applications", label: "Jobs Applied", icon: BriefcaseBusiness },
  { page: "jobs", label: "Suggested Jobs", icon: Sparkles },
  { page: "interviews", label: "Mock Interviews", icon: CalendarDays },
  { page: "certifications", label: "Certifications", icon: Award },
  { page: "messages", label: "Messages", icon: MessageCircle },
];
const platformGroups = {
  "Job boards": [
    "LinkedIn",
    "Naukri",
    "Indeed",
    "Glassdoor",
    "Wellfound",
    "Dice",
    "Upwork",
    "FlexJobs",
    "Ladders",
  ],
  "Coding platforms": ["LeetCode", "HackerRank", "GeeksForGeeks", "Coding Ninjas", "CodeChef"],
};
const roleOptions = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "QA Automation Engineer",
  "Data Engineer",
  "AI Engineer",
];
const pageTitles: Record<Page, string> = {
  dashboard: "Career overview",
  applications: "Jobs applied",
  jobs: "Suggested for you",
  interviews: "Mock interviews",
  certifications: "Certifications",
  messages: "Recruiter messages",
  integrations: "Connect apps",
  profile: "Profile center",
  pro: "CareerHub PRO",
  settings: "Settings",
};

function BrandMark() {
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-premium">
      <Target className="size-5" />
    </div>
  );
}

export function CareerApp() {
  const { user, ready } = useCareer();
  if (!ready)
    return (
      <div className="grid min-h-dvh place-items-center ambient-bg">
        <div className="glass-panel rounded-3xl p-8">
          <Sparkles className="size-7 animate-pulse text-primary" />
        </div>
      </div>
    );
  return (
    <AnimatePresence mode="wait">
      {user ? <Workspace key="workspace" /> : <AuthExperience key="auth" />}
    </AnimatePresence>
  );
}

function AuthExperience() {
  const { login, register, toggleTheme, theme } = useCareer();
  const [mode, setMode] = useState<"welcome" | "login" | "register" | "otp">("welcome");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    otp: "",
  });
  const passwordScore = [/.{8,}/, /[A-Z]/, /[a-z]/, /\d/, /[^A-Za-z0-9]/].filter((rule) =>
    rule.test(form.password),
  ).length;
  const update = (key: string, value: string) =>
    setForm((previous) => ({ ...previous, [key]: value }));
  const submitLogin = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (!form.password) {
        setMode("otp");
        toast("OTP sent", { description: "Use 123456 for this demo." });
        return;
      }
      if (!login(form.email, form.password)) toast.error("Email or password is incorrect");
    }, 650);
  };
  const verifyOtp = () => {
    if (form.otp !== "123456" || !login(form.email, "123456"))
      toast.error("Enter the demo OTP 123456");
  };
  const parseResume = () => {
    setLoading(true);
    setTimeout(() => {
      setForm((f) => ({
        ...f,
        firstName: "Aarav",
        lastName: "Mehta",
        email: "aarav.mehta@example.com",
        phone: "+91 98765 12345",
      }));
      setLoading(false);
      toast.success("Information extracted successfully");
    }, 900);
  };
  const finishRegistration = () => {
    if (passwordScore < 5 || form.password !== form.confirm) {
      toast.error("Please meet all password requirements");
      return;
    }
    const candidate: Candidate = {
      id: crypto.randomUUID(),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      password: form.password,
      plan: "FREE",
      headline: "Open to new opportunities",
      location: "India",
      skills: [],
      completion: 35,
      verified: false,
      resume: "Uploaded_Resume.pdf",
    };
    setStep(3);
    setTimeout(() => register(candidate), 1250);
  };

  return (
    <main className="relative min-h-dvh overflow-hidden ambient-bg p-4 sm:p-8">
      <div className="pointer-events-none absolute -left-24 top-20 size-80 rounded-full bg-primary/15 blur-3xl ambient-float" />
      <Button
        variant="glass"
        size="icon"
        aria-label="Toggle theme"
        onClick={toggleTheme}
        className="absolute right-5 top-5 z-20"
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </Button>
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-6xl items-center justify-center sm:min-h-[calc(100dvh-4rem)]">
        <motion.section
          layout
          className="glass-panel grid w-full overflow-hidden rounded-[2rem] lg:grid-cols-[1.05fr_.95fr]"
        >
          <div className="relative hidden min-h-[670px] overflow-hidden bg-primary/8 p-12 lg:flex lg:flex-col lg:justify-between">
            <div className="flex items-center gap-3">
              <BrandMark />
              <span className="font-display text-xl font-bold tracking-tight">CareerHub</span>
            </div>
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" /> Intelligence for your career
              </div>
              <h1 className="max-w-xl font-display text-6xl font-bold leading-[1.02] tracking-[-0.055em]">
                Every opportunity.
                <br />
                <span className="text-primary">One beautiful view.</span>
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
                Track applications, discover stronger matches, and move through your career with
                clarity.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                ["70+", "ATS partners"],
                ["94%", "match accuracy"],
                ["2.4×", "faster search"],
              ].map(([metric, label]) => (
                <div key={label} className="glass-panel rounded-2xl p-4">
                  <p className="text-xl font-bold">{metric}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex min-h-[620px] flex-col justify-center p-6 sm:p-12">
            <AnimatePresence mode="wait">
              {mode === "welcome" && (
                <motion.div
                  key="welcome"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  <div className="mb-10 flex items-center gap-3 lg:hidden">
                    <BrandMark />
                    <span className="text-xl font-bold">CareerHub</span>
                  </div>
                  <p className="mb-3 text-sm font-semibold text-primary">YOUR CAREER, ORGANIZED</p>
                  <h2 className="font-display text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                    Track every application.
                    <br />
                    Land what’s next.
                  </h2>
                  <p className="mt-5 max-w-md text-muted-foreground">
                    A private, intelligent workspace for your entire job search.
                  </p>
                  <div className="mt-10 grid gap-3">
                    <Button variant="premium" onClick={() => setMode("register")} className="h-13">
                      Create account <ChevronRight />
                    </Button>
                    <Button variant="glass" onClick={() => setMode("login")} className="h-13">
                      Sign in
                    </Button>
                  </div>
                  <button
                    onClick={() => setMode("login")}
                    className="mt-8 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Explore with demo accounts
                  </button>
                </motion.div>
              )}
              {mode === "login" && (
                <motion.form
                  key="login"
                  onSubmit={submitLogin}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AuthBack onClick={() => setMode("welcome")} />
                  <p className="text-sm font-semibold text-primary">WELCOME BACK</p>
                  <h2 className="mt-2 text-4xl font-bold tracking-tight">Sign in to CareerHub</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Continue your journey from exactly where you left off.
                  </p>
                  <div className="mt-8 space-y-4">
                    <Field
                      label="Email address"
                      type="email"
                      value={form.email}
                      onChange={(v) => update("email", v)}
                      placeholder="you@example.com"
                    />
                    <Field
                      label="Password"
                      type="password"
                      value={form.password}
                      onChange={(v) => update("password", v)}
                      placeholder="Leave blank for OTP"
                    />
                    <Button type="submit" variant="premium" className="w-full">
                      {loading ? "Signing in…" : "Sign in"}
                    </Button>
                    <Button
                      type="button"
                      variant="glass"
                      className="w-full"
                      onClick={() => {
                        if (!form.email) return toast.error("Enter your email first");
                        setMode("otp");
                        toast("OTP sent", { description: "Use 123456 for this demo." });
                      }}
                    >
                      Login via OTP
                    </Button>
                  </div>
                  <DemoCredentials
                    setEmail={(email, password) => setForm((f) => ({ ...f, email, password }))}
                  />
                </motion.form>
              )}
              {mode === "otp" && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <AuthBack onClick={() => setMode("login")} />
                  <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <LockKeyhole />
                  </div>
                  <h2 className="text-3xl font-bold">Check your inbox</h2>
                  <p className="mt-2 text-muted-foreground">
                    Enter the six-digit code sent to {form.email}.
                  </p>
                  <div className="mt-7">
                    <Field
                      label="One-time password"
                      value={form.otp}
                      onChange={(v) => update("otp", v.replace(/\D/g, "").slice(0, 6))}
                      placeholder="123456"
                    />
                    <Button onClick={verifyOtp} variant="premium" className="mt-4 w-full">
                      Verify and continue
                    </Button>
                  </div>
                </motion.div>
              )}
              {mode === "register" && (
                <motion.div
                  key={`register-${step}`}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <AuthBack onClick={() => (step > 1 ? setStep(step - 1) : setMode("welcome"))} />
                  <div className="mb-7 flex gap-2" aria-label={`Step ${step} of 3`}>
                    {[1, 2, 3].map((n) => (
                      <div
                        key={n}
                        className={cn(
                          "h-1.5 flex-1 rounded-full",
                          n <= step ? "bg-primary" : "bg-muted",
                        )}
                      />
                    ))}
                  </div>
                  {step === 1 && (
                    <>
                      <h2 className="text-3xl font-bold">Let’s build your profile</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload your resume for an instant head start.
                      </p>
                      <Button
                        variant="glass"
                        onClick={parseResume}
                        className="my-6 w-full border-dashed"
                      >
                        <Upload />
                        {loading ? "Reading your resume…" : "Upload PDF, DOC or DOCX"}
                      </Button>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="First name"
                          value={form.firstName}
                          onChange={(v) => update("firstName", v)}
                        />
                        <Field
                          label="Last name"
                          value={form.lastName}
                          onChange={(v) => update("lastName", v)}
                        />
                        <Field
                          label="Email"
                          type="email"
                          value={form.email}
                          onChange={(v) => update("email", v)}
                        />
                        <Field
                          label="Phone number"
                          type="tel"
                          value={form.phone}
                          onChange={(v) => update("phone", v)}
                        />
                      </div>
                      <Button
                        variant="premium"
                        className="mt-6 w-full"
                        disabled={!form.firstName || !form.lastName || !form.email || !form.phone}
                        onClick={() => setStep(2)}
                      >
                        Continue
                      </Button>
                    </>
                  )}
                  {step === 2 && (
                    <>
                      <h2 className="text-3xl font-bold">Secure your account</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Create a strong password to protect your career data.
                      </p>
                      <div className="mt-7 space-y-4">
                        <Field
                          label="Password"
                          type="password"
                          value={form.password}
                          onChange={(v) => update("password", v)}
                        />
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <div
                              key={n}
                              className={cn(
                                "h-1.5 flex-1 rounded-full",
                                n <= passwordScore
                                  ? passwordScore < 3
                                    ? "bg-destructive"
                                    : passwordScore < 5
                                      ? "bg-warning"
                                      : "bg-success"
                                  : "bg-muted",
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          8+ characters with uppercase, lowercase, number and symbol.
                        </p>
                        <Field
                          label="Confirm password"
                          type="password"
                          value={form.confirm}
                          onChange={(v) => update("confirm", v)}
                        />
                        <Button variant="premium" className="w-full" onClick={finishRegistration}>
                          Create account
                        </Button>
                      </div>
                    </>
                  )}
                  {step === 3 && (
                    <div className="py-16 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mx-auto grid size-20 place-items-center rounded-full bg-success text-primary-foreground"
                      >
                        <Check className="size-10" />
                      </motion.div>
                      <h2 className="mt-6 text-3xl font-bold">Account created</h2>
                      <p className="mt-2 text-muted-foreground">
                        Preparing your new career workspace…
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

function AuthBack({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 text-sm font-semibold text-muted-foreground hover:text-foreground"
    >
      ← Back
    </button>
  );
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border-glass-border bg-glass"
      />
    </div>
  );
}
function DemoCredentials({ setEmail }: { setEmail: (email: string, password: string) => void }) {
  return (
    <div className="mt-7 rounded-2xl border border-glass-border bg-muted/50 p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Demo access
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setEmail("free.demo@careerhub.com", "Free@123")}
          className="rounded-xl bg-background/70 p-3 text-left text-xs hover:bg-accent"
        >
          <b>Free account</b>
          <br />
          <span className="text-muted-foreground">free.demo@careerhub.com</span>
        </button>
        <button
          type="button"
          onClick={() => setEmail("pro.demo@careerhub.com", "Pro@123")}
          className="rounded-xl bg-background/70 p-3 text-left text-xs hover:bg-accent"
        >
          <b>PRO account</b>
          <br />
          <span className="text-muted-foreground">pro.demo@careerhub.com</span>
        </button>
      </div>
    </div>
  );
}

function Workspace() {
  const { user, applications, theme, toggleTheme } = useCareer();
  const { t, lang, setLang } = useT();
  const [page, setPage] = useState<Page>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  if (!user) return null;
  const userApps = applications.filter((app) => app.userId === user.id);
  const navigate = (next: Page) => {
    setPage(next);
    setMobileOpen(false);
  };
  return (
    <main className="min-h-dvh ambient-bg text-foreground">
      <div className="fixed inset-0 -z-10 bg-background/85" />
      <aside
        className={cn(
          "glass-panel fixed inset-y-3 left-3 z-40 flex w-64 flex-col rounded-[1.75rem] p-3 transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]",
        )}
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <BrandMark />
          <div>
            <p className="font-bold tracking-tight">CareerHub</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">
              Candidate OS
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="ml-auto lg:hidden"
          >
            <X />
          </Button>
        </div>
        <nav className="mt-6 space-y-1" aria-label="Primary navigation">
          {nav.map((item) => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className={cn(
                "flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all",
                page === item.page
                  ? "bg-primary text-primary-foreground shadow-premium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="size-4" />
              {tNav(item.label)}
              {item.page === "messages" && user.plan === "PRO" && (
                <span className="ml-auto rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px]">
                  3
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-1">
          <button
            onClick={() => navigate("settings")}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground hover:bg-accent"
          >
            <Settings className="size-4" />
            Settings
          </button>
          <button
            onClick={() => navigate("profile")}
            className="flex w-full items-center gap-3 rounded-2xl bg-muted/60 p-3 text-left hover:bg-accent"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 font-bold text-primary">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-muted-foreground">{user.plan} plan</p>
            </div>
            <ChevronRight className="ml-auto size-4" />
          </button>
        </div>
      </aside>
      {mobileOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden"
        />
      )}
      <section className="min-h-dvh lg:pl-[18rem]">
        <header className="sticky top-0 z-20 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 bg-background/65 px-4 py-3 backdrop-blur-2xl sm:px-7">
          <Button
            variant="glass"
            size="icon"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden"
          >
            <Menu />
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold sm:text-base">{pageTitles[page]}</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Your intelligent career workspace
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              variant="glass"
              className="hidden sm:flex"
              onClick={() => navigate("integrations")}
            >
              <Plug />
              Connect apps
            </Button>
            <Button
              variant={user.plan === "PRO" ? "premium" : "glass"}
              onClick={() => navigate("pro")}
              className="px-3"
            >
              <Crown />
              <span className="hidden sm:inline">{user.plan === "PRO" ? "PRO" : "Upgrade"}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              onClick={() => setNotifications(!notifications)}
              className="relative"
            >
              <Bell />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
              {theme === "light" ? <Moon /> : <Sun />}
            </Button>
          </div>
          {notifications && (
            <div className="glass-panel absolute right-4 top-16 w-[min(24rem,calc(100vw-2rem))] rounded-2xl p-3 shadow-glass">
              <div className="flex items-center justify-between px-2 py-2">
                <b>Notifications</b>
                <span className="text-xs text-primary">3 new</span>
              </div>
              {[
                "Your application at Arc is under review",
                "New 96% job match found",
                "Priya from Atlassian sent a message",
              ].map((text, index) => (
                <button
                  key={text}
                  className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-accent"
                >
                  <span
                    className={cn(
                      "mt-1 size-2 shrink-0 rounded-full",
                      index < 2 ? "bg-primary" : "bg-muted-foreground",
                    )}
                  />
                  <span className="text-sm">
                    {text}
                    <small className="mt-1 block text-muted-foreground">{index + 1}h ago</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </header>
        <div className="mx-auto max-w-[1500px] p-4 sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25 }}
            >
              {page === "dashboard" && (
                <Dashboard user={user} apps={userApps} navigate={navigate} />
              )}
              {page === "applications" && <Applications apps={userApps} />}
              {page === "jobs" && <Suggested user={user} />}
              {page === "interviews" && <Interviews user={user} upgrade={() => navigate("pro")} />}
              {page === "certifications" && (
                <Certifications user={user} upgrade={() => navigate("pro")} />
              )}
              {page === "messages" && <Messages user={user} upgrade={() => navigate("pro")} />}
              {page === "integrations" && (
                <Integrations user={user} upgrade={() => navigate("pro")} />
              )}
              {page === "profile" && <Profile user={user} upgrade={() => navigate("pro")} />}
              {page === "pro" && <ProPage user={user} />}
              {page === "settings" && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

function Dashboard({
  user,
  apps,
  navigate,
}: {
  user: Candidate;
  apps: Application[];
  navigate: (page: Page) => void;
}) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? ["Good morning", "☀️"]
      : hour < 17
        ? ["Good afternoon", "🌤️"]
        : ["Good evening", "🌙"];
  const metrics = [
    {
      label: "Total applications",
      value: apps.length,
      icon: BriefcaseBusiness,
      note: "+12% this month",
    },
    {
      label: "Active applications",
      value: apps.filter((a) => ["Applied", "Reviewing"].includes(a.status)).length,
      icon: TrendingUp,
      note: "Across 8 companies",
    },
    {
      label: "Interview invites",
      value: apps.filter((a) => a.status === "Interview").length,
      icon: CalendarDays,
      note: "+2 this week",
    },
    {
      label: "Offers received",
      value: apps.filter((a) => a.status === "Offer").length,
      icon: Award,
      note: "Top 8% outcome",
    },
  ];
  const chartData = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((name, i) => ({
    name,
    applications: [5, 8, 6, 12, 14, 13][i],
    interviews: [1, 2, 1, 3, 4, 3][i],
  }));
  const statusData = ["Applied", "Reviewing", "Interview", "Rejected", "Offer"].map((name) => ({
    name,
    value: Math.max(1, apps.filter((a) => a.status === name).length),
  }));
  return (
    <>
      <section className="mb-7 grid gap-5 xl:grid-cols-[1fr_auto]">
        <div>
          <p className="text-sm font-semibold text-primary">{greeting[0].toUpperCase()}</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-[-0.04em] sm:text-5xl">
            {greeting[0]}, {user.firstName} {greeting[1]}
          </h1>
          <p className="mt-3 text-muted-foreground">
            Every focused step brings your next opportunity closer.
          </p>
        </div>
        <div className="glass-panel flex items-center gap-4 rounded-2xl p-4">
          <ProgressRing value={user.completion} />
          <div>
            <p className="text-sm font-semibold">Profile strength</p>
            <p className="text-xs text-muted-foreground">Add experience to reach 100%</p>
            <button
              onClick={() => navigate("profile")}
              className="mt-1 text-xs font-semibold text-primary"
            >
              Improve profile →
            </button>
          </div>
        </div>
      </section>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <metric.icon className="size-5" />
              </div>
              <span className="text-xs font-medium text-success">{metric.note}</span>
            </div>
            <p className="mt-5 text-3xl font-bold">{metric.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </section>
      <section className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_.8fr]">
        <div className="glass-panel rounded-3xl p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-bold">Application momentum</h2>
              <p className="text-xs text-muted-foreground">Your search activity over six months</p>
            </div>
            <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
              Healthy trend
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    color: "var(--popover-foreground)",
                  }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                />
                <Area
                  dataKey="applications"
                  type="monotone"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  fill="url(#fillApps)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-5">
          <h2 className="font-bold">Status mix</h2>
          <p className="text-xs text-muted-foreground">Where applications stand</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={82}
                  paddingAngle={4}
                >
                  {statusData.map((item, i) => (
                    <Cell
                      key={item.name}
                      fill={
                        [
                          "var(--primary)",
                          "var(--warning)",
                          "var(--chart-2)",
                          "var(--destructive)",
                          "var(--success)",
                        ][i]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 14,
                    color: "var(--popover-foreground)",
                  }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {statusData.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center text-xs">
                <span
                  className="mr-2 size-2 rounded-full"
                  style={{
                    background: [
                      "var(--primary)",
                      "var(--warning)",
                      "var(--chart-2)",
                      "var(--destructive)",
                    ][i],
                  }}
                />
                {item.name}
                <b className="ml-auto">{item.value}</b>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-4 grid gap-4 lg:grid-cols-3">
        <Insight
          title="Most applied company"
          value="Atlassian"
          note="8 applications"
          icon={Users}
        />
        <Insight title="Top location" value="Bengaluru" note="38% of applications" icon={Target} />
        <Insight
          title="Fastest-growing interest"
          value="AI Platforms"
          note="+42% in 30 days"
          icon={Zap}
        />
      </section>
    </>
  );
}
function Insight({
  title,
  value,
  note,
  icon: Icon,
}: {
  title: string;
  value: string;
  note: string;
  icon: typeof Users;
}) {
  return (
    <div className="glass-panel flex items-center gap-4 rounded-2xl p-5">
      <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="font-bold">{value}</p>
        <p className="text-xs text-success">{note}</p>
      </div>
    </div>
  );
}
function ProgressRing({ value }: { value: number }) {
  const tone =
    value > 80
      ? "var(--success)"
      : value > 60
        ? "var(--primary)"
        : value > 30
          ? "var(--warning)"
          : "var(--destructive)";
  return (
    <div
      className="relative grid size-16 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${tone} ${value}%, var(--muted) 0)` }}
    >
      <div className="grid size-12 place-items-center rounded-full bg-background text-sm font-bold">
        {value}%
      </div>
    </div>
  );
}

function Applications({ apps }: { apps: Application[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const visible = apps.filter(
    (app) =>
      `${app.title} ${app.company}`.toLowerCase().includes(query.toLowerCase()) &&
      (status === "All" || app.status === status),
  );
  return (
    <PageIntro
      eyebrow="APPLICATION PIPELINE"
      title="Every application, in sync."
      subtitle="Search, filter, and follow every opportunity through your pipeline."
      actions={
        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          {visible.length} applications
        </span>
      }
    >
      <div className="glass-panel mb-4 grid gap-3 rounded-2xl p-3 sm:grid-cols-[1fr_190px]">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
          <Input
            aria-label="Search applications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search role or company"
            className="h-11 rounded-xl bg-background/60 pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-11 rounded-xl bg-background/60">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["All", "Applied", "Reviewing", "Interview", "Rejected", "Offer"].map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-3">
        {visible.map((app) => (
          <div
            key={app.id}
            className="glass-panel grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl p-4 sm:grid-cols-[minmax(0,1.2fr)_.7fr_.6fr_auto] sm:p-5"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{app.title}</p>
              <p className="text-sm text-muted-foreground">{app.company}</p>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">{app.location}</p>
            <p className="hidden text-sm text-muted-foreground sm:block">
              {new Date(app.date).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <Status status={app.status} />
          </div>
        ))}
        {visible.length === 0 && (
          <Empty
            icon={BriefcaseBusiness}
            title="No applications found"
            copy="Try adjusting your search or filters."
          />
        )}
      </div>
    </PageIntro>
  );
}
function Status({ status }: { status: Application["status"] }) {
  const classes =
    status === "Offer"
      ? "bg-success/12 text-success"
      : status === "Rejected"
        ? "bg-destructive/10 text-destructive"
        : status === "Interview"
          ? "bg-warning/12 text-warning"
          : "bg-primary/10 text-primary";
  return (
    <span className={cn("rounded-full px-3 py-1.5 text-xs font-semibold", classes)}>{status}</span>
  );
}

function Suggested({ user }: { user: Candidate }) {
  const { addApplication, applications } = useCareer();
  const [quickOnly, setQuickOnly] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const SAVED_KEY = `careerhub_saved_${user.id}`;
  const [saved, setSaved] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]") as string[];
    } catch {
      return [];
    }
  });
  const persistSaved = (next: string[]) => {
    setSaved(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };
  const toggleSave = (jobId: string, title: string) => {
    if (saved.includes(jobId)) {
      persistSaved(saved.filter((id) => id !== jobId));
      toast.success(`Removed ${title} from saved`);
    } else {
      persistSaved([...saved, jobId]);
      toast.success(`Saved ${title}`);
    }
  };
  const appliedKeys = new Set(
    applications
      .filter((a) => a.userId === user.id)
      .map((a) => `${a.title}__${a.company}`),
  );
  const isApplied = (job: (typeof suggestedJobs)[number]) =>
    appliedKeys.has(`${job.title}__${job.company}`);
  const [selected, setSelected] = useState<(typeof suggestedJobs)[number] | null>(null);
  let jobs = suggestedJobs.filter((job) => !quickOnly || job.quick);
  if (showSaved) jobs = jobs.filter((job) => saved.includes(job.id));
  const apply = () => {
    if (!selected) return;
    addApplication({
      id: crypto.randomUUID(),
      userId: user.id,
      title: selected.title,
      company: selected.company,
      location: selected.location,
      date: new Date().toISOString(),
      status: "Applied",
      category: selected.category,
    });
    setSelected(null);
  };
  return (
    <PageIntro
      eyebrow="AI MATCHING"
      title="Roles worth your attention."
      subtitle="Recommendations shaped by your skills, experience, and application history."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showSaved ? "premium" : "glass"}
            size="sm"
            onClick={() => setShowSaved((s) => !s)}
          >
            <Bookmark />
            {showSaved ? "Showing saved" : `Saved jobs (${saved.length})`}
          </Button>
          {user.plan === "PRO" ? (
            <label className="glass-panel flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold">
              <Switch checked={quickOnly} onCheckedChange={setQuickOnly} />
              Quick Apply only
            </label>
          ) : (
            <span className="rounded-full bg-muted px-3 py-1.5 text-xs">
              Upgrade for Quick Apply
            </span>
          )}
        </div>
      }
    >
      {jobs.length === 0 ? (
        <div className="glass-panel rounded-3xl p-10 text-center">
          <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Bookmark />
          </div>
          <h3 className="mt-4 text-lg font-bold">
            {showSaved ? "No saved jobs yet" : "No matching roles"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {showSaved
              ? "Tap the bookmark on any role to save it for later."
              : "Try turning off filters to see all suggestions."}
          </p>
          {showSaved && (
            <Button variant="glass" className="mt-4" onClick={() => setShowSaved(false)}>
              Browse suggestions
            </Button>
          )}
        </div>
      ) : (
      <div className="grid gap-4 lg:grid-cols-2">
        {jobs.map((job) => (
          <article
            key={job.id}
            className="glass-panel group rounded-3xl p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-lg font-bold text-primary">
                {job.company[0]}
              </div>
              <div className="min-w-0">
                <p className="font-bold">{job.title}</p>
                <p className="text-sm text-muted-foreground">
                  {job.company} · {job.location}
                </p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                {job.match}% match
              </span>
            </div>
            <div className="my-5 flex flex-wrap gap-2">
              {[job.category, job.type, job.salary].map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="glass" className="flex-1">
                View role <ExternalLink />
              </Button>
              {user.plan === "PRO" && job.quick && (
                isApplied(job) ? (
                  <Button variant="glass" disabled className="flex-1">
                    <Check />
                    Applied
                  </Button>
                ) : (
                  <Button variant="premium" onClick={() => setSelected(job)} className="flex-1">
                    <Zap />
                    Quick Apply
                  </Button>
                )
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={saved.includes(job.id) ? `Unsave ${job.title}` : `Save ${job.title}`}
                onClick={() => toggleSave(job.id, job.title)}
                className={cn(saved.includes(job.id) && "text-primary")}
              >
                <Bookmark fill={saved.includes(job.id) ? "currentColor" : "none"} />
              </Button>
            </div>
          </article>
        ))}
      </div>
      )}
      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="glass-panel rounded-3xl">
          <DialogHeader>
            <DialogTitle>Quick Apply</DialogTitle>
            <DialogDescription>
              Your verified CareerHub profile will be shared with {selected?.company}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 rounded-2xl bg-muted/60 p-4 text-sm">
            <Summary label="Candidate" value={`${user.firstName} ${user.lastName}`} />
            <Summary label="Email" value={user.email} />
            <Summary label="Resume" value={user.resume} />
          </div>
          <Button variant="premium" onClick={apply}>
            <Send />
            Apply now
          </Button>
        </DialogContent>
      </Dialog>
    </PageIntro>
  );
}

function PremiumGate({
  title,
  copy,
  upgrade,
}: {
  title: string;
  copy: string;
  upgrade: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl">
      <div className="pointer-events-none grid grid-cols-2 gap-3 opacity-45 blur-[6px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-panel h-36 rounded-2xl" />
        ))}
      </div>
      <div className="glass-panel absolute inset-x-4 top-1/2 mx-auto max-w-md -translate-y-1/2 rounded-3xl p-7 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Crown />
        </div>
        <h2 className="mt-4 text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{copy}</p>
        <Button variant="premium" onClick={upgrade} className="mt-5">
          Upgrade to PRO
        </Button>
      </div>
    </div>
  );
}
function Interviews({ user, upgrade }: { user: Candidate; upgrade: () => void }) {
  const [selected, setSelected] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  if (user.plan === "FREE")
    return (
      <PageIntro
        eyebrow="PRACTICE STUDIO"
        title="Interview with confidence."
        subtitle="Targeted mock sessions designed around your role."
      >
        <PremiumGate
          title="Practice like a PRO"
          copy="Unlock role-based mock interviews, structured feedback, and scheduling."
          upgrade={upgrade}
        />
      </PageIntro>
    );
  const schedule = () => {
    const entries = JSON.parse(localStorage.getItem("careerhub_interviews") ?? "[]") as unknown[];
    localStorage.setItem(
      "careerhub_interviews",
      JSON.stringify([...entries, { userId: user.id, role: selected, date, time }]),
    );
    toast.success("Mock interview requested", {
      description: "We’ll inform you once it is scheduled.",
    });
    setSelected("");
    setDate("");
    setTime("");
  };
  return (
    <PageIntro
      eyebrow="PRACTICE STUDIO"
      title="Interview with confidence."
      subtitle="Choose a role, pick a time, and sharpen your story."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {roleOptions.map((role) => (
          <button
            key={role}
            onClick={() => setSelected(role)}
            className={cn(
              "glass-panel rounded-2xl p-5 text-left transition-all hover:-translate-y-1",
              selected === role && "ring-2 ring-primary",
            )}
          >
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <BriefcaseBusiness />
            </div>
            <p className="mt-5 font-semibold">{role}</p>
            <p className="mt-1 text-xs text-muted-foreground">45 min · AI-assisted feedback</p>
          </button>
        ))}
      </div>
      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) {
            setSelected("");
            setDate("");
            setTime("");
          }
        }}
      >
        <DialogContent className="glass-panel rounded-3xl">
          <DialogHeader>
            <DialogTitle>Schedule mock interview</DialogTitle>
            <DialogDescription>
              {selected ? `${selected} · 45 min · AI-assisted feedback` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <Field label="Date" type="date" value={date} onChange={setDate} />
            <Select value={time} onValueChange={setTime}>
              <div className="space-y-2">
                <Label>Time slot</Label>
                <SelectTrigger className="h-12 rounded-xl bg-glass">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
              </div>
              <SelectContent>
                {["10:00 AM", "12:30 PM", "3:00 PM", "5:30 PM"].map((slot) => (
                  <SelectItem value={slot} key={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="premium" disabled={!date || !time} onClick={schedule}>
              Setup interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageIntro>
  );
}

function Certifications({ user, upgrade }: { user: Candidate; upgrade: () => void }) {
  const [query, setQuery] = useState("");
  if (user.plan === "FREE")
    return (
      <PageIntro
        eyebrow="LEARNING PATHS"
        title="Certifications that move careers."
        subtitle="Personalized learning matched to your next role."
      >
        <PremiumGate
          title="Unlock curated certifications"
          copy="Explore personalized certifications across engineering, cloud, AI, and product."
          upgrade={upgrade}
        />
      </PageIntro>
    );
  const visible = certifications.filter((item) =>
    item.join(" ").toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <PageIntro
      eyebrow="LEARNING PATHS"
      title="Certifications that move careers."
      subtitle="Personalized to your skills and growing interests."
      actions={
        <div className="relative">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            aria-label="Search certifications"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog"
            className="h-10 rounded-xl bg-glass pl-9"
          />
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map(([title, provider, duration, category, price]) => (
          <article key={title} className="glass-panel rounded-3xl p-5">
            <div className="flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Award />
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold",
                  price === "Free" ? "bg-success/10 text-success" : "bg-primary/10 text-primary",
                )}
              >
                {price}
              </span>
            </div>
            <p className="mt-5 font-bold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{provider}</p>
            <div className="mt-5 flex gap-2 text-xs text-muted-foreground">
              <span className="rounded-lg bg-muted px-2 py-1">{duration}</span>
              <span className="rounded-lg bg-muted px-2 py-1">{category}</span>
            </div>
            <Button variant="glass" className="mt-5 w-full">
              View certification <ExternalLink />
            </Button>
          </article>
        ))}
      </div>
    </PageIntro>
  );
}

function Messages({ user, upgrade }: { user: Candidate; upgrade: () => void }) {
  const [active, setActive] = useState(0);
  const chats = [
    {
      name: "Ananya Rao",
      company: "Atlassian",
      message: "Your platform experience is a strong match…",
      time: "10:42",
      intro:
        "Hi {name}, your background in platform engineering really stood out. Would you have time to discuss a senior role with our team at Atlassian?",
    },
    {
      name: "Marcus Lee",
      company: "Notion",
      message: "Would you be open to a product engineering role?",
      time: "Yesterday",
      intro:
        "Hey {name}! We're hiring product engineers at Notion to shape AI-native workflows. Open to a quick intro chat this week?",
    },
    {
      name: "Neha Kapoor",
      company: "Razorpay",
      message: "The team enjoyed reviewing your profile.",
      time: "Mon",
      intro:
        "Hi {name}, our hiring team at Razorpay loved your profile. Could we schedule a 30-min conversation about a leadership opening?",
    },
  ];
  type Status = "sent" | "delivered" | "read";
  type ChatMessage = { from: "them" | "me"; text: string; at: number; status?: Status };
  const now = Date.now();
  const initialThreads: ChatMessage[][] = chats.map((c, i) => [
    {
      from: "them",
      text: c.intro.replace("{name}", user.firstName),
      at: now - (i + 1) * 1000 * 60 * 45,
    },
  ]);
  const [threads, setThreads] = useState<ChatMessage[][]>(initialThreads);
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [unread, setUnread] = useState<number[]>([1, 2]);
  const [typing, setTyping] = useState<Record<number, boolean>>({});
  const [showChatMobile, setShowChatMobile] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const filtered = chats
    .map((c, i) => ({ c, i }))
    .filter(({ c }) =>
      query.trim()
        ? (c.name + " " + c.company).toLowerCase().includes(query.toLowerCase())
        : true,
    );

  const fmtTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const fmtListTime = (ts: number) => {
    const d = new Date(ts);
    const diff = (Date.now() - ts) / 86400000;
    if (diff < 1) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 2) return "Yesterday";
    if (diff < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString();
  };

  useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [active, threads, typing]);

  useEffect(() => {
    setUnread((u) => u.filter((idx) => idx !== active));
    setThreads((prev) =>
      prev.map((thread, i) =>
        i === active
          ? thread.map((m) => (m.from === "me" ? { ...m, status: "read" as Status } : m))
          : thread,
      ),
    );
  }, [active]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const target = active;
    const myMsg: ChatMessage = { from: "me", text, at: Date.now(), status: "sent" };
    setThreads((prev) => prev.map((thread, i) => (i === target ? [...thread, myMsg] : thread)));
    setDraft("");
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((thread, i) =>
          i === target
            ? thread.map((m) => (m === myMsg ? { ...m, status: "delivered" } : m))
            : thread,
        ),
      );
    }, 600);
    setTimeout(() => setTyping((t) => ({ ...t, [target]: true })), 1100);
    setTimeout(() => {
      setThreads((prev) =>
        prev.map((thread, i) =>
          i === target
            ? thread.map((m) => (m === myMsg ? { ...m, status: "read" } : m))
            : thread,
        ),
      );
    }, 1400);
    setTimeout(() => {
      const replies = [
        "Got it — thanks for the quick reply!",
        "That sounds great. Let me share a few time slots.",
        "Appreciate it. I'll loop in the hiring manager.",
        "Perfect, I'll send over the role brief shortly.",
      ];
      const reply: ChatMessage = {
        from: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        at: Date.now(),
      };
      setTyping((t) => ({ ...t, [target]: false }));
      setThreads((prev) => prev.map((thread, i) => (i === target ? [...thread, reply] : thread)));
    }, 2400);
  };

  const activeChat = chats[active];
  const activeInitials = activeChat.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  if (user.plan === "FREE")
    return (
      <PageIntro
        eyebrow="RECRUITER NETWORK"
        title="Conversations that matter."
        subtitle="Connect directly with teams interested in your work."
      >
        <PremiumGate
          title="Direct recruiter messaging"
          copy="Receive curated recruiter outreach and keep every conversation organized."
          upgrade={upgrade}
        />
      </PageIntro>
    );
  return (
    <PageIntro
      eyebrow="RECRUITER NETWORK"
      title="Conversations that matter."
      subtitle="Curated recruiter outreach, all in one calm inbox."
    >
      <div className="glass-panel grid h-[600px] overflow-hidden rounded-3xl md:h-[640px] md:grid-cols-[320px_1fr]">
        <div
          className={cn(
            "flex-col overflow-y-auto border-b border-border p-3 md:flex md:border-b-0 md:border-r",
            showChatMobile ? "hidden" : "flex",
          )}
        >
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input
              aria-label="Search recruiters"
              placeholder="Search recruiters"
              className="h-10 bg-background/50 pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {filtered.length === 0 && (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">
              No recruiters match "{query}"
            </p>
          )}
          {filtered.map(({ c: chat, i }) => (
            <button
              key={chat.name}
              onClick={() => {
                setActive(i);
                setDraft("");
                setShowChatMobile(true);
              }}
              className={cn(
                "flex w-full gap-3 rounded-2xl p-3 text-left",
                active === i ? "bg-primary/10" : "hover:bg-accent",
              )}
            >
              <div className="relative shrink-0">
                <div className="grid size-10 place-items-center rounded-full bg-primary/15 font-bold text-primary">
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-success" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center">
                  <p className="truncate text-sm font-semibold">{chat.name}</p>
                  <span
                    className={cn(
                      "ml-auto text-[10px]",
                      unread.includes(i) ? "font-semibold text-primary" : "text-muted-foreground",
                    )}
                  >
                    {threads[i].length > 0
                      ? fmtListTime(threads[i][threads[i].length - 1].at)
                      : chat.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{chat.company}</p>
                <div className="mt-1 flex items-center gap-2">
                  <p
                    className={cn(
                      "min-w-0 flex-1 truncate text-xs",
                      unread.includes(i)
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {typing[i]
                      ? "typing…"
                      : threads[i].length > 0
                        ? (threads[i][threads[i].length - 1].from === "me" ? "You: " : "") +
                          threads[i][threads[i].length - 1].text
                        : chat.message}
                  </p>
                  {unread.includes(i) && (
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {threads[i].filter((m) => m.from === "them").length}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className={cn("min-h-0 flex-col md:flex", showChatMobile ? "flex" : "hidden")}>
          <div className="flex items-center gap-3 border-b border-border p-3 sm:p-4">
            <button
              type="button"
              aria-label="Back to chats"
              onClick={() => setShowChatMobile(false)}
              className="grid size-9 place-items-center rounded-full hover:bg-accent md:hidden"
            >
              <ArrowLeft className="size-4" />
            </button>
            <div className="relative shrink-0">
              <div className="grid size-10 place-items-center rounded-full bg-primary/15 font-bold text-primary">
                {activeInitials}
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-success" />
            </div>
            <div className="min-w-0 flex-1">
              <b className="block truncate">{activeChat.name}</b>
              <p className="truncate text-xs text-muted-foreground">
                {typing[active] ? (
                  <span className="text-success">typing…</span>
                ) : (
                  <>online · {activeChat.company}</>
                )}
              </p>
            </div>
            <div className="hidden items-center gap-1 sm:flex">
              <button
                type="button"
                aria-label="Voice call"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Phone className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Video call"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <Video className="size-4" />
              </button>
              <button
                type="button"
                aria-label="More"
                className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <MoreVertical className="size-4" />
              </button>
            </div>
          </div>
          <div ref={scrollerRef} className="flex flex-1 flex-col gap-2 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto mb-2 rounded-full bg-muted/60 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Today
            </div>
            {threads[active].map((m, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex max-w-[85%] flex-col gap-1 rounded-2xl px-4 py-2.5 text-sm sm:max-w-md",
                  m.from === "them"
                    ? "rounded-bl-md bg-muted"
                    : "ml-auto rounded-br-md bg-primary text-primary-foreground",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.text}</p>
                <div
                  className={cn(
                    "flex items-center gap-1 self-end text-[10px]",
                    m.from === "them" ? "text-muted-foreground" : "text-primary-foreground/75",
                  )}
                >
                  <span>{fmtTime(m.at)}</span>
                  {m.from === "me" &&
                    (m.status === "read" ? (
                      <CheckCheck className="size-3 text-sky-300" />
                    ) : m.status === "delivered" ? (
                      <CheckCheck className="size-3" />
                    ) : (
                      <Check className="size-3" />
                    ))}
                </div>
              </div>
            ))}
            {typing[active] && (
              <div className="flex max-w-[85%] items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 border-t border-border p-3 sm:p-4">
            <button
              type="button"
              aria-label="Add emoji"
              className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Smile className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Attach file"
              className="grid size-10 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Paperclip className="size-5" />
            </button>
            <Input
              aria-label="Message"
              placeholder="Type a message"
              className="h-11 min-w-0 flex-1 rounded-full bg-background/50"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <Button
              variant="premium"
              size="icon"
              aria-label="Send message"
              onClick={send}
              disabled={!draft.trim()}
              className="shrink-0 rounded-full"
            >
              <Send />
            </Button>
          </div>
        </div>
      </div>
    </PageIntro>
  );
}

function Integrations({ user, upgrade }: { user: Candidate; upgrade: () => void }) {
  const [connected, setConnected] = useState<string[]>(() => {
    try {
      const all = JSON.parse(localStorage.getItem("careerhub_connected_apps") ?? "{}") as Record<
        string,
        string[]
      >;
      return all[user.id] ?? [];
    } catch {
      return [];
    }
  });
  if (user.plan === "FREE")
    return (
      <PageIntro
        eyebrow="CONNECTED ECOSYSTEM"
        title="Your career, connected."
        subtitle="Bring your job boards and coding profiles into one intelligent view."
      >
        <PremiumGate
          title="Connect your career ecosystem"
          copy="Sync job boards and coding platforms with CareerHub PRO."
          upgrade={upgrade}
        />
      </PageIntro>
    );
  const toggle = (name: string) => {
    const next = connected.includes(name)
      ? connected.filter((item) => item !== name)
      : [...connected, name];
    setConnected(next);
    const all = JSON.parse(localStorage.getItem("careerhub_connected_apps") ?? "{}") as Record<
      string,
      string[]
    >;
    localStorage.setItem("careerhub_connected_apps", JSON.stringify({ ...all, [user.id]: next }));
    toast.success(next.includes(name) ? `${name} connected` : `${name} disconnected`);
  };
  return (
    <PageIntro
      eyebrow="CONNECTED ECOSYSTEM"
      title="Your career, connected."
      subtitle={`${connected.length} services are securely connected to your workspace.`}
    >
      {Object.entries(platformGroups).map(([group, platforms]) => (
        <section key={group} className="mb-7">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">{group}</h2>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {platforms.map((platform) => {
              const active = connected.includes(platform);
              return (
                <div key={platform} className="glass-panel flex items-center gap-4 rounded-2xl p-4">
                  <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 font-bold text-primary">
                    {platform[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{platform}</p>
                    <p className="text-xs text-muted-foreground">
                      {active ? "Syncing activity" : "Not connected"}
                    </p>
                  </div>
                  <Button
                    variant={active ? "glass" : "premium"}
                    onClick={() => toggle(platform)}
                    className="ml-auto px-3"
                  >
                    {active ? (
                      <>
                        <Check />
                        Connected
                      </>
                    ) : (
                      "Connect"
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </PageIntro>
  );
}

function Profile({ user, upgrade }: { user: Candidate; upgrade: () => void }) {
  const { updateUser, logout } = useCareer();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);
  const save = () => {
    updateUser({ ...form, completion: Math.min(100, form.completion + 4) });
    setEditing(false);
    toast.success("Profile updated");
  };
  const verify = () => {
    if (user.plan === "FREE") return upgrade();
    localStorage.setItem(
      "careerhub_verification",
      JSON.stringify({ userId: user.id, status: "pending", date: new Date().toISOString() }),
    );
    updateUser({ verified: true });
    toast.success("Verification Request Received", {
      description: "Profile details were successfully sent for verification.",
    });
  };
  return (
    <PageIntro
      eyebrow="PROFILE CENTER"
      title="Your professional story."
      subtitle="Keep your candidate identity polished, complete, and ready to share."
      actions={
        <Button variant="glass" onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : "Edit profile"}
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[.75fr_1.25fr]">
        <div className="glass-panel rounded-3xl p-6 text-center">
          <div className="mx-auto grid size-24 place-items-center rounded-[2rem] bg-primary/15 text-3xl font-bold text-primary">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <h2 className="mt-5 text-xl font-bold">
            {user.firstName} {user.lastName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{user.headline}</p>
          <div className="my-6 flex justify-center">
            <ProgressRing value={user.completion} />
          </div>
          <p className="text-sm font-semibold">Profile Completion: {user.completion}%</p>
          <Button
            variant={user.verified ? "glass" : "premium"}
            onClick={verify}
            className="mt-5 w-full"
            disabled={user.verified}
          >
            <FileCheck2 />
            {user.verified ? "Verified profile" : "Verify profile"}
          </Button>
          {user.plan === "FREE" && (
            <p className="mt-2 text-xs text-muted-foreground">PRO feature</p>
          )}
        </div>
        <div className="glass-panel rounded-3xl p-5 sm:p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField
              label="First name"
              value={form.firstName}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, firstName: v })}
            />
            <ProfileField
              label="Last name"
              value={form.lastName}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, lastName: v })}
            />
            <ProfileField label="Email" value={form.email} disabled />
            <ProfileField
              label="Phone"
              value={form.phone}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, phone: v })}
            />
            <ProfileField
              label="Headline"
              value={form.headline}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, headline: v })}
              wide
            />
            <ProfileField
              label="Location"
              value={form.location}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, location: v })}
            />
            <ProfileField
              label="Education"
              value={form.education ?? ""}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, education: v })}
            />
            <ProfileField
              label="Experience"
              value={form.experience ?? ""}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, experience: v })}
              wide
            />
            <ProfileField
              label="Skills"
              value={form.skills.join(", ")}
              disabled={!editing}
              onChange={(v) => setForm({ ...form, skills: v.split(",").map((s) => s.trim()) })}
              wide
            />
          </div>
          {editing && (
            <Button variant="premium" onClick={save} className="mt-6">
              Save changes
            </Button>
          )}
          <div className="mt-8 border-t border-border pt-6">
            <Button variant="outline" onClick={logout}>
              <LogOut />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </PageIntro>
  );
}
function ProfileField({
  label,
  value,
  disabled,
  onChange = () => {},
  wide,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <div className={cn("space-y-2", wide && "sm:col-span-2")}>
      <Label>{label}</Label>
      <Input
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl bg-background/55 disabled:opacity-80"
      />
    </div>
  );
}

function ProPage({ user }: { user: Candidate }) {
  const { updateUser } = useCareer();
  const [country, setCountry] = useState("India");
  const [paying, setPaying] = useState(false);
  const pricing: Record<string, [string, string[]]> = {
    India: ["₹2,000", ["UPI", "Visa / Mastercard", "Paytm", "Net Banking"]],
    "United States": ["$24", ["Visa / Mastercard", "PayPal", "Apple Pay"]],
    "United Kingdom": ["£19", ["Visa / Mastercard", "PayPal"]],
    Canada: ["C$33", ["Visa / Mastercard", "PayPal"]],
    Germany: ["€22", ["Visa", "PayPal", "SEPA"]],
    Australia: ["A$37", ["Visa / Mastercard", "PayPal"]],
    Singapore: ["S$32", ["Visa / Mastercard", "PayNow"]],
  };
  const [price, methods] = pricing[country];
  const upgrade = () => {
    setPaying(true);
    setTimeout(() => {
      updateUser({ plan: "PRO" });
      localStorage.setItem(
        "careerhub_subscription",
        JSON.stringify({ plan: "PRO", country, price, date: new Date().toISOString() }),
      );
      setPaying(false);
      toast.success("Welcome to CareerHub PRO ✨", {
        description: "Every premium feature is now unlocked.",
      });
    }, 1200);
  };
  return (
    <PageIntro
      eyebrow="CAREERHUB PRO"
      title="Move faster. Stand out sooner."
      subtitle="One plan for the tools, intelligence, and access that accelerate your search."
    >
      <div className="grid gap-5 xl:grid-cols-[1fr_.8fr]">
        <div className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-9">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                MOST POPULAR
              </span>
              <h2 className="mt-5 text-3xl font-bold">CareerHub PRO</h2>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold">{price}</p>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
          </div>
          <div className="my-7 grid gap-3 sm:grid-cols-2">
            {[
              "Connect apps",
              "Mock interviews",
              "Profile verification",
              "Quick Apply",
              "Recruiter messaging",
              "Certifications",
              "Advanced analytics",
              "Priority support",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-success/15 text-success">
                  <Check className="size-3" />
                </span>
                {feature}
              </div>
            ))}
          </div>
          <Button
            variant="premium"
            onClick={upgrade}
            disabled={user.plan === "PRO" || paying}
            className="w-full"
          >
            {user.plan === "PRO"
              ? "Your PRO plan is active"
              : paying
                ? "Securing your upgrade…"
                : "Upgrade to PRO"}
          </Button>
        </div>
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-6">
            <Label>Billing country</Label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="mt-2 h-12 rounded-xl bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(pricing).map((name) => (
                  <SelectItem value={name} key={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-4 text-xs text-muted-foreground">
              Payment methods update for your region.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {methods.map((method) => (
                <span key={method} className="rounded-lg bg-muted px-3 py-2 text-xs font-medium">
                  {method}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-3">
              <LockKeyhole className="text-success" />
              <div>
                <p className="font-semibold">Secure mock checkout</p>
                <p className="text-xs text-muted-foreground">No real payment is processed.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageIntro>
  );
}

function SettingsPage() {
  const { theme, toggleTheme } = useCareer();
  return (
    <PageIntro
      eyebrow="PREFERENCES"
      title="Make CareerHub yours."
      subtitle="A calm, Apple-style space for your experience settings."
    >
      <div className="glass-panel max-w-3xl divide-y divide-border rounded-3xl px-5">
        <Setting
          icon={theme === "light" ? Sun : Moon}
          title="Appearance"
          copy="Switch between light and dark glass."
          control={<Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />}
        />
        <Setting
          icon={Bell}
          title="Smart notifications"
          copy="Application updates, matches, and interviews."
          control={<Switch defaultChecked />}
        />
        <Setting
          icon={Sparkles}
          title="AI recommendations"
          copy="Personalized roles based on your profile."
          control={<Switch defaultChecked />}
        />
      </div>
    </PageIntro>
  );
}
function Setting({
  icon: Icon,
  title,
  copy,
  control,
}: {
  icon: typeof Bell;
  title: string;
  copy: string;
  control: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 py-5">
      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon />
      </div>
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{copy}</p>
      </div>
      {control}
    </div>
  );
}

function PageIntro({
  eyebrow,
  title,
  subtitle,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useT();
  return (
    <>
      <header className="mb-7 flex flex-col gap-4 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <div className="min-w-0">
          <p className="text-xs font-bold tracking-[.16em] text-primary">{t(eyebrow)}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
            {t(title)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{t(subtitle)}</p>
        </div>
        {actions && <div className="min-w-0 sm:shrink-0">{actions}</div>}
      </header>
      {children}
    </>
  );
}
function Empty({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof BriefcaseBusiness;
  title: string;
  copy: string;
}) {
  return (
    <div className="glass-panel rounded-3xl py-16 text-center">
      <Icon className="mx-auto size-9 text-muted-foreground" />
      <h3 className="mt-4 font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
    </div>
  );
}
function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto text-right font-medium">{value}</span>
    </div>
  );
}
