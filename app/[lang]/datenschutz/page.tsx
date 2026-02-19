import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries";

export default async function Page({ params }: PageProps<"/[lang]/datenschutz">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { dict } = await getDictionary(lang);
  const t = dict.privacyPage;

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>

      <section className="space-y-3 text-sm leading-relaxed">
        {t.intro.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.serverLogs.title}</h2>
        {t.serverLogs.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <ul className="list-disc space-y-1 pl-5">
          {t.serverLogs.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{t.serverLogs.legal}</p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.controller.title}</h2>
        <p>
          {t.controller.controllerLabel}
          <br />
          {t.controller.lines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <p>
          {t.controller.contactLabel}
          <br />
          {t.controller.lines[0]}
          <br />
          {t.controller.lines[4]}
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.email.title}</h2>
        {t.email.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.contactForm.title}</h2>
        {t.contactForm.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.googleServices.title}</h2>
        {t.googleServices.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <p>
          {t.googleServices.moreInfo}
          {" "}
          <a
            className="underline"
            href={t.googleServices.linkHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.googleServices.linkLabel}
          </a>
        </p>
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.cookies.title}</h2>
        {t.cookies.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.retention.title}</h2>
        {t.retention.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.rights.title}</h2>
        {t.rights.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="space-y-3 text-sm leading-relaxed">
        <h2 className="text-xl font-semibold">{t.authority.title}</h2>
        <p>{t.authority.intro}</p>
        <p>
          {t.authority.lines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
      </section>

      <p className="text-xs text-muted-foreground">{t.lastUpdated}</p>
    </article>
  );
}
