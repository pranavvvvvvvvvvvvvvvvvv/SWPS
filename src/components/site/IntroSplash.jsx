import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Droplets } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const SESSION_KEY = "swps-splash-seen";

const WAVE_D =
  "M0,10 C30,0 60,20 90,10 C120,0 150,20 180,10 C210,0 240,20 270,10 C300,0 330,20 360,10 L360,44 L0,44 Z";

/** Intro splash, once per browser session (~2.2 s, click to skip): a droplet
 *  falls onto a dark-blue screen, ripples spread, water fills from the
 *  bottom with a wave edge, the logo appears, then the water drains upward.
 *  Skipped entirely when prefers-reduced-motion is set. */
export default function IntroSplash() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage blocked — show once per load instead */
    }
    if (seen) return;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(true);
    const t = setTimeout(() => setLeaving(true), 2000);
    return () => clearTimeout(t);
  }, [reduce]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] cursor-pointer overflow-hidden bg-[#031a30]"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      onClick={() => setLeaving(true)}
      onAnimationComplete={() => leaving && setShow(false)}
    >
      {/* water fills from the bottom with a wave edge, then drains upward */}
      <motion.div
        className="absolute inset-x-0 bottom-0 overflow-hidden bg-gradient-to-b from-[#0a4a7a] to-[#03213d]"
        initial={{ height: 0, y: 0 }}
        animate={{
          height: leaving ? "100%" : "88%",
          y: leaving ? "-100%" : "0%",
        }}
        transition={{
          height: { delay: leaving ? 0 : 0.55, duration: leaving ? 0.45 : 0.65, ease: EASE },
          y: { delay: leaving ? 0.05 : 0, duration: 0.55, ease: EASE },
        }}
      >
        <svg
          className="absolute -top-[40px] left-0 h-11 w-[200%]"
          viewBox="0 0 720 44"
          preserveAspectRatio="none"
          fill="#0a4a7a"
        >
          <motion.g
            animate={{ x: [0, 360] }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <path d={WAVE_D} />
            <path d={WAVE_D} transform="translate(-360,0)" />
          </motion.g>
        </svg>
      </motion.div>

      {/* falling droplet — gets swallowed by the rising water */}
      {!leaving && (
        <motion.span
          className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-300 to-sky-500 shadow-[0_0_24px_rgba(56,189,248,0.65)]"
          initial={{ y: "-46vh", opacity: 0, scaleY: 1.35 }}
          animate={{ y: 0, opacity: [0, 1, 1, 1], scaleY: [1.35, 1.35, 1, 0.4] }}
          transition={{ duration: 0.55, times: [0, 0.25, 0.8, 1], ease: "easeIn" }}
        />
      )}

      {/* landing ripples */}
      {!leaving &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 rounded-full border border-sky-300/60"
            style={{ x: "-50%", y: "-50%" }}
            initial={{ width: 8, height: 8, opacity: 0 }}
            animate={{ width: 90 + i * 70, height: 90 + i * 70, opacity: [0, 0.8, 0] }}
            transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: "easeOut" }}
          />
        ))}

      {/* logo appears on the water */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: leaving ? 0 : [0, 1, 1], scale: 1 }}
        transition={{ delay: leaving ? 0 : 1.05, duration: 0.5, ease: EASE }}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30">
          <Droplets className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <span className="font-heading text-3xl font-extrabold tracking-tight text-white">
          SWPS
        </span>
      </motion.div>
    </motion.div>
  );
}
