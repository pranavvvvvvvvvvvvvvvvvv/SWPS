import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Droplets, Home as HomeIcon } from "lucide-react";

export default function PageNotFound({}) {
  const location = useLocation();
  const reduce = useReducedMotion();
  const pageName = location.pathname.substring(1);

  // serve a real 404 to crawlers
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "prerender-status-code";
    meta.content = "404";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  const { data: authData, isFetched } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const user = await base44.auth.me();
        return { user, isAuthenticated: true };
      } catch (error) {
        return { user: null, isAuthenticated: false };
      }
    },
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-6">
      <div aria-hidden className="pointer-events-none absolute inset-0 water-grid opacity-30" />
      <div className="relative w-full max-w-md text-center">
        {/* drifting droplet */}
        <motion.div
          className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary"
          animate={reduce ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Droplets className="h-9 w-9" />
          {!reduce && <span className="pulse-ring absolute inset-0 rounded-full text-primary/40" />}
        </motion.div>

        <div className="mt-8 space-y-2">
          <h1 className="text-7xl font-light text-muted-foreground/40">404</h1>
          <div className="mx-auto h-0.5 w-16 bg-primary/30" />
        </div>

        <div className="mt-6 space-y-3">
          <h2 className="text-2xl font-medium text-foreground">Page Not Found</h2>
          <p className="leading-relaxed text-muted-foreground">
            The page <span className="font-medium text-foreground">"{pageName}"</span> could not be
            found in this application.
          </p>
        </div>

        {isFetched && authData.isAuthenticated && authData.user?.role === "admin" && (
          <div className="mt-8 rounded-lg border border-border bg-secondary/50 p-4">
            <div className="flex items-start space-x-3 text-left">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/15">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Admin Note</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  This could mean that the AI hasn't implemented this page yet. Ask it to implement
                  it in the chat.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <HomeIcon className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
