import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Droplets, Languages, Menu, Moon, Sun, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import RippleLink from "@/components/site/RippleLink";
import { useI18n, LANGUAGES } from "@/lib/LanguageContext";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import { useTheme } from "@/lib/ThemeContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator } from
"@/components/ui/dropdown-menu";

const PRIMARY = [
{ to: "/", key: "nav.home" },
{ to: "/about", key: "nav.problem" },
{ to: "/how-it-works", key: "nav.how" },
{ to: "/prediction", key: "nav.prediction" },
{ to: "/features", key: "nav.features" },
{ to: "/research", key: "nav.research" },
{ to: "/team", key: "nav.team" }];


const PROJECT = [
{ to: "/architecture", key: "nav.architecture" },
{ to: "/technology", key: "nav.technology" },
{ to: "/gallery", key: "nav.gallery" },
{ to: "/future-scope", key: "nav.future" },
{ to: "/contact", key: "nav.contact" }];


export function LanguageMenu({ compact = false }) {
  const { lang, setLang, t } = useI18n();
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("common.language")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-primary",
            compact && "px-2.5"
          )}>
          
          <Languages className="h-3.5 w-3.5" />
          {compact ?
          current.short :

          <>
              <span className="xl:hidden">{current.short}</span>
              <span className="hidden xl:inline">{current.label}</span>
            </>
          }
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {t("common.language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) =>
        <DropdownMenuItem
          key={l.code}
          onSelect={() => setLang(l.code)}
          className={cn("cursor-pointer", lang === l.code && "font-semibold text-primary")}>
          
            {l.label}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>);

}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("common.theme")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-foreground/70 transition hover:border-primary/40 hover:text-primary">
      
      {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
    </button>);

}

export default function SiteHeader() {
  const { t } = useI18n();
  const tr = useAutoTranslate();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ?
        "border-b border-border/70 bg-background/85 backdrop-blur-xl shadow-[0_1px_12px_-8px_rgba(4,32,58,0.4)]" :
        "border-b border-transparent bg-background/60 backdrop-blur-md"
      )}>
      
      <div className="container-page flex h-16 items-center gap-3">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <motion.span
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-sky-500 text-white shadow-sm"
            animate={reduce ? undefined : { y: [0, -2, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
            
            <span className="logo-ripple absolute inset-0 rounded-xl border border-primary/50" />
            <Droplets className="h-4.5 w-4.5" strokeWidth={2.2} />
          </motion.span>
          <span className="leading-none">
            <span className="block font-heading text-[15px] font-extrabold tracking-tight">SWPS</span>
            

            
          </span>
        </Link>

        {/* Desktop nav: visible from 1024px up, one line, centred */}
        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex" aria-label="Main">
          {PRIMARY.map((item) =>
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
            cn(
              "relative whitespace-nowrap rounded-full px-2 py-2 text-[12.5px] font-medium transition-colors xl:px-3 xl:text-[13px]",
              isActive ?
              cn("text-primary", reduce && "bg-secondary") :
              "text-foreground/70 hover:bg-secondary/70 hover:text-foreground"
            )
            }>
            
              {({ isActive }) =>
            <>
                  {isActive && !reduce &&
              <motion.span
                layoutId="site-nav-pill"
                className="absolute inset-0 rounded-full bg-secondary"
                transition={{ type: "spring", stiffness: 380, damping: 32 }} />

              }
                  <span className="relative whitespace-nowrap">
                    {t(`${item.key}.short`, t(item.key))}
                  </span>
                </>
            }
            </NavLink>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-2 text-[12.5px] font-medium text-foreground/70 transition-colors hover:bg-secondary/70 hover:text-foreground xl:px-3 xl:text-[13px]">
                
                {t("nav.project.short", t("nav.project"))}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {PROJECT.map((item) =>
              <DropdownMenuItem key={item.to} asChild>
                  <Link to={item.to} className="cursor-pointer">
                    {t(item.key)}
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageMenu />
            <ThemeToggle />
          </div>
          <RippleLink
            to="/dashboard"
            rippleClass="bg-white/25"
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 sm:inline-flex">
            
            <LayoutDashboard className="h-3.5 w-3.5" />
            {t("nav.dashboard")}
          </RippleLink>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 lg:hidden">
                
                <Menu className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm overflow-y-auto p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-heading text-sm font-bold">SWPS</span>
                <div className="flex items-center gap-2">
                  <LanguageMenu compact />
                  <ThemeToggle />
                </div>
              </div>
              <nav className="flex flex-col gap-1" aria-label="Mobile">
                {[...PRIMARY, ...PROJECT].map((item) =>
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                  cn(
                    "rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive ? "bg-secondary text-primary" : "text-foreground/75 hover:bg-secondary/60"
                  )
                  }>
                  
                    {t(item.key)}
                  </NavLink>
                )}
                <Link
                  to="/dashboard"
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground">
                  
                  <LayoutDashboard className="h-4 w-4" />
                  {t("nav.dashboard")}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>);

}
