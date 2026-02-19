import {notFound} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {ArrowRight, CalendarDays} from "lucide-react";
import {getDictionary, hasLocale, type Locale} from "../dictionaries";
import {UrlObject} from "url";

function withLang(href: string, lang: Locale): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return {pathname: path};
}

export default async function Page({params}: PageProps<'/[lang]/business-customers'>) {
    const {lang} = await params;

    if (!hasLocale(lang)) notFound();

    const {dict} = await getDictionary(lang);
    const t = dict.businessCustomers;

    return (
        <div className="flex flex-col gap-12 py-4 sm:gap-16 sm:py-8">
            <section className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-10">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-muted/50 via-background to-muted/20"
                />
                <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
                    <div className="min-w-0 [overflow-wrap:anywhere]">
                        <div className="flex flex-wrap gap-2">
                            {t.hero.badges.map((label) => (
                                <Badge key={label} variant="secondary" className="max-w-full break-words [overflow-wrap:anywhere]">
                                    {label}
                                </Badge>
                            ))}
                        </div>

                        <h1 className="mt-4 max-w-3xl break-words text-3xl font-bold tracking-tight [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
                            {t.hero.title}
                        </h1>

                        <p className="mt-4 max-w-2xl break-words text-base leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
                            {t.hero.subtitle}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button asChild>
                                <Link href={withLang("/contact", lang)}>{t.hero.primaryCta}</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href={withLang("/contact", lang)}>{t.hero.secondaryCta}</Link>
                            </Button>
                        </div>
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-xl border bg-background/80">
                        <Image
                            src="/bcs.jpg"
                            alt={t.hero.title}
                            width={1200}
                            height={900}
                            priority
                            className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                        />
                    </div>
                </div>
            </section>

            <section aria-label={t.statsAriaLabel}>
                <div className="grid gap-4 md:grid-cols-3">
                    {t.stats.map((item) => (
                        <Card key={`${item.value}-${item.label}`} className="p-0">
                            <CardContent className="p-6">
                                <p className="text-3xl font-semibold tracking-tight">{item.value}</p>
                                <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section aria-label={t.pillars.title}>
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.pillars.title}</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">{t.pillars.subtitle}</p>
                    <p className="mt-3 text-sm text-muted-foreground">{t.hero.disclaimer}</p>

                    <div className="mt-6 space-y-4">
                        {t.pillars.items.map((item, idx) => (
                            <Card key={item.title} className="p-0">
                                <CardContent className="flex gap-4 p-5 sm:p-6">
                                    <div
                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                                        {idx + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold">{item.title}</h3>
                                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                            {item.body}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section aria-label={t.quotes.title}>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t.quotes.title}</h2>
                    <p className="text-muted-foreground">{t.quotes.subtitle}</p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {t.quotes.items.map((q) => (
                        <Card key={`${q.name}-${q.role}`} className="p-0">
                            <CardContent className="p-6">
                                <p className="text-base leading-relaxed">“{q.quote}”</p>
                                <div className="mt-4 border-t pt-4">
                                    <p className="text-sm font-medium">{q.name}</p>
                                    <p className="text-xs text-muted-foreground">{q.role}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section aria-label={t.cta.title} className="rounded-2xl border bg-card p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-end">
                    <div>
                        <div
                            className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-medium">
                            <CalendarDays className="h-4 w-4" aria-hidden="true"/>
                            <span>{t.cta.subtitle}</span>
                        </div>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{t.cta.title}</h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t.cta.body}</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <Button asChild>
                            <Link href={withLang("/contact", lang)}>{t.cta.primary}</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href={withLang("/calculators", lang)} className="flex items-center gap-2">
                                {t.cta.secondary}
                                <ArrowRight className="h-4 w-4" aria-hidden="true"/>
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
