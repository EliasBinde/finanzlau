// app/[lang]/calculators/emergency-fund/calculator.tsx
"use client";

import * as React from "react";
import {useMemo, useState} from "react";

import type {Dictionary} from "@/app/[lang]/dictionaries";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

import {BarChart} from "@mui/x-charts/BarChart";
import {Briefcase, Circle, Shield, Wallet} from "lucide-react";

type EmploymentType = "employee" | "selfEmployed";
type EmployeeContract = "permanent" | "fixedTerm";

type Expenses = {
    rent: number;
    utilities: number;
    telecom: number;
    food: number;
    necessities: number;
};

type Inputs = {
    incomeNetMonthly: number;
    employmentType: EmploymentType;
    employeeContract: EmployeeContract;

    expenses: Expenses;

    currentLiquidity: number; // emergency cash buffer today
    savingsRatePercent: number; // user-adjustable (but recommended initially)
};

type MonthsRange = { min: number; max: number };

type Result = {
    expensesTotal: number;

    monthsRange: MonthsRange;
    targetMin: number;
    targetMax: number;

    liquidityStatus: "red" | "yellow" | "green";
    liquidityLabel: string;

    recommendedSavingsPerMonth: number; // computed suggestion in EUR
    recommendedSavingsRatePercent: number; // derived from EUR suggestion
    monthlySavingsFromRate: number; // based on user-chosen % (unchanged)

    monthsToMin: number | null;
    monthsToMax: number | null;
};

function clampNumber(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
}

function parseNumberInput(raw: string): number {
    const s = raw.trim();
    if (!s) return 0;

    const noSpaces = s.replace(/\s+/g, "");

    if (noSpaces.includes(".") && noSpaces.includes(",")) {
        const normalized = noSpaces.replace(/\./g, "").replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    if (noSpaces.includes(",")) {
        const normalized = noSpaces.replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    const n = Number(noSpaces);
    return Number.isFinite(n) ? n : 0;
}

// deterministic "DE-like" formatting to avoid hydration mismatch
function formatCurrencyEUR(n: number): string {
    const rounded = Math.round(n);
    const str = String(rounded);
    const grouped = str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return `${grouped} €`;
}

function monthsToTarget(target: number, monthlySavings: number): number | null {
    if (monthlySavings <= 0) return null;
    return Math.ceil(target / monthlySavings);
}

function computeMonthsRange(
    employmentType: EmploymentType,
    employeeContract: EmployeeContract,
    incomeNetMonthly: number
): MonthsRange {
    if (employmentType === "employee") {
        // Permanent is typically safer than fixed-term.
        if (employeeContract === "permanent") return {min: 3, max: 6};
        return {min: 4, max: 8};
    }

    // Self-employed: base 6–12, but "stability" improves with higher income (rough proxy)
    const income = clampNumber(incomeNetMonthly, 0, 200000);
    const lo = 1500;
    const hi = 12000;
    const stability = clampNumber((income - lo) / (hi - lo), 0, 1); // 0..1

    const baseMin = 6;
    const baseMax = 12;

    // Higher stability -> slightly fewer months needed
    const min = clampNumber(baseMin - Math.round(stability * 1), 4, 24);
    const max = clampNumber(baseMax - Math.round(stability * 3), min, 24);

    return {min, max};
}


function computeRecommendedSavingsPerMonth(args: {
    incomeNetMonthly: number;
    expensesTotal: number;
    currentLiquidity: number;
    targetMin: number;
    employmentType: EmploymentType;
    employeeContract: EmployeeContract;
}): number {
    const income = clampNumber(args.incomeNetMonthly, 0, 200000);
    const expenses = clampNumber(args.expensesTotal, 0, 200000);
    const liquidity = clampNumber(args.currentLiquidity, 0, 1_000_000_000);
    const targetMin = clampNumber(args.targetMin, 0, 1_000_000_000);

    if (income <= 0) return 0;

    const gapToMin = Math.max(0, targetMin - liquidity);
    if (gapToMin <= 0) return 0;

    const coverage = targetMin > 0 ? clampNumber(liquidity / targetMin, 0, 1) : 0;

    const baseHorizon =
        args.employmentType === "employee"
            ? args.employeeContract === "fixedTerm"
                ? 6
                : 8
            : 7;

    let horizonMonths = Math.round(baseHorizon + coverage * 10);
    horizonMonths = clampNumber(horizonMonths, 4, 18);
    if (coverage < 0.1) horizonMonths = Math.min(horizonMonths, 6);
    else if (coverage < 0.25) horizonMonths = Math.min(horizonMonths, 8);

    const required = gapToMin / horizonMonths;

    const baselineLiving = Math.round(100 + 300 * coverage);
    const disposable = Math.max(0, income - expenses - baselineLiving);

    const maxRate = 45 + Math.round((1 - coverage) * 25);
    const cap = Math.min(disposable, income * (maxRate / 100));

    const floorRate = coverage < 0.5 ? 6 : 3;
    const floor = Math.round(Math.min(income * (floorRate / 100), 250));

    const suggested = clampNumber(required, 0, cap);
    const final = suggested < floor ? clampNumber(floor, 0, cap) : suggested;

    return Math.round(final);
}

function savingsRateFromMonthly(incomeNetMonthly: number, monthlySavings: number): number {
    const income = clampNumber(incomeNetMonthly, 0, 200000);
    if (income <= 0) return 0;
    return clampNumber(Math.round((monthlySavings / income) * 100), 0, 35);
}

function TrafficLightDot({status}: { status: "red" | "yellow" | "green" }) {
    const cls =
        status === "green"
            ? "text-emerald-500"
            : status === "yellow"
                ? "text-amber-500"
                : "text-red-500";

    return <Circle className={`h-4 w-4 fill-current ${cls}`} aria-hidden="true"/>;
}

function SectionTitle({title, subtitle}: { title: string; subtitle: string }) {
    return (
        <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
    );
}

function MoneyInput(props: {
    id: string;
    label: string;
    value: number;
    onChange: (n: number) => void;
    hint?: string;
}) {
    const {id, label, value, onChange, hint} = props;
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center gap-2">
                <Input
                    id={id}
                    inputMode="decimal"
                    value={String(value)}
                    onChange={(e) => onChange(parseNumberInput(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">€</span>
            </div>
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

function PercentInput(props: {
    id: string;
    label: string;
    value: number;
    onChange: (n: number) => void;
    hint?: string
}) {
    const {id, label, value, onChange, hint} = props;
    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center gap-2">
                <Input
                    id={id}
                    inputMode="decimal"
                    value={String(value)}
                    onChange={(e) => onChange(parseNumberInput(e.target.value))}
                />
                <span className="text-sm text-muted-foreground">%</span>
            </div>
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

function InputsCard(props: {
    dict: Dictionary;
    inputs: Inputs;
    setInputs: (next: Inputs) => void;
    onCalculate: () => void;
    recommendedPerMonth: number;
    recommendedRatePercent: number;
}) {
    const {dict, inputs, setInputs, onCalculate, recommendedPerMonth, recommendedRatePercent} = props;
    const t = dict.calculators.emergencyFund;

    const expensesTotal =
        clampNumber(inputs.expenses.rent, 0, 200000) +
        clampNumber(inputs.expenses.utilities, 0, 200000) +
        clampNumber(inputs.expenses.telecom, 0, 200000) +
        clampNumber(inputs.expenses.food, 0, 200000) +
        clampNumber(inputs.expenses.necessities, 0, 200000);

    const showContract = inputs.employmentType === "employee";

    return (
        <Card className="md:w-1/2">
            <CardContent className="space-y-6 p-6">
                <SectionTitle title={t.title} subtitle={t.subtitle}/>

                <div className="grid gap-4">
                    <MoneyInput
                        id="ef-income"
                        label={t.inputs.incomeNetMonthly}
                        value={inputs.incomeNetMonthly}
                        onChange={(n) =>
                            setInputs({
                                ...inputs,
                                incomeNetMonthly: clampNumber(n, 0, 200000),
                            })
                        }
                        hint={t.inputs.incomeNetMonthlyHint}
                    />

                    <div className="space-y-2">
                        <Label>{t.inputs.employmentType}</Label>
                        <Select
                            value={inputs.employmentType}
                            onValueChange={(v) =>
                                setInputs({
                                    ...inputs,
                                    employmentType: v === "selfEmployed" ? "selfEmployed" : "employee",
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t.inputs.employmentTypePlaceholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="employee">{t.inputs.employmentEmployee}</SelectItem>
                                <SelectItem value="selfEmployed">{t.inputs.employmentSelfEmployed}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {showContract ? (
                        <div className="space-y-2">
                            <Label>{t.inputs.employeeContract}</Label>
                            <Select
                                value={inputs.employeeContract}
                                onValueChange={(v) =>
                                    setInputs({
                                        ...inputs,
                                        employeeContract: v === "fixedTerm" ? "fixedTerm" : "permanent",
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={t.inputs.employeeContractPlaceholder}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="permanent">{t.inputs.employeePermanent}</SelectItem>
                                    <SelectItem value="fixedTerm">{t.inputs.employeeFixedTerm}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ) : null}

                    <div className="rounded-xl border p-4 space-y-4">
                        <p className="text-sm font-medium text-muted-foreground">{t.inputs.expensesTitle}</p>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <MoneyInput
                                id="ef-rent"
                                label={t.inputs.rent}
                                value={inputs.expenses.rent}
                                onChange={(n) =>
                                    setInputs({
                                        ...inputs,
                                        expenses: {...inputs.expenses, rent: clampNumber(n, 0, 200000)}
                                    })
                                }
                            />
                            <MoneyInput
                                id="ef-utilities"
                                label={t.inputs.utilities}
                                value={inputs.expenses.utilities}
                                onChange={(n) =>
                                    setInputs({
                                        ...inputs,
                                        expenses: {...inputs.expenses, utilities: clampNumber(n, 0, 200000)}
                                    })
                                }
                            />
                            <MoneyInput
                                id="ef-telecom"
                                label={t.inputs.telecom}
                                value={inputs.expenses.telecom}
                                onChange={(n) =>
                                    setInputs({
                                        ...inputs,
                                        expenses: {...inputs.expenses, telecom: clampNumber(n, 0, 200000)}
                                    })
                                }
                            />
                            <MoneyInput
                                id="ef-food"
                                label={t.inputs.food}
                                value={inputs.expenses.food}
                                onChange={(n) =>
                                    setInputs({
                                        ...inputs,
                                        expenses: {...inputs.expenses, food: clampNumber(n, 0, 200000)}
                                    })
                                }
                            />
                            <MoneyInput
                                id="ef-necessities"
                                label={t.inputs.necessities}
                                value={inputs.expenses.necessities}
                                onChange={(n) =>
                                    setInputs({
                                        ...inputs,
                                        expenses: {...inputs.expenses, necessities: clampNumber(n, 0, 200000)}
                                    })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                            <span className="text-sm text-muted-foreground">{t.inputs.expensesTotal}</span>
                            <span className="text-sm font-medium">{formatCurrencyEUR(expensesTotal)}</span>
                        </div>
                    </div>

                    <MoneyInput
                        id="ef-liquidity"
                        label={t.inputs.currentLiquidity}
                        value={inputs.currentLiquidity}
                        onChange={(n) =>
                            setInputs({
                                ...inputs,
                                currentLiquidity: clampNumber(n, 0, 1_000_000_000),
                            })
                        }
                        hint={t.inputs.currentLiquidityHint}
                    />

                    <div className="rounded-xl border p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-muted-foreground">{t.inputs.savingsRateTitle}</p>
                                <p className="text-xs text-muted-foreground">
                                    {t.inputs.savingsRateRecommendedPrefix} {formatCurrencyEUR(recommendedPerMonth)} ({String(recommendedRatePercent)}%) {t.inputs.savingsRateRecommendedSuffix}
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    setInputs({
                                        ...inputs,
                                        savingsRatePercent: recommendedRatePercent,
                                    })
                                }
                            >
                                {t.actions.useRecommended}
                            </Button>
                        </div>

                        <PercentInput
                            id="ef-savings-rate"
                            label={t.inputs.savingsRatePercent}
                            value={inputs.savingsRatePercent}
                            onChange={(n) =>
                                setInputs({
                                    ...inputs,
                                    savingsRatePercent: clampNumber(n, 0, 35),
                                })
                            }
                            hint={t.inputs.savingsRateHint}
                        />
                    </div>
                </div>

                <Button className="w-full" onClick={onCalculate}>
                    {t.actions.calculate}
                </Button>

                <p className="text-xs text-muted-foreground">{t.note}</p>
            </CardContent>
        </Card>
    );
}

function ResultsCard(props: {
    dict: Dictionary;
    inputs: Inputs;
    result: Result;
}) {
    const {dict, inputs, result} = props;
    const t = dict.calculators.emergencyFund;

    const monthlySavings = result.monthlySavingsFromRate;

    const icon =
        inputs.employmentType === "employee" ? (
            <Shield className="h-5 w-5" aria-hidden="true"/>
        ) : (
            <Briefcase className="h-5 w-5" aria-hidden="true"/>
        );

    const monthsLabel =
        result.monthsRange.min === result.monthsRange.max
            ? `${String(result.monthsRange.min)} ${t.results.monthsUnit}`
            : `${String(result.monthsRange.min)}–${String(result.monthsRange.max)} ${t.results.monthsUnit}`;

    const timeToMin =
        result.monthsToMin === null ? t.results.timeUnknown : `${String(result.monthsToMin)} ${t.results.timeUnit}`;
    const timeToMax =
        result.monthsToMax === null ? t.results.timeUnknown : `${String(result.monthsToMax)} ${t.results.timeUnit}`;

    // Chart: three bars (Current, Min, Max)
    const x = [t.chart.current, t.chart.min, t.chart.max];
    const series = [inputs.currentLiquidity, result.targetMin, result.targetMax];

    function formatK(n: number): string {
        const rounded = Math.round(n / 1000);
        return `${String(rounded)}k`;
    }

    return (
        <Card className="md:w-1/2">
            <CardContent className="space-y-6 p-6">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted"
                         aria-hidden="true">
                        <Wallet className="h-5 w-5"/>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-lg font-semibold">{t.results.title}</h3>
                        <p className="text-sm text-muted-foreground">{t.results.subtitle}</p>
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm text-muted-foreground">{t.results.statusLabel}</p>
                            <div className="mt-1 flex items-center gap-2">
                                <TrafficLightDot status={result.liquidityStatus}/>
                                <p className="text-base font-semibold">{result.liquidityLabel}</p>
                            </div>
                        </div>

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted"
                             aria-hidden="true">
                            {icon}
                        </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{t.results.recommendedRange}</p>
                            <p className="text-lg font-semibold">{monthsLabel}</p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">{t.results.monthlySavings}</p>
                            <p className="text-lg font-semibold">{formatCurrencyEUR(monthlySavings)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t.results.monthlySavingsFromRatePrefix} {String(inputs.savingsRatePercent)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">{t.results.targetMin}</p>
                            <p className="text-2xl font-semibold">{formatCurrencyEUR(result.targetMin)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t.results.timeToReach}: {timeToMin}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">{t.results.targetMax}</p>
                            <p className="text-2xl font-semibold">{formatCurrencyEUR(result.targetMax)}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                {t.results.timeToReach}: {timeToMax}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border p-3">
                    <p className="mb-2 text-sm font-medium text-muted-foreground">{t.chart.title}</p>
                    <div className="h-56 w-full">
                        <BarChart
                            xAxis={[{data: x, scaleType: "band"}]}
                            series={[{data: series, label: t.chart.amountLabel}]}
                            height={224}
                            margin={{left: 64, right: 16, top: 8, bottom: 32}}
                            yAxis={[{valueFormatter: (v: number) => formatK(v)}]}
                        />
                    </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{t.hints.line1}</p>
                    <p>{t.hints.line2}</p>
                </div>

                <Button className="w-full sm:w-auto">{dict.home.cta.primary}</Button>
            </CardContent>
        </Card>
    );
}

export function EmergencyFundCalculator({dict}: { dict: Dictionary }) {
    const t = dict.calculators.emergencyFund;

    const [inputs, setInputs] = useState<Inputs>({
        incomeNetMonthly: 3200,
        employmentType: "employee",
        employeeContract: "permanent",

        expenses: {
            rent: 1100,
            utilities: 250,
            telecom: 60,
            food: 350,
            necessities: 250,
        },

        currentLiquidity: 2000,
        savingsRatePercent: 10,
    });

    const [submitted, setSubmitted] = useState(false);

    const result = useMemo<Result>(() => {
        const income = clampNumber(inputs.incomeNetMonthly, 0, 200000);

        const expensesTotal =
            clampNumber(inputs.expenses.rent, 0, 200000) +
            clampNumber(inputs.expenses.utilities, 0, 200000) +
            clampNumber(inputs.expenses.telecom, 0, 200000) +
            clampNumber(inputs.expenses.food, 0, 200000) +
            clampNumber(inputs.expenses.necessities, 0, 200000);

        const monthsRange = computeMonthsRange(inputs.employmentType, inputs.employeeContract, income);

        const targetMin = Math.round(expensesTotal * monthsRange.min);
        const targetMax = Math.round(expensesTotal * monthsRange.max);

        const recommendedSavingsPerMonth = computeRecommendedSavingsPerMonth({
            incomeNetMonthly: income,
            expensesTotal,
            currentLiquidity: inputs.currentLiquidity,
            targetMin,
            employmentType: inputs.employmentType,
            employeeContract: inputs.employeeContract,
        });

        const recommendedSavingsRatePercent = savingsRateFromMonthly(income, recommendedSavingsPerMonth);

        const savingsRate = clampNumber(inputs.savingsRatePercent, 0, 35);
        const monthlySavingsFromRate = Math.round((income * savingsRate) / 100);

        const monthsToMin = monthsToTarget(Math.max(0, targetMin - inputs.currentLiquidity), monthlySavingsFromRate);
        const monthsToMax = monthsToTarget(Math.max(0, targetMax - inputs.currentLiquidity), monthlySavingsFromRate);

        let liquidityStatus: Result["liquidityStatus"] = "red";
        let liquidityLabel = t.status.red;

        if (inputs.currentLiquidity >= targetMax) {
            liquidityStatus = "green";
            liquidityLabel = t.status.green;
        } else if (inputs.currentLiquidity >= targetMin) {
            liquidityStatus = "yellow";
            liquidityLabel = t.status.yellow;
        }

        return {
            expensesTotal,
            monthsRange,
            targetMin,
            targetMax,
            liquidityStatus,
            liquidityLabel,
            recommendedSavingsPerMonth,
            recommendedSavingsRatePercent,
            monthlySavingsFromRate,
            monthsToMin,
            monthsToMax,
        };
    }, [inputs, t.status.green, t.status.red, t.status.yellow]);

    const onCalculate = React.useCallback(() => {
        setSubmitted(true);
    }, []);

    return (
        <div className="flex flex-col gap-6 md:flex-row">
            <InputsCard
                dict={dict}
                inputs={inputs}
                setInputs={setInputs}
                onCalculate={onCalculate}
                recommendedPerMonth={result.recommendedSavingsPerMonth}
                recommendedRatePercent={result.recommendedSavingsRatePercent}
            />

            {submitted ? <ResultsCard dict={dict} inputs={inputs} result={result}/> : null}
        </div>
    );
}