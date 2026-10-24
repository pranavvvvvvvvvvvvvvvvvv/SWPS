import { Link } from "react-router-dom";
import { Droplets, ArrowUpRight, Mail } from "lucide-react";
import { useI18n } from "@/lib/LanguageContext";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const SITE_LINKS = [
  { to: "/about", label: "About the problem" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/architecture", label: "System architecture" },
  { to: "/features", label: "Features" },
  { to: "/research", label: "Research" },
];

const PROJECT_LINKS = [
  { to: "/technology", label: "Technology" },
  { to: "/gallery", label: "Prototype & gallery" },
  { to: "/future-scope", label: "Future scope" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
];

const DASH_LINKS = [
  { to: "/dashboard", label: "Live overview" },
  { to: "/dashboard/alerts", label: "Alerts center" },
  { to: "/dashboard/map", label: "Map view" },
  { to: "/dashboard/maintenance", label: "Maintenance priority" },
  { to: "/dashboard/reports", label: "Reports" },
];

export default function SiteFooter() {
  const { t } = useI18n();
  const tr = useAutoTranslate();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-page py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-600 text-white">
                <Droplets className="h-4.5 w-4.5" strokeWidth={2.2} />
              </span>
              <span className="font-heading text-sm font-extrabold tracking-tight">SWPS</span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              {tr(
                "A purification unit that monitors itself. Built for villages and mining-affected communities where safe water has to be proven, not assumed."
              )}
            </p>
            <Link
              to="/team#developer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {t("common.developedBy")}
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <FooterColumn title={tr("Project site")} links={SITE_LINKS} />
          <FooterColumn title={tr("More")} links={PROJECT_LINKS} />
          <div>
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {tr("Monitoring")}
            </h4>
            <ul className="space-y-2.5">
              {DASH_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-[13px] text-foreground/70 transition hover:text-primary"
                  >
                    {tr(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/contact#developer"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 transition hover:text-primary"
            >
              <Mail className="h-3.5 w-3.5" /> {tr("Reach the developer")}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {t("common.rights")}</p>
          <p className="flex items-center gap-1.5">
            {tr("Developed by")}{" "}
            <Link to="/contact#developer" className="font-semibold text-foreground hover:text-primary">
              Pranav
            </Link>
            <span className="text-border">·</span>
            <Link to="/contact" className="hover:text-primary">
              {tr("Developer / Contact")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }) {
  const tr = useAutoTranslate();
  return (
    <div>
      <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {title}
      </h4>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-[13px] text-foreground/70 transition hover:text-primary">
              {tr(l.label)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
