"use client";

import * as React from "react";
import {useEffect, useMemo, useRef, useState} from "react";

import type {Dictionary, Locale} from "@/app/[lang]/dictionaries";
import {Card, CardContent} from "@/components/ui/card";

import {GrossNetInputs, type InputsState} from "./gross-net-inputs";
import {GrossNetResults} from "./gross-net-results";

import {computeGrossNet} from "@/lib/calculators/gross-net/gross-net";
import {HEALTH_INSURANCE_BY_YEAR} from "@/lib/calculators/gross-net/health-insurance";

function clampNumber(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
}

function timeframeToCore(tf: InputsState["timeframe"]): "month" | "year" | "week" | "day" {
    if (tf === "yearly") return "year";
    if (tf === "weekly") return "week";
    if (tf === "daily") return "day";
    return "month";
}

function annualToPeriodAllowance(annual: number, tf: InputsState["timeframe"]): number {
    const a = clampNumber(annual, 0, 1_000_000);
    if (tf === "yearly") return a;
    if (tf === "monthly") return a / 12;
    if (tf === "weekly") return a / (360 / 7);
    return a / 360;
}

export function GrossNetCalculator({dict, lang}: { dict: Dictionary; lang: Locale }) {
    const t = dict.calculators.grossNet;

    const supportedYears = useMemo(() => [2026], []);

    const [inputs, setInputs] = useState<InputsState>({
        year: 2026,
        timeframe: "yearly",
        grossAmount: 50000,

        taxClass: 1,
        allowanceAnnual: 0,

        churchTaxEnabled: true,
        bundesland: "NW",

        birthYear: 2001,
        kids: 0,

        healthInsuranceType: "gkv-general",
        gkvProviderId: "tk",
        healthAddOnRatePct: 2.6,
        pkvEmployeeMonthly: 0,
        pkvEmployerSubsidy: true,

        pensionInsurance: true,

        umlageEnabled: false,
        umlageU1Pct: 1.6,
        umlageU2Pct: 0.39,
    });

    const [submittedInputs, setSubmittedInputs] = useState<InputsState | null>(null);

    const inputsRef = useRef(inputs);

    useEffect(() => {
        inputsRef.current = inputs;
    }, [inputs]);

    const gkvProviders = useMemo(() => {
        const y = HEALTH_INSURANCE_BY_YEAR[inputs.year];
        if (!y) return [];
        return y.insurances.map((i) => ({id: i.id, name: i.name}));
    }, [inputs.year]);

    const effective = submittedInputs ?? inputs;

    const result = useMemo(() => {
        const allowancePeriod = annualToPeriodAllowance(effective.allowanceAnnual, effective.timeframe);

        return computeGrossNet({
            gross: effective.grossAmount,
            timeframe: timeframeToCore(effective.timeframe),
            year: effective.year,

            steuerklasse: effective.taxClass,
            freibetrag: allowancePeriod,

            churchTax: effective.churchTaxEnabled,
            bundesland: effective.bundesland,

            birthYear: effective.birthYear,
            kids: effective.kids,

            healthType: effective.healthInsuranceType,
            gkvInsuranceId: effective.healthInsuranceType === "pkv" ? undefined : effective.gkvProviderId,
            pkvPremiumMonthly: effective.healthInsuranceType === "pkv" ? effective.pkvEmployeeMonthly : undefined,
            pkvEmployerSubsidy: effective.healthInsuranceType === "pkv" ? effective.pkvEmployerSubsidy : undefined,

            rvPflicht: effective.pensionInsurance,

            childAllowance: 0,

            umlagen: {
                enabled: effective.umlageEnabled,
                u1Pct: effective.umlageU1Pct,
                u2Pct: effective.umlageU2Pct,
            },
        });
    }, [effective]);

    const showResults = submittedInputs !== null;

    return (
        <div className="flex flex-col gap-6 md:flex-row">
            <Card className="md:w-1/2">
                <CardContent className="space-y-6 p-6">
                    <GrossNetInputs
                        dict={dict}
                        lang={lang}
                        value={inputs}
                        onChange={(next) => {
                            const year = supportedYears.includes(next.year) ? next.year : supportedYears[0] ?? 2026;
                            setInputs({...next, year});
                        }}
                        onCalculate={() => setSubmittedInputs(inputsRef.current)}
                        onReset={() => {
                            setInputs({
                                year: 2026,
                                timeframe: "yearly",
                                grossAmount: 50000,

                                taxClass: 1,
                                allowanceAnnual: 0,

                                churchTaxEnabled: true,
                                bundesland: "NW",

                                birthYear: 2001,
                                kids: 0,

                                healthInsuranceType: "gkv-general",
                                gkvProviderId: "tk",
                                healthAddOnRatePct: 2.6,
                                pkvEmployeeMonthly: 0,
                                pkvEmployerSubsidy: true,

                                pensionInsurance: true,

                                umlageEnabled: false,
                                umlageU1Pct: 1.6,
                                umlageU2Pct: 0.39,
                            });
                            setSubmittedInputs(null);
                        }}
                        supportedYears={supportedYears}
                        gkvProviders={gkvProviders}
                    />
                </CardContent>
            </Card>

            <div className="md:w-1/2">
                <GrossNetResults dict={dict} lang={lang} show={showResults} result={result}/>
            </div>

        </div>
    );
}