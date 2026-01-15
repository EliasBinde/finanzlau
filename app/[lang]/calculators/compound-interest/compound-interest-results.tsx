"use client";

import * as React from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { CompoundInterestCharts } from "./compound-interest-charts";

type Point = {
    year: number;
    total: number;
    contributions: number;
    interest: number;
};

type CalcResult = {
    final: number;
    contributions: number;
    interest: number;
};

function formatCurrencyEUR(n: number, lang: Locale): string {
    const locale = lang === "de" ? "de-DE" : "en-US";
    return `${Math.round(n).toLocaleString(locale)} €`;
}

export function CompoundInterestResults({
                                            dict,
                                            lang,
                                            show,
                                            result,
                                            points,
                                        }: {
    dict: Dictionary;
    lang: Locale;
    show: boolean;
    result: CalcResult;
    points: Point[];
}) {
    const t = dict.calculators.compoundInterest;

    if (!show) {
        return (
            <Card>
                <CardContent className="space-y-2 p-6">
                    <p className="text-base font-semibold">{t.empty.title}</p>
                    <p className="text-sm text-muted-foreground">{t.empty.body}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Numbers */}
            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">{t.results.final}</p>
                            <p className="text-2xl font-semibold">{formatCurrencyEUR(result.final, lang)}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-muted-foreground">{t.results.contributions}</p>
                                <p className="text-lg font-semibold">{formatCurrencyEUR(result.contributions, lang)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">{t.results.interest}</p>
                                <p className="text-lg font-semibold">{formatCurrencyEUR(result.interest, lang)}</p>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full sm:w-auto">{dict.home.cta.primary}</Button>

                    <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
                </CardContent>
            </Card>

            {/* Charts on results side */}
            <CompoundInterestCharts dict={dict} lang={lang} points={points} />
        </div>
    );
}