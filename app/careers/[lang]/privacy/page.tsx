import type { Metadata } from "next";
import { careersCopy, type CareersLocale } from "@/lib/careers/i18n";

type Props = { params: Promise<{ lang: CareersLocale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: careersCopy[(await params).lang].notice.metaTitle,
    // Linked from the forms, but kept out of search results; its links are followed.
    robots: { index: false, follow: true },
  };
}

export default async function CandidateNoticePage({ params }: Props) {
  const { lang } = await params;
  const n = careersCopy[lang].notice;
  return (
    <article className="container-site max-w-3xl py-10 sm:py-16">
      <h1 className="h-serif text-4xl leading-[1.05] sm:text-5xl">{n.title}</h1>
      <p className="body-lead mt-6">{n.intro}</p>
      <div className="mt-10 space-y-8 border-t border-line pt-8">
        {n.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-serif text-2xl text-ink">{s.heading}</h2>
            {s.body && <p className="mt-3 text-[15px] leading-relaxed text-slate">{s.body}</p>}
            {s.items && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-slate marker:text-fred">
                {s.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}
