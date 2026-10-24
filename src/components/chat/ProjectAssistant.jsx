import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { AlertCircle, ArrowUp, Droplets, Loader2, MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What does adaptive purification control do?",
  "What are the safe water limits?",
  "Which sensors does the unit use?",
  "How do I read the dashboard?",
];

const GREETING = {
  role: "assistant",
  content:
    "Hi — I'm the SWPS assistant. Ask me about the purification stages, sensors, safe limits, predictions or the dashboard — or any other question you have.",
};

export default function ProjectAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open, busy]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (raw) => {
    const text = (raw || input).trim();
    if (!text || busy) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const response = await base44.functions.invoke("askSwps", {
        message: text,
        history: nextMessages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
      });
      const answer = response?.data?.answer;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            answer ||
            "I couldn't reach the project knowledge base just now. Please try again, or use the Contact page.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I couldn't answer that just now — the assistant service is unavailable. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close project assistant" : "Ask the project assistant"}
        className={cn(
          "fixed bottom-5 right-4 z-[60] inline-flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-[12.5px] font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 sm:bottom-6 sm:right-6",
          open && "opacity-0 pointer-events-none"
        )}
      >
        <MessageCircle className="h-4 w-4" />
        Ask SWPS
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="SWPS project assistant"
          className="fixed bottom-0 right-0 z-[70] flex h-[86vh] w-full flex-col overflow-hidden rounded-t-3xl border border-border bg-card shadow-2xl sm:bottom-6 sm:right-6 sm:h-[560px] sm:w-[380px] sm:rounded-3xl"
        >
          <header className="flex items-center gap-2.5 border-b border-border bg-primary/[0.06] px-4 py-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-cyan-600 text-white">
              <Droplets className="h-4 w-4" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] font-bold leading-tight">SWPS assistant</p>
              <p className="text-[10.5px] text-muted-foreground">Project questions, answered</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-secondary/70 text-foreground",
                  m.error && "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                )}
              >
                {m.error && <AlertCircle className="mb-1 h-3.5 w-3.5" />}
                {m.content}
              </div>
            ))}

            {busy && (
              <div className="flex w-fit items-center gap-2 rounded-2xl bg-secondary/70 px-3.5 py-2.5 text-[12px] text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Thinking…
              </div>
            )}

            {messages.length <= 1 && !busy && (
              <div className="space-y-1.5 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="block w-full rounded-xl border border-border px-3 py-2 text-left text-[11.5px] text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="border-t border-border p-3"
          >
            <div className="flex items-end gap-2">
              <label htmlFor="assistant-input" className="sr-only">
                Your question
              </label>
              <textarea
                id="assistant-input"
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask anything…"
                className="max-h-24 min-h-[38px] flex-1 resize-none rounded-xl border border-input bg-background px-3 py-2 text-[12.5px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send question"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90 disabled:opacity-40"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-[9.5px] leading-relaxed text-muted-foreground/80">
              Answers use this project's documentation plus general knowledge. For a direct reply, use the{" "}
              <Link to="/contact" className="underline hover:text-primary" onClick={() => setOpen(false)}>
                contact form
              </Link>
              .
            </p>
          </form>
        </div>
      )}
    </>
  );
}
