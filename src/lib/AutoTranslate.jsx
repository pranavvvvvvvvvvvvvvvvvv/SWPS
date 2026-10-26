import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/LanguageContext";

const CACHE_KEY = "swps-auto-translations";
const BATCH_LIMIT = 50;

function loadCache() {
  try {
    return JSON.parse(window.localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function persistCache(next) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* storage full — in-memory cache still works */
  }
}

const AutoTranslateContext = createContext(null);

export function AutoTranslateProvider({ children }) {
  const { lang } = useI18n();
  const [cache, setCache] = useState(loadCache);
  const pending = useRef(new Set());
  const failed = useRef(new Set());
  const inFlight = useRef(false);
  const timer = useRef(null);

  // A language switch invalidates queued / failed work for the previous language.
  useEffect(() => {
    pending.current.clear();
    failed.current.clear();
    if (timer.current) clearTimeout(timer.current);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [lang]);

  const flush = useCallback(async () => {
    if (inFlight.current || lang === "en") return;
    const batch = [...pending.current].slice(0, BATCH_LIMIT);
    if (!batch.length) return;

    inFlight.current = true;
    try {
      const res = await base44.functions.invoke("translateStrings", { lang, strings: batch });
      const map = res?.data?.translations || {};
      setCache((prev) => {
        const next = { ...prev, [lang]: { ...(prev[lang] || {}), ...map } };
        persistCache(next);
        return next;
      });
      batch.forEach((s) => {
        pending.current.delete(s);
        if (!(s in map)) failed.current.add(s);
      });
    } catch {
      // Leave the English text showing; retry on a future session, not in a loop.
      batch.forEach((s) => {
        pending.current.delete(s);
        failed.current.add(s);
      });
    } finally {
      inFlight.current = false;
      if (pending.current.size) timer.current = setTimeout(flush, 150);
    }
  }, [lang]);

  const tr = useCallback(
    (text) => {
      if (lang === "en" || typeof text !== "string" || !/[a-zA-Z]/.test(text)) return text;
      const langCache = cache[lang] || {};
      if (text in langCache) return langCache[text];
      if (!failed.current.has(text) && !pending.current.has(text)) {
        pending.current.add(text);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(flush, 150);
      }
      return text;
    },
    [lang, cache, flush]
  );

  return <AutoTranslateContext.Provider value={tr}>{children}</AutoTranslateContext.Provider>;
}

export function useAutoTranslate() {
  const tr = useContext(AutoTranslateContext);
  return typeof tr === "function" ? tr : (text) => text;
}
