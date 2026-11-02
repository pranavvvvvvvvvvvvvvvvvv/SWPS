import { useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Compass,
  Droplets,
  Home as HomeIcon,
  LayoutDashboard,
  LifeBuoy,
  Waves,
} from "lucide-react";
import { useI18n } from "@/lib/LanguageContext";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const EASE = [0.22, 1, 0.36, 1];

const SUGGESTIONS = [
  { to: "/", label: "Home", fallback: "Homepage", icon: HomeIcon },
  { to: "/how-it-works", label: "How it works", fallback: "How it works", icon: Compass },
  { to: "/features", label: "Features", fallback: "Features", icon: Waves },
  { to: "/dashboard", label: "Monitoring dashboard", fallback: "Dashboard", icon: LayoutDashboard },
  { to: "/contact", label: "Contact", fallback: "Contact", icon: LifeBuoy },
];

export default function PageNotFound() {
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const tr = useAutoTranslate();

  const attempted = decodeURIComponent(location.pathname || "/");

  // Serve a real 404 status to crawlers.
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 water-grid opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl"
      />

      <div className="relative z-10 flex flex-1 items-center justify-center px-5 py-16">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
            <Droplets className="h-3.5 w-3.5" />
            SWPS
          </div>

          {/* 404 numeral with a drifting droplet behind it */}
          <div className="relative mt-7 flex items-center justify-center">
            <motion.span
              aria-hidden
              className="absolute -top-4 text-[92px] font-bold leading-none text-primary/10 sm:text-[124px]"
              animate={reduce ? undefined : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              404
            </motion.span>
            <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-lg shadow-primary/25">
              <Droplets className="h-7 w-7" strokeWidth={2.1} />
            </span>
          </div>

          <h1 className="mt-8 text-[27px] font-bold leading-tight sm:text-[32px]">
            {tr("This tap has run dry")}
          </h1>

          <p className="mx-auto mt-3 max-w-md text-[14px] leading-relaxed text-muted-foreground">
            {tr(
              "We could not find the page you were looking for. It may have been moved, renamed, or the link may be mistyped — nothing has gone wrong on your side."
            )}
          </p>

          <p className="mx-auto mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-[12px] text-muted-foreground">
            <span className="shrink-0 font-semibold text-foreground">
              {tr("Requested path")}
            </span>
            <code className="truncate font-mono text-[11.5px] text-primary">{attempted}</code>
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <Link
              to="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13.5px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:w-auto"
            >
              <HomeIcon className="h-4 w-4" />
              {tr("Back to home")}
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-[13.5px] font-semibold text-foreground transition hover:border-primary/40 hover:text-primary sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              {tr("Previous page")}
            </button>
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {tr("Try one of these")}
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {SUGGESTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[12px] font-medium text-foreground/75 transition hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-3.5 w-3.5 opacity-70" />
                    {t(`common.${s.label}`, tr(s.fallback))}
                  </Link>
                );
              })}
            </div>
          </div>

          <p className="mt-8 text-[11.5px] leading-relaxed text-muted-foreground">
            {tr("Still stuck? Send a note from the contact page and we will point you the right way.")}
          </p>
        </motion.div>
      </div>

      {/* quiet water line anchoring the page */}
      <div aria-hidden className="pointer-events-none relative z-10 overflow-hidden text-primary/10">
        <svg
          className={reduce ? "h-8 w-full" : "wave-drift h-8 w-[2400px] shrink-0"}
          viewBox="0 0 2400 60"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0 30 Q150 8 300 30 T600 30 T900 30 T1200 30 T1500 30 T1800 30 T2100 30 T2400 30 L2400 62 L0 62 Z" />
        </svg>
      </div>
    </div>
  );
}
