"use client";

import * as React from "react";
import type {Dictionary, Locale} from "@/app/[lang]/dictionaries";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

import {PieChart} from "@mui/x-charts/PieChart";
import type {DeductionLine, GrossNetResult} from "@/lib/calculators/gross-net/gross-net";

function sum(lines: DeductionLine[], key: DeductionLine["key"]): number {
    let s = 0;
    for (const l of lines) if (l.key === key) s += l.periodCents;
    return s;
}

function formatCurrencyFromCents(cents: number, lang: Locale): string {
    const locale = lang === "de" ? "de-DE" : "en-US";
    return `${Math.round(cents / 100).toLocaleString(locale)} €`;
}

export function GrossNetCharts({
                                   dict,
                                   lang,
                                   result,
                               }: {
    dict: Dictionary;
    lang: Locale;
    result: GrossNetResult;
}) {
    const t = dict.calculators.grossNet;

    const lines = result.employee.deductions;

    const data = [
        {id: 0, key: "wageTax", label: t.results.wageTax, value: sum(lines, "wageTax")},
        {id: 1, key: "soli", label: t.results.solidarity, value: sum(lines, "soli")},
        {id: 2, key: "churchTax", label: t.results.churchTax, value: sum(lines, "churchTax")},
        {id: 3, key: "rv", label: t.results.rv, value: sum(lines, "rv")},
        {id: 4, key: "av", label: t.results.av, value: sum(lines, "av")},
        {id: 5, key: "kv", label: t.results.kv, value: sum(lines, "kv")},
        {id: 6, key: "pv", label: t.results.pv, value: sum(lines, "pv")},
    ].filter((x) => x.value > 0);


    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {t.chart.title}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="w-full">
                    <PieChart
                        series={[
                            {
                                data: data.map((d) => ({id: d.id, value: d.value, label: d.label})),
                                innerRadius: 58,
                                outerRadius: 100,
                                paddingAngle: 2,
                                cornerRadius: 6,
                            },
                        ]}
                        colors={[
                            "#2563eb",
                            "#0ea5e9",
                            "#7c3aed",
                            "#16a34a",
                            "#f59e0b",
                            "#ef4444",
                            "#64748b",
                        ]}
                        height={220}
                        margin={{left: 16, right: 16, top: 8, bottom: 8}}
                    />
                </div>
            </CardContent>
        </Card>
    );
}