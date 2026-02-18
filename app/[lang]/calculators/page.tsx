import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, LifeBuoy, Percent, Wallet } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UrlObject } from "url";

function withLang(href: string, lang: string): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return { pathname: path };
}

export default async function Page({ params }: PageProps<'/[lang]/calculators'>) {
    const { lang } = await params;

    if (!hasLocale(lang)) notFound();

    const { dict } = await getDictionary(lang);
    const t = dict.calculators;

    const items = [
        {
            href: "/calculators/compound-interest" as const,
            title: t.compoundInterest.title,
            description: t.compoundInterest.subtitle,
            icon: Percent,
        },
        {
            href: "/calculators/gross-net" as const,
            title: t.grossNet.title,
            description: t.grossNet.subtitle,
            icon: Wallet,
        },
        {
            href: "/calculators/emergency-fund" as const,
            title: t.emergencyFund.title,
            description: t.emergencyFund.subtitle,
            icon: LifeBuoy,
        },
    ];

    return (
        <div className="flex flex-col gap-10 sm:gap-12">
            <section className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-10">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-muted/40 via-background to-muted/10"
                />

                <div className="relative max-w-3xl space-y-4">
                    <Badge variant="secondary" className="h-7 px-3 text-sm">
                        {t.overview.badge}
                    </Badge>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t.title}</h1>
                    <p className="text-base leading-relaxed text-muted-foreground">{t.overview.subtitle}</p>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Card key={item.href} className="group flex h-full flex-col p-0">
                            <CardHeader className="px-6 pt-6 pb-3">
                                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                </div>
                                <CardTitle className="text-xl">{item.title}</CardTitle>
                                <CardDescription className="pt-1 text-sm leading-relaxed">
                                    {item.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="mt-auto px-6 pb-6">
                                <Button asChild className="w-full justify-between">
                                    <Link href={withLang(item.href, lang)}>
                                        {t.overview.cardCta}
                                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </section>
        </div>
    );
}
