import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";
import {UrlObject} from "url";

type Props = {
    lang: Locale;
    dict: Dictionary;
};

function withLang(href: string, lang: string): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return { pathname: path };
}

export function HomeCta({ lang, dict }: Props) {
    const cta = dict.home.cta;
    const aside = dict.home.aside;

    return (
        <section aria-label={cta.title} className="w-full py-12 sm:py-16">
            <div className="mx-auto w-full max-w-6xl">
                <div className="relative overflow-hidden rounded-xl border bg-card">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-linear-to-br from-muted/40 via-background to-muted/20"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-muted/50 blur-3xl"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full bg-muted/50 blur-3xl"
                    />

                    <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
                        <div className="lg:col-span-7">
                            <div className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-1 text-xs font-medium">
                                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                                <span>{cta.subtitle}</span>
                            </div>

                            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                                {cta.title}
                            </h2>

                            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                {aside.body}
                            </p>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                                <Button asChild>
                                    <Link href={withLang("/contact", lang)}>
                                        {cta.primary}
                                    </Link>
                                </Button>

                                <Button asChild variant="outline">
                                    <Link href={withLang("/blog", lang)} className="flex items-center gap-2">
                                        {cta.secondary}
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-8 rounded-lg border bg-background/70 p-4">
                                <div className="text-sm font-semibold">{aside.title}</div>
                                <div className="mt-1 text-sm text-muted-foreground">{aside.subtitle}</div>

                                <div className="mt-4">
                                    <Button asChild size="sm" variant="secondary">
                                        <Link href={withLang("/contact", lang)}>{aside.cta}</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="relative overflow-hidden rounded-xl border bg-muted">
                                <Image
                                    src={`https://placekittens.com/${1200}/${700}`}
                                    alt={dict.home.images.ctaAlt}
                                    width={900}
                                    height={700}
                                    className="h-65 w-full object-cover sm:h-80 lg:h-105"
                                    priority={false}
                                />
                            </div>

                            <p className="mt-3 text-xs text-muted-foreground">
                                {dict.home.images.ctaAlt}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}