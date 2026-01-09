import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import {UrlObject} from "url";

type Props = {
    lang: string;
    dict: Dictionary;
};

function withLang(href: string, lang: string): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return { pathname: path };
}

export function HomeHero({ lang, dict }: Props) {
    const hero = dict.home.hero;

    const badges = [
        hero.badge, hero.badge2
    ]

    return (
        <section className="pt-8">
            <div className="grid items-center gap-10 lg:grid-cols-2">
                {/* TEXT */}
                <div className="space-y-5">
                    {Array.isArray(badges) && badges.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {badges.map((label) => (
                                <Badge key={label} variant="secondary">
                                    {label}
                                </Badge>
                            ))}
                        </div>
                    ) : null}

                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            {hero.title}
                        </h1>

                        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
                            {hero.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button asChild>
                            <Link href={withLang("/contact", lang)}>
                                {hero.primaryCta}
                            </Link>
                        </Button>

                        <Button asChild variant="outline">
                            <Link href={withLang("/about", lang)}>
                                {hero.secondaryCta}
                            </Link>
                        </Button>
                    </div>

                    {hero.disclaimer ? (
                        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                            {hero.disclaimer}
                        </p>
                    ) : null}
                </div>

                {/* IMAGE */}
                <div className="relative overflow-hidden rounded-xl">
                    <Image
                        src="https://placekittens.com/1200/900"
                        alt={hero.title}
                        width={1200}
                        height={900}
                        priority
                        className="h-[260px] w-full object-cover sm:h-[340px] lg:h-[420px]"
                    />
                </div>
            </div>
        </section>
    );
}