import type { Dictionary } from "@/app/[lang]/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, Sparkles, UserRound } from "lucide-react";

type Props = {
    dict: Dictionary;
};

const ICONS = [Sparkles, BadgeCheck, UserRound] as const;
export function HomeStats({ dict }: Props) {
    const items = dict.home.stats.items;

    return (
        <section aria-label="Key stats" className="w-full py-10 sm:py-14">
            {/* full-width section */}
            <div className="w-full">
                <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
                    {items.map((item, idx) => {
                        const Icon = ICONS[idx] ?? Sparkles;

                        return (
                            <Card
                                key={`${item.value}-${item.label}`}
                                className="w-full md:flex-1"
                            >
                                <CardContent className="p-5 sm:p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted ml-4 aspect-square">
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="text-2xl font-semibold tracking-tight">
                                                {item.value}
                                            </div>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {item.label}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}