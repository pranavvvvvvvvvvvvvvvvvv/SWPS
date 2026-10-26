import { useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Bell,
  ChevronRight,
  ClipboardList,
  Cpu,
  Droplets,
  LayoutDashboard,
  LogOut,
  Map as MapIcon,
  Menu,
  Moon,
  NotebookPen,
  Play,
  Settings2,
  Sun,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { useTheme } from "@/lib/ThemeContext";
import { useI18n } from "@/lib/LanguageContext";
import { LanguageMenu } from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import InteractiveBackdrop from "@/components/site/InteractiveBackdrop";
import ScrollProgress from "@/components/site/ScrollProgress";
import ProjectAssistant from "@/components/chat/ProjectAssistant";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV = [
  {
    group: "Monitor",
    items: [
      { to: "/dashboard", labelKey: "dash.overview", label: "Live overview", icon: LayoutDashboard, end: true },
      { to: "/dashboard/alerts", labelKey: "dash.alerts", label: "Alerts center", icon: Bell, badgeKey: "alerts" },
      { to: "/dashboard/prediction", labelKey: "dash.prediction", label: "Quality prediction", icon: TrendingUp },
      { to: "/dashboard/control-log", labelKey: "dash.control", label: "Adaptive control log", icon: Activity },
      { to: "/dashboard/map", labelKey: "dash.map", label: "Map view", icon: MapIcon },
      { to: "/dashboard/maintenance", labelKey: "dash.maintenance", label: "Maintenance priority", icon: Wrench },
    ],
  },
  {
    group: "Manage",
    items: [
      { to: "/dashboard/devices", labelKey: "dash.devices", label: "Devices", icon: Cpu },
      { to: "/dashboard/thresholds", labelKey: "dash.thresholds", label: "Thresholds", icon: Settings2 },
      { to: "/dashboard/reports", labelKey: "dash.reports", label: "Reports", icon: ClipboardList },
      { to: "/dashboard/manual-entry", labelKey: "dash.manual", label: "Manual entry", icon: NotebookPen },
      { to: "/dashboard/users", labelKey: "dash.users", label: "Users & roles", icon: Users, adminOnly: true },
    ],
  },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const [simulating, setSimulating] = useState(false);
  const [simNote, setSimNote] = useState("");

  const isAdmin = user?.role === "admin" || !user?.role;
  const current = useMemo(() => {
    const flat = NAV.flatMap((g) => g.items);
    return (
      flat.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to))) || flat[0]
    );
  }, [location.pathname]);

  const runSimulator = async () => {
    setSimulating(true);
    setSimNote("");
    try {
      const res = await base44.functions.invoke("runSimulator", {});
      const count = res?.data?.generated ?? 0;
      setSimNote(`${count} reading${count === 1 ? "" : "s"} posted`);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["swps"] }),
      ]);
    } catch (err) {
      setSimNote(err?.message || "Simulator failed");
    } finally {
      setSimulating(false);
      setTimeout(() => setSimNote(""), 4000);
    }
  };

  const navList = (mobile = false) => (
    <nav className={cn("flex flex-col gap-6", mobile && "mt-2")} aria-label="Dashboard">
      {NAV.map((group) => (
        <div key={group.group}>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
            {group.group}
          </p>
          <div className="space-y-0.5">
            {group.items
              .filter((item) => !item.adminOnly || isAdmin)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-secondary hover:text-foreground"
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-80" />
                    <span className="truncate">{t(item.labelKey, item.label)}</span>
                  </NavLink>
                );
              })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <InteractiveBackdrop variant="subtle" />
      <div className="relative z-10 flex min-h-screen bg-secondary/30">
      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[250px] shrink-0 flex-col border-r border-border bg-card lg:flex">
        <Link to="/" className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-sky-500 text-white">
            <Droplets className="h-4 w-4" strokeWidth={2.2} />
          </span>
          <span className="leading-none">
            <span className="block font-heading text-[13.5px] font-extrabold tracking-tight">SWPS</span>
            <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Monitoring
            </span>
          </span>
        </Link>

        <div className="flex-1 overflow-y-auto px-3 py-5">{navList()}</div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 rounded-xl bg-secondary/60 px-3 py-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
              {(user?.full_name || user?.email || "U").slice(0, 1).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11.5px] font-semibold">{user?.full_name || "Signed in"}</p>
              <p className="truncate text-[10px] capitalize text-muted-foreground">
                {user?.duty_role?.replace("_", " ") || user?.role || "member"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => logout()}
              aria-label="Sign out"
              className="text-muted-foreground transition hover:text-rose-500"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open menu"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border lg:hidden"
                  >
                    <Menu className="h-4 w-4" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[82vw] max-w-xs overflow-y-auto p-4">
                  <Link to="/" className="mb-4 flex items-center gap-2 px-1">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="font-heading text-sm font-bold">SWPS</span>
                  </Link>
                  {navList(true)}
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span>Dashboard</span>
                  <ChevronRight className="h-2.5 w-2.5" />
                  <span className="truncate">{current.label}</span>
                </div>
                <h1 className="truncate font-heading text-[15px] font-bold leading-tight">
                  {t(current.labelKey, current.label)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300 sm:inline-flex">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>

              <button
                type="button"
                onClick={runSimulator}
                disabled={simulating}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11.5px] font-semibold text-foreground transition hover:border-primary/40 hover:text-primary disabled:opacity-60"
                title="Post a simulated ESP32 reading for every unit"
              >
                <Play className={cn("h-3 w-3", simulating && "animate-pulse")} />
                <span className="hidden sm:inline">{simulating ? "Posting…" : t("dash.simulator", "Run simulator")}</span>
                <span className="sm:hidden">Sim</span>
              </button>

              <div className="hidden items-center gap-2 sm:flex">
                <LanguageMenu compact />
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground/70 transition hover:text-primary"
                >
                  {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>
          {simNote && (
            <div className="border-t border-border bg-primary/5 px-4 py-1.5 text-[11px] font-medium text-primary sm:px-6">
              {simNote}
            </div>
          )}
        </header>

        <ScrollProgress />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <motion.div
            key={location.pathname}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full max-w-[1180px]"
          >
            <Outlet />
          </motion.div>
        </main>

        <SiteFooter />
      </div>
      <ProjectAssistant />
      </div>
    </>
  );
}
