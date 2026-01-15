"use client";

import * as React from "react";
import { useMemo, useState } from "react";

import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Card, CardContent } from "@/components/ui/card";

import { CompoundInterestInputs, type InputsState } from "./compound-interest-inputs";
import { CompoundInterestResults } from "./compound-interest-results";

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

function clampNumber(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
}

function computePoints(inputs: InputsState): { result: CalcResult; points: Point[] } {
    const years = clampNumber(Math.round(inputs.years), 1, 60);
    const monthly = clampNumber(inputs.monthly, 0, 100000);
    const initial = clampNumber(inputs.initial, 0, 100000000);
    const rate = clampNumber(inputs.rate, 0, 30);

    const months = years * 12;
    const monthlyRate = rate / 100 / 12;

    let balance = initial;
    let contributions = initial;

    const monthlyPoints: { month: number; total: number; contributions: number; interest: number }[] = [];

    for (let m = 0; m <= months; m++) {
        if (m > 0) {
            balance += monthly;
            contributions += monthly;
            balance *= 1 + monthlyRate;
        }
        monthlyPoints.push({
            month: m,
            total: balance,
            contributions,
            interest: balance - contributions,
        });
    }

    const yearly: Point[] = [];
    for (let y = 0; y <= years; y++) {
        const idx = Math.min(y * 12, monthlyPoints.length - 1);
        const p = monthlyPoints[idx];
        yearly.push({
            year: y,
            total: Math.round(p.total),
            contributions: Math.round(p.contributions),
            interest: Math.round(p.interest),
        });
    }

    const last = yearly[yearly.length - 1];
    return {
        result: {
            final: last.total,
            contributions: last.contributions,
            interest: last.interest,
        },
        points: yearly,
    };
}

export function CompoundInterestCalculator({
                                               dict,
                                               lang,
                                           }: {
    dict: Dictionary;
    lang: Locale;
}) {
    const t = dict.calculators.compoundInterest;

    const [inputs, setInputs] = useState<InputsState>({
        initial: 5000,
        monthly: 100,
        years: 10,
        rate: 5,
    });

    const [submittedInputs, setSubmittedInputs] = useState<InputsState | null>(null);

    const { result, points } = useMemo(() => {
        const src = submittedInputs ?? inputs;
        return computePoints(src);
    }, [inputs, submittedInputs]);

    const showResults = submittedInputs !== null;

    return (
        <div className="flex flex-col gap-6 md:flex-row">
            {/* Inputs (always visible) */}
            <Card className="md:w-1/2">
                <CardContent className="space-y-6 p-6">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">{t.title}</h2>
                        <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                    </div>

                    <CompoundInterestInputs
                        dict={dict}
                        lang={lang}
                        value={inputs}
                        onChange={setInputs}
                        onCalculate={() => setSubmittedInputs(inputs)}
                        onReset={() => {
                            setInputs({ initial: 5000, monthly: 100, years: 10, rate: 5 });
                            setSubmittedInputs(null);
                        }}
                    />
                </CardContent>
            </Card>

            {/* Results + Charts (only after Calculate) */}
            <div className="md:w-1/2">
                <CompoundInterestResults
                    dict={dict}
                    lang={lang}
                    show={showResults}
                    result={result}
                    points={points}
                />
            </div>
        </div>
    );
}