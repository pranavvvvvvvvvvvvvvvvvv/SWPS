import { motion, useReducedMotion } from "framer-motion";
import InteractiveBackdrop from "@/components/site/InteractiveBackdrop";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <InteractiveBackdrop />
      <motion.div
        className="w-full max-w-md"
        initial={reduce ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-10">
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4 text-primary-foreground"
            animate={reduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="w-7 h-7" aria-hidden="true" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card/90 p-8 shadow-lg backdrop-blur-sm">
          {children}
        </div>
        {footer && (
          <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
        )}
      </motion.div>
    </div>
  );
}
