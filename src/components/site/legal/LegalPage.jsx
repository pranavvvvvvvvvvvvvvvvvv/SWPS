import { Link } from "react-router-dom";
import { Mail, ShieldCheck } from "lucide-react";
import { PageHero, Section } from "@/components/site/Section";
import { useAutoTranslate } from "@/lib/AutoTranslate";

function Block({ block, tr }) {
  if (typeof block === "string") {
    return (
      <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">{tr(block)}</p>
    );
  }
  if (Array.isArray(block)) {
    return (
      <ul className="mt-3 space-y-2">
        {block.map((item) => (
          <li key={item} className="flex gap-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
            <span>{tr(item)}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (block.note) {
    return (
      <div className="mt-4 flex gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <p className="text-[13px] leading-relaxed text-foreground/80">{tr(block.note)}</p>
      </div>
    );
  }
  if (block.table) {
    const [head, ...rows] = block.table;
    return (
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[520px] text-left text-[12.5px]">
          <thead className="bg-secondary/60 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr>
              {head.map((h) => (
                <th key={h} className="px-3.5 py-2.5 font-semibold">
                  {tr(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row[0]} className="border-t border-border/70 align-top">
                {row.map((cell, i) => (
                  <td
                    key={i}
                    className={
                      i === 0
                        ? "px-3.5 py-3 font-mono text-[11.5px] text-primary"
                        : "px-3.5 py-3 text-muted-foreground"
                    }
                  >
                    {tr(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return null;
}

export default function LegalPage({ doc }) {
  const tr = useAutoTranslate();
  return (
    <>
      <PageHero
        eyebrow={tr(doc.eyebrow)}
        title={tr(doc.title)}
        description={tr(doc.description)}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[230px_1fr] lg:gap-14">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {tr("On this page")}
            </p>
            <nav className="mt-3 space-y-1.5 border-l border-border pl-3">
              {doc.sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block text-[12.5px] leading-snug text-foreground/65 transition-colors hover:text-primary"
                >
                  {tr(s.title)}
                </a>
              ))}
            </nav>
            <p className="mt-6 text-[11.5px] text-muted-foreground">
              {tr("Last updated")} {doc.updated}
            </p>
            <Link
              to="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
            >
              <Mail className="h-3.5 w-3.5" />
              {tr("Contact us")}
            </Link>
          </aside>

          <div className="min-w-0 max-w-3xl">
            {doc.sections.map((s) => (
              <section
                key={s.id}
                id={s.id}
                className="scroll-mt-28 border-t border-border py-7 first:border-t-0 first:pt-0"
              >
                <h2 className="text-[17px] font-bold leading-snug">{tr(s.title)}</h2>
                {s.blocks.map((block, i) => (
                  <Block key={i} block={block} tr={tr} />
                ))}
              </section>
            ))}

            <div className="mt-4 rounded-2xl border border-border bg-secondary/40 p-5">
              <p className="text-[13px] font-semibold">{tr("Questions about this document?")}</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {tr(
                  "Use the contact page to ask about these terms, request your data or report a problem. Messages reach the developer directly."
                )}
              </p>
              <Link
                to="/contact"
                className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5" />
                {tr("Open the contact page")}
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
