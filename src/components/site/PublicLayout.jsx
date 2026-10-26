import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ScrollProgress from "@/components/site/ScrollProgress";
import ProjectAssistant from "@/components/chat/ProjectAssistant";
import IntroSplash from "@/components/site/IntroSplash";
import InteractiveBackdrop from "@/components/site/InteractiveBackdrop";
import CursorTrail from "@/components/site/CursorTrail";
import ClickRipples from "@/components/site/ClickRipples";
import { useAutoTranslate } from "@/lib/AutoTranslate";

const EASE = [0.22, 1, 0.36, 1];

export default function PublicLayout() {
  const tr = useAutoTranslate();
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {tr("Skip to content")}
      </a>
      <IntroSplash />
      <InteractiveBackdrop />
      <CursorTrail />
      <ClickRipples />
      <ScrollProgress />
      <SiteHeader />
      <main id="main" className="flex-1">
        {reduce ? (
          <Outlet />
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 26, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(4px)" }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
      <SiteFooter />
      <ProjectAssistant />
    </div>
  );
}
