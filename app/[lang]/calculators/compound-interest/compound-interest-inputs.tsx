"use client";

import * as React from "react";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type InputsState = {
    initial: number;
    monthly: number;
    years: number;
    rate: number;
};

function clampNumber(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
}

function parseNumberInput(raw: string): number {
    // allow "5,5" (DE keyboards)
    const normalized = raw.replace(",", ".").trim();
    const n = Number(normalized);
    return Number.isFinite(n) ? n : 0;
}

export function CompoundInterestInputs({
                                           dict,
                                           lang,
                                           value,
                                           onChange,
                                           onCalculate,
                                           onReset,
                                       }: {
    dict: Dictionary;
    lang: Locale;
    value: InputsState;
    onChange: (next: InputsState) => void;
    onCalculate: () => void;
    onReset: () => void;
}) {
    const t = dict.calculators.compoundInterest;

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ci-initial">{t.inputs.initial}</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="ci-initial"
                            inputMode="decimal"
                            value={String(value.initial)}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    initial: clampNumber(parseNumberInput(e.target.value), 0, 100000000),
                                })
                            }
                        />
                        <span className="text-sm text-muted-foreground">{t.units.currency}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ci-monthly">{t.inputs.monthly}</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="ci-monthly"
                            inputMode="decimal"
                            value={String(value.monthly)}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    monthly: clampNumber(parseNumberInput(e.target.value), 0, 100000),
                                })
                            }
                        />
                        <span className="text-sm text-muted-foreground">{t.units.currency}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ci-years">{t.inputs.years}</Label>
                    <Input
                        id="ci-years"
                        inputMode="numeric"
                        value={String(value.years)}
                        onChange={(e) =>
                            onChange({
                                ...value,
                                years: clampNumber(Math.round(parseNumberInput(e.target.value)), 1, 60),
                            })
                        }
                    />
                    <p className="text-xs text-muted-foreground">{t.units.yearsRange}</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="ci-rate">{t.inputs.rate}</Label>
                    <div className="flex items-center gap-2">
                        <Input
                            id="ci-rate"
                            inputMode="decimal"
                            value={String(value.rate)}
                            onChange={(e) =>
                                onChange({
                                    ...value,
                                    rate: clampNumber(parseNumberInput(e.target.value), 0, 30),
                                })
                            }
                        />
                        <span className="text-sm text-muted-foreground">{t.units.percent}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t.units.rateRange}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" onClick={onCalculate} className="sm:w-auto w-full">
                    {t.actions.calculate}
                </Button>
                <Button type="button" variant="outline" onClick={onReset} className="sm:w-auto w-full">
                    {t.actions.reset}
                </Button>
            </div>
        </div>
    );
}