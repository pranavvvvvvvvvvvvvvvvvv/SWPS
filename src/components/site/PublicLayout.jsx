import { Outlet } from "react-router-dom";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ProjectAssistant from "@/components/chat/ProjectAssistant";
import { useAutoTranslate } from "@/lib/AutoTranslate";

export default function PublicLayout() {
  const tr = useAutoTranslate();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        {tr("Skip to content")}
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ProjectAssistant />
    </div>
  );
}
