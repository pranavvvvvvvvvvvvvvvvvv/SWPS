import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Check, Loader2, MapPin, MessageSquare, Send, UserRound } from "lucide-react";
import { PageHero, Section } from "@/components/site/Section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAutoTranslate } from "@/lib/AutoTranslate";
import EmailLink from "@/components/site/EmailLink";

const ROLES = ["Village / community representative", "Health officer", "Local operator", "Student / researcher", "Other"];

const EMPTY = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const tr = useAutoTranslate();
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || "General enquiry",
        message: form.message.trim(),
        source: "contact-page"
      };
      await base44.entities.ContactMessage.create(payload);
      // notify the developer by email; never blocks the form's own flow
      base44.functions.
      invoke("notifyContactMessage", {
        name: payload.name,
        email: payload.email,
        subject: payload.subject,
        message: payload.message
      }).
      catch(() => {});
      setStatus("sent");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setError(err?.message || tr("The message could not be sent. Please try again."));
    }
  };

  return (
    <>
      <PageHero
        eyebrow={tr("Contact")}
        title={tr("Ask about the system, the deployment or the research.")}
        description={tr(
          "Send a message for project queries, field deployment questions or collaboration. Messages reach the developer directly."
        )} />
      

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          {/* form */}
          <div className="card-surface p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <h2 className="text-[16px] font-bold">{tr("Send a message")}</h2>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-secondary/50 px-4 py-3">
              <span className="text-[13px] font-semibold">{tr("Email us directly")}</span>
              <EmailLink />
            </div>

            {status === "sent" ?
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-500/25 dark:bg-emerald-500/10">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <Check className="h-4 w-4" />
                  <p className="text-[13.5px] font-semibold">{tr("Message received")}</p>
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-emerald-800/80 dark:text-emerald-200/80">
                  {tr(
                  "Thanks — your message has been logged. The developer will respond to the email address you provided."
                )}
                </p>
                <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-4 text-[12.5px] font-semibold text-emerald-800 underline-offset-4 hover:underline dark:text-emerald-200">
                
                  {tr("Send another message")}
                </button>
              </div> :

            <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-[12px]">{tr("Full name")}</Label>
                    <Input
                    id="name"
                    value={form.name}
                    onChange={update("name")}
                    required
                    placeholder={tr("Your name")}
                    className="mt-1.5" />
                  
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-[12px]">{tr("Email address")}</Label>
                    <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    required
                    placeholder="you@example.com"
                    className="mt-1.5" />
                  
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-[12px]">{tr("What is this about?")}</Label>
                  <select
                  id="subject"
                  value={form.subject}
                  onChange={update("subject")}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  
                    <option value="">{tr("General enquiry")}</option>
                    {ROLES.map((r) =>
                  <option key={r} value={r}>
                        {tr(r)}
                      </option>
                  )}
                  </select>
                </div>

                <div>
                  <Label htmlFor="message" className="text-[12px]">{tr("Message")}</Label>
                  <Textarea
                  id="message"
                  value={form.message}
                  onChange={update("message")}
                  required
                  rows={5}
                  placeholder={tr("Tell us what you need to know")}
                  className="mt-1.5 resize-none" />
                
                </div>

                {status === "error" &&
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-[12px] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                    {error}
                  </p>
              }

                <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto">
                
                  {status === "sending" ?
                <Loader2 className="h-4 w-4 animate-spin" /> :

                <Send className="h-4 w-4" />
                }
                  {status === "sending" ? tr("Sending…") : tr("Send message")}
                </button>
              </form>
            }
          </div>

          {/* developer + institution */}
          <div className="space-y-5">
            <div id="developer" className="card-surface group relative overflow-hidden p-6 sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl" />
              <p className="eyebrow relative">{tr("Developed by")}</p>
              <div className="relative mt-4 flex items-center gap-4">
                <span className="relative flex h-14 w-14 animate-drift items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-sky-500 text-lg font-bold text-white shadow-sm">
                  <span className="logo-ripple absolute inset-0 rounded-2xl border border-primary/50" />
                  P
                </span>
                <div>
                  <h3 className="text-[19px] font-bold leading-tight">Pranav</h3>
                  <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                    {tr("Developer · SWPS platform")}
                  </p>
                </div>
              </div>
              <p className="relative mt-4 text-[13px] leading-relaxed text-muted-foreground">
                {tr(
                  "For technical questions about the firmware, the dashboard or the adaptive control logic, use the form on this page — messages are logged against this project."
                )}
              </p>
              <div className="relative mt-5 space-y-2.5 border-t border-border pt-4 text-[12.5px]">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="h-3.5 w-3.5 text-primary" />
                  Pranav · {tr("Developer")}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  
                  <EmailLink className="text-[12.5px] text-muted-foreground" />
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {tr("Hyderabad, Telangana")}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-secondary/40 p-6">
              <h3 className="text-[14px] font-bold">{tr("Project guide")}</h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">Dr. Amrita Saha</p>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                {tr(
                  "Questions about the research, the control logic or a collaboration can be sent through the form on this page and will be passed on to the guide."
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-[14px] font-bold">{tr("Deployment enquiries")}</h3>
              <p className="mt-2 text-[12.5px] leading-relaxed text-muted-foreground">
                {tr(
                  "If you represent a panchayat, school or health centre interested in trialling a unit, include your location, the water source type and roughly how many people it serves."
                )}
              </p>
            </div>
          </div>
        </div>
      </Section>
    </>);

}
