import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

type Props = {
    dict: Dictionary;
};

export function HomeServices({ dict }: Props) {
    const { title, subtitle, items } = dict.home.services;

    return (
        <section aria-label={title} className="w-full py-12 sm:py-16">
            <div className="mx-auto w-full max-w-6xl">
                <div className="mb-10 max-w-2xl">
                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
                    <p className="mt-2 text-muted-foreground">{subtitle}</p>
                </div>

                <div className="mt-4 flex w-full flex-col gap-6 md:flex-row md:gap-6">
                    {items.map((item, idx) => (
                        <Card
                            key={item.title}
                            className="flex w-full flex-col overflow-hidden p-0 md:flex-1"
                        >
                            <CardHeader className="p-0">
                                <Image
                                    src={`/home/service-${idx + 1}.jpg`}
                                    alt={dict.home.images.serviceAlt}
                                    width={520}
                                    height={390}
                                    className="block h-56 w-full object-cover sm:h-64 md:h-52 lg:h-56"
                                    loading="lazy"
                                />
                            </CardHeader>

                            <CardContent className="flex flex-1 flex-col gap-3 p-6">
                                <div>
                                    <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                                </div>

                                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>

                                <div className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium text-primary">
                                    <span>Mehr erfahren</span>
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
