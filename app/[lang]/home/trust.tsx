import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

type Props = {
    dict: Dictionary;
};

export function HomeTrust({ dict }: Props) {
    const { title, subtitle, quotes } = dict.home.trust;

    return (
        <section aria-label={title} className="w-full py-12 sm:py-16">
            <div className="mx-auto w-full max-w-6xl">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div className="max-w-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
                        <p className="mt-2 text-muted-foreground">{subtitle}</p>
                    </div>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                    {quotes.map((q) => (
                        <Card key={`${q.name}-${q.role}`} className="p-0">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted ml-4 aspect-square"
                                        aria-hidden="true"
                                    >
                                        <Quote className="h-5 w-5" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm leading-relaxed text-foreground">“{q.quote}”</p>

                                        <div className="mt-4">
                                            <div className="text-sm font-medium">{q.name}</div>
                                            <div className="text-xs text-muted-foreground">{q.role}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}