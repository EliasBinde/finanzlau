"use client";

import * as React from "react";
import type {Dictionary, Locale} from "@/app/[lang]/dictionaries";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

import {GrossNetCharts} from "./gross-net-charts";
import type {DeductionLine, GrossNetResult} from "@/lib/calculators/gross-net/gross-net";

function formatEURFromCents(cents: number, lang: Locale): string {
    const locale = lang === "de" ? "de-DE" : "en-US";
    return (cents / 100).toLocaleString(locale, {style: "currency", currency: "EUR"});
}

function Row({label, value}: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-0.5">
            <p className="text-sm text-muted-foreground leading-snug min-w-0">{label}</p>
            <p className="text-sm font-medium text-right tabular-nums whitespace-nowrap">{value}</p>
        </div>
    );
}

type Breakdown = {
    wageTaxCents: number;
    soliCents: number;
    churchCents: number;

    rvCents: number;
    avCents: number;
    kvCents: number;
    pvCents: number;

    taxesTotalCents: number;
    socialTotalCents: number;
};

function sum(lines: DeductionLine[], key: DeductionLine["key"]): number {
    let s = 0;
    for (const l of lines) if (l.key === key) s += l.periodCents;
    return s;
}

function computeBreakdown(result: GrossNetResult): Breakdown {
    const lines = result.employee.deductions;

    const wageTaxCents = sum(lines, "wageTax");
    const soliCents = sum(lines, "soli");
    const churchCents = sum(lines, "churchTax");

    const rvCents = sum(lines, "rv");
    const avCents = sum(lines, "av");
    const kvCents = sum(lines, "kv");
    const pvCents = sum(lines, "pv");

    const taxesTotalCents = wageTaxCents + soliCents + churchCents;
    const socialTotalCents = rvCents + avCents + kvCents + pvCents;

    return {
        wageTaxCents,
        soliCents,
        churchCents,
        rvCents,
        avCents,
        kvCents,
        pvCents,
        taxesTotalCents,
        socialTotalCents,
    };
}

export function GrossNetResults({
                                    dict,
                                    lang,
                                    show,
                                    result,
                                }: {
    dict: Dictionary;
    lang: Locale;
    show: boolean;
    result: GrossNetResult;
}) {
    const t = dict.calculators.grossNet;

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

    const b = computeBreakdown(result);

    const grossCents = result.meta.grossPeriodCents;
    const netCents = result.employee.netPeriodCents;

    return (
        <div className="space-y-6 min-w-0">
            <Card className="min-w-0">
                <CardContent className="space-y-6 p-6 min-w-0">
                    <div className="grid gap-4 min-w-0">
                        <div className="min-w-0">
                            <p className="text-sm text-muted-foreground">{t.results.net}</p>
                            <p className="text-3xl font-semibold tracking-tight tabular-nums">
                                {formatEURFromCents(netCents, lang)}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t.results.fromGrossPrefix} {formatEURFromCents(grossCents, lang)}
                            </p>
                        </div>

                        <div className="rounded-xl border p-4 space-y-2 min-w-0">
                            <Row label={t.results.taxesTotal} value={formatEURFromCents(b.taxesTotalCents, lang)}/>
                            <Row label={t.results.socialTotal} value={formatEURFromCents(b.socialTotalCents, lang)}/>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 min-w-0">
                            <div className="rounded-xl border p-4 space-y-2 min-w-0">
                                <p className="text-sm font-medium">{t.results.taxesTitle}</p>
                                <div className="space-y-2">
                                    <Row label={t.results.wageTax} value={formatEURFromCents(b.wageTaxCents, lang)}/>
                                    <Row label={t.results.solidarity} value={formatEURFromCents(b.soliCents, lang)}/>
                                    <Row label={t.results.churchTax} value={formatEURFromCents(b.churchCents, lang)}/>
                                </div>
                            </div>

                            <div className="rounded-xl border p-4 space-y-2 min-w-0">
                                <p className="text-sm font-medium">{t.results.socialTitle}</p>
                                <div className="space-y-2">
                                    <Row label={t.results.rv} value={formatEURFromCents(b.rvCents, lang)}/>
                                    <Row label={t.results.av} value={formatEURFromCents(b.avCents, lang)}/>
                                    <Row label={t.results.kv} value={formatEURFromCents(b.kvCents, lang)}/>
                                    <Row label={t.results.pv} value={formatEURFromCents(b.pvCents, lang)}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Button className="w-full sm:w-auto">{dict.home.cta.primary}</Button>
                    <p className="text-xs text-muted-foreground">{t.disclaimer}</p>
                </CardContent>
            </Card>

            <GrossNetCharts dict={dict} lang={lang} result={result}/>
        </div>
    );
}