"use client";

import * as React from "react";
import type {Dictionary, Locale} from "@/app/[lang]/dictionaries";

import {Card, CardContent} from "@/components/ui/card";

import {LineChart} from "@mui/x-charts/LineChart";
import {BarChart} from "@mui/x-charts/BarChart";

type Point = {
    year: number;
    total: number;
    contributions: number;
    interest: number;
};

function formatK(n: number, lang: Locale): string {
    const locale = lang === "de" ? "de-DE" : "en-US";
    const rounded = Math.round(n / 1000);
    return `${rounded.toLocaleString(locale)}k`;
}

export function CompoundInterestCharts({
                                           dict,
                                           lang,
                                           points,
                                       }: {
    dict: Dictionary;
    lang: Locale;
    points: Point[];
}) {
    const t = dict.calculators.compoundInterest;

    const xYears = points.map((p) => p.year);
    const seriesContrib = points.map((p) => p.contributions);
    const seriesInterest = points.map((p) => p.interest);
    const seriesTotal = points.map((p) => p.total);

    return (
        <div className="space-y-6">
            {/* Stacked bars */}
            <Card>
                <CardContent className="space-y-3 p-6">
                    <div>
                        <p className="text-sm font-medium">{t.charts.splitTitle}</p>
                        <p className="text-sm text-muted-foreground">{t.charts.splitSubtitle}</p>
                    </div>

                    <div className="h-56 w-full">
                        <BarChart
                            xAxis={[
                                {data: xYears, valueFormatter: (v) => `${v}y`, scaleType: "band"},
                            ]}
                            series={[
                                {data: seriesContrib, stack: "total", label: t.results.contributions},
                                {data: seriesInterest, stack: "total", label: t.results.interest},
                            ]}
                            height={224}
                            margin={{left: 64, right: 16, top: 8, bottom: 32}}
                            yAxis={[{valueFormatter: (v: number) => formatK(v, lang)}]}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Line */}
            <Card>
                <CardContent className="space-y-3 p-6">
                    <p className="text-sm font-medium">{t.charts.trendTitle}</p>

                    <div className="h-48 w-full">
                        <LineChart
                            xAxis={[{data: xYears, valueFormatter: (v: number) => `${v}y`}]}
                            series={[{data: seriesTotal, label: t.results.final}]}
                            height={192}
                            margin={{left: 64, right: 16, top: 8, bottom: 32}}
                            yAxis={[{valueFormatter: (v: number) => formatK(v, lang)}]}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}