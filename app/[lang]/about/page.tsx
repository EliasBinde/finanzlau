import {notFound} from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {MapPin} from "lucide-react";
import {getDictionary, hasLocale, type Locale} from "../dictionaries";
import {UrlObject} from "url";

function withLang(href: string, lang: Locale): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return {pathname: path};
}

export default async function Page({params}: PageProps<'/[lang]/about'>) {
    const {lang} = await params;

    if (!hasLocale(lang)) notFound();

    const {dict} = await getDictionary(lang);
    const t = dict.aboutPage;

    return (
        <div className="flex flex-col gap-12 py-4 sm:gap-16 sm:py-8">
            <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
                <div className="space-y-5">
                    <Badge variant="secondary" className="h-7 px-3 text-sm">
                        {t.hero.badge}
                    </Badge>
                    <h1 className="sm:mb-18 mb-4 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl ">{t.hero.title}</h1>
                    <div className="space-y-4 text-base leading-relaxed text-muted-foreground font-semibold">
                        {t.hero.intro.map((p) => (
                            <p key={p}>{p}</p>
                        ))}
                    </div>
                </div>

                <Card className="overflow-hidden p-0">
                    <Image
                        src="/max.jpg"
                        alt={t.profile.imageAlt}
                        width={900}
                        height={1100}
                        className="h-80 w-full object-cover object-[center_-40px] sm:h-105"
                        priority
                    />
                    <CardHeader className="px-6 pt-5 pb-2">
                        <CardTitle>{t.profile.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{t.profile.role}</p>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        <div className="rounded-lg border bg-background/70 p-3">
                            <p className="text-sm font-semibold text-muted-foreground">{t.profile.cardBody}</p>
                            <div className="mt-3 flex items-start gap-2 text-sm">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true"/>
                                <div className="leading-relaxed text-muted-foreground">
                                    <p>Mörsenbroicher Weg 200</p>
                                    <p>40470 Düsseldorf</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <Card className="p-0">
                    <CardHeader className="px-6 pt-6 pb-2">
                        <CardTitle>{t.privateClients.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {t.privateClients.paragraphs.map((p) => (
                            <p key={p}>{p}</p>
                        ))}
                    </CardContent>
                </Card>

                <Card className="p-0">
                    <CardHeader className="px-6 pt-6 pb-2">
                        <CardTitle>{t.businessLeaders.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {t.businessLeaders.paragraphs.map((p) => (
                            <p key={p}>{p}</p>
                        ))}
                    </CardContent>
                </Card>
            </section>

            <section className="rounded-2xl border bg-card p-6 sm:p-8">
                <p className="max-w-4xl text-base leading-relaxed text-foreground">{t.closing}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Button asChild>
                        <Link href={withLang("/contact", lang)}>{t.cta.primary}</Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href={withLang("/business-customers", lang)}>{t.cta.secondary}</Link>
                    </Button>
                    <Button asChild variant="secondary">
                        <Link href={withLang("/calculators", lang)}>{t.cta.tertiary}</Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
