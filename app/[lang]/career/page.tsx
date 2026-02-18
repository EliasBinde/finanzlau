import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, CalendarDays, Sparkles } from "lucide-react";
import { getDictionary, hasLocale, type Locale } from "../dictionaries";
import { UrlObject } from "url";

function withLang(href: string, lang: Locale): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return { pathname: path };
}

export default async function Page({ params }: PageProps<'/[lang]/career'>) {
    const { lang } = await params;

    if (!hasLocale(lang)) notFound();

    const { dict } = await getDictionary(lang);
    const t = dict.career;

    return (
        <div className="flex flex-col gap-10 md:gap-4">
            <section className="pt-8">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div className="space-y-5">
                        <div className="flex flex-wrap gap-2">
                            {t.hero.badges.map((label) => (
                                <Badge key={label} variant="secondary">
                                    {label}
                                </Badge>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                                {t.hero.title}
                            </h1>
                            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                                {t.hero.subtitle}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 pt-2">
                            <Button asChild>
                                <Link href={withLang("/contact", lang)}>{t.hero.primaryCta}</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={withLang("/contact", lang)}>{t.hero.secondaryCta}</Link>
                            </Button>
                        </div>

                        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                            {t.hero.disclaimer}
                        </p>
                    </div>

                    <div className="rounded-xl border bg-card p-6 sm:p-8">
                        <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-medium">
                            <Sparkles className="h-4 w-4" aria-hidden="true" />
                            <span>{t.cta.subtitle}</span>
                        </div>

                        <h2 className="mt-4 text-2xl font-semibold tracking-tight">{t.roadmap.title}</h2>
                        <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
                            {t.roadmap.items.map((item) => (
                                <li key={item} className="rounded-md border bg-background/70 px-3 py-2">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section aria-label="Career stats" className="w-full py-10 sm:py-14">
                <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
                    {t.stats.map((item) => (
                        <Card key={`${item.value}-${item.label}`} className="w-full md:flex-1">
                            <CardContent className="p-5 sm:p-6">
                                <div className="text-2xl font-semibold tracking-tight">{item.value}</div>
                                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section aria-label={t.pillars.title} className="w-full py-12 sm:py-16">
                <div className="mb-10 max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.pillars.title}</h2>
                    <p className="mt-2 text-muted-foreground">{t.pillars.subtitle}</p>
                </div>

                <div className="mt-4 grid w-full gap-6 md:grid-cols-3">
                    {t.pillars.items.map((item) => (
                        <Card key={item.title} className="p-0">
                            <CardHeader className="px-6 pt-6 pb-3">
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section aria-label={t.quotes.title} className="w-full py-12 sm:py-16">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.quotes.title}</h2>
                    <p className="mt-2 text-muted-foreground">{t.quotes.subtitle}</p>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {t.quotes.items.map((q) => (
                        <Card key={`${q.name}-${q.role}`} className="p-0">
                            <CardContent className="p-6">
                                <p className="text-sm leading-relaxed text-foreground">“{q.quote}”</p>
                                <div className="mt-4">
                                    <div className="text-sm font-medium">{q.name}</div>
                                    <div className="text-xs text-muted-foreground">{q.role}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section aria-label={t.cta.title} className="w-full py-12 sm:py-16">
                <div className="relative overflow-hidden rounded-xl border bg-card">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-linear-to-br from-muted/40 via-background to-muted/20"
                    />
                    <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-8">
                            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-medium">
                                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                <span>{t.cta.subtitle}</span>
                            </div>

                            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                                {t.cta.title}
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                {t.cta.body}
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Button asChild>
                                    <Link href={withLang("/contact", lang)}>{t.cta.primary}</Link>
                                </Button>

                                <Button asChild variant="outline">
                                    <Link href={withLang("/calculators", lang)} className="flex items-center gap-2">
                                        {t.cta.secondary}
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="rounded-xl border bg-background/70 p-4">
                                <div className="flex items-start gap-3">
                                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                                    <p className="text-sm text-muted-foreground">{t.hero.disclaimer}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
