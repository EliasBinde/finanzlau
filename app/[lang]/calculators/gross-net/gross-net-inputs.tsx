"use client";

import * as React from "react";
import type {Dictionary, Locale} from "@/app/[lang]/dictionaries";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getPecentageByProviderId} from "@/lib/calculators/gross-net/health-insurance";

export type InputsState = {
    year: number;
    timeframe: "monthly" | "yearly" | "weekly" | "daily";
    grossAmount: number;

    taxClass: 1 | 2 | 3 | 4 | 5 | 6;
    allowanceAnnual: number;

    churchTaxEnabled: boolean;
    bundesland:
        | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV" | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

    birthYear: number;
    kids: number;

    healthInsuranceType: "gkv-general" | "gkv-reduced" | "pkv";
    gkvProviderId: string;
    healthAddOnRatePct: number;
    pkvEmployeeMonthly: number;
    pkvEmployerSubsidy: boolean;

    pensionInsurance: boolean;

    umlageEnabled: boolean;
    umlageU1Pct: number;
    umlageU2Pct: number;
};

function clampNumber(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
}

function parseNumberInput(raw: string): number {
    const s0 = raw.trim();
    if (!s0) return 0;

    const s = s0.replace(/\s+/g, "");

    const hasDot = s.includes(".");
    const hasComma = s.includes(",");

    if (hasDot && hasComma) {
        const normalized = s.replace(/\./g, "").replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    if (hasComma) {
        const normalized = s.replace(",", ".");
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    if (hasDot) {
        const looksLikeThousands = /^\d{1,3}(\.\d{3})+$/.test(s);
        const normalized = looksLikeThousands ? s.replace(/\./g, "") : s;
        const n = Number(normalized);
        return Number.isFinite(n) ? n : 0;
    }

    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
}

function Field(props: { children: React.ReactNode }) {
    return <div className="space-y-2 w-full min-w-0">{props.children}</div>;
}

function MoneyInput(props: {
    id: string;
    label: string;
    value: number;
    onCommit: (n: number) => void;
    suffix?: string;
    hint?: string;
    min?: number;
    max?: number;
}) {
    const {id, label, value, onCommit, suffix, hint, min, max} = props;

    const [draft, setDraft] = React.useState<string>(String(value));

    React.useEffect(() => {
        setDraft(String(value));
    }, [value]);

    return (
        <Field>
            <Label htmlFor={id}>{label}</Label>
            <div className="flex items-center gap-2 w-full min-w-0">
                <Input
                    id={id}
                    inputMode="decimal"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur();
                    }}
                    onBlur={() => {
                        const raw = draft.trim();
                        if (!raw) {
                            setDraft(String(value));
                            return;
                        }

                        const parsed = parseNumberInput(raw);
                        if (!Number.isFinite(parsed)) {
                            setDraft(String(value));
                            return;
                        }

                        const next =
                            typeof min === "number" && typeof max === "number"
                                ? clampNumber(parsed, min, max)
                                : parsed;

                        onCommit(next);
                    }}
                    className="w-full min-w-0"
                />
                <span className="text-sm text-muted-foreground shrink-0">{suffix ?? "€"}</span>
            </div>
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </Field>
    );
}

function NumberInput(props: {
    id: string;
    label: string;
    value: number;
    onCommit: (n: number) => void;
    hint?: string;
    min?: number;
    max?: number;
    step?: number;
}) {
    const {id, label, value, onCommit, hint, min, max, step} = props;

    const [draft, setDraft] = React.useState<string>(String(value));

    React.useEffect(() => {
        setDraft(String(value));
    }, [value]);

    return (
        <div className="space-y-2 min-w-0">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                step={step ?? 1}
                value={draft}
                onChange={(e) => {
                    setDraft(e.target.value);
                }}
                onBlur={() => {
                    const raw = draft.trim();
                    if (!raw) {
                        setDraft(String(value));
                        return;
                    }

                    const n = Number(raw);
                    if (!Number.isFinite(n)) {
                        setDraft(String(value));
                        return;
                    }

                    onCommit(n);
                }}
                className="min-w-0"
            />
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
    );
}

function SwitchCard(props: {
    title: string;
    hint?: string;
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
}) {
    const {title, hint, checked, onCheckedChange} = props;
    return (
        <div className="w-full min-w-0 rounded-xl border px-4 py-3 flex items-center justify-between gap-4">
            <div className="min-w-0">
                <p className="text-sm font-medium">{title}</p>
                {hint ? <p className="text-xs text-muted-foreground leading-snug">{hint}</p> : null}
            </div>
            <Switch checked={checked} onCheckedChange={(v) => onCheckedChange(!!v)}/>
        </div>
    );
}

export function GrossNetInputs({
                                   dict,
                                   value,
                                   onChange,
                                   onCalculate,
                                   onReset,
                                   supportedYears,
                                   gkvProviders,
                               }: {
    dict: Dictionary;
    lang: Locale;
    value: InputsState;
    onChange: (next: InputsState) => void;
    onCalculate: () => void;
    onReset: () => void;
    supportedYears: number[];
    gkvProviders: { id: string; name: string }[];
}) {
    const t = dict.calculators.grossNet;

    const showGkv = value.healthInsuranceType !== "pkv";
    const showPkv = value.healthInsuranceType === "pkv";

    return (
        <div className="space-y-6 w-full min-w-0">
            <div className="grid gap-4 w-full min-w-0">
                <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                    <Field>
                        <Label>{t.inputs.year}</Label>
                        <Select value={String(value.year)} onValueChange={(v) => onChange({...value, year: Number(v)})}>
                            <SelectTrigger className="w-full min-w-0">
                                <SelectValue placeholder={t.inputs.year}/>
                            </SelectTrigger>
                            <SelectContent>
                                {supportedYears.map((y) => (
                                    <SelectItem key={y} value={String(y)}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <Label>{t.inputs.timeframe}</Label>
                        <Select
                            value={value.timeframe}
                            onValueChange={(v) =>
                                onChange({...value, timeframe: (v as InputsState["timeframe"]) ?? "monthly"})
                            }
                        >
                            <SelectTrigger className="w-full min-w-0">
                                <SelectValue placeholder={t.inputs.timeframePlaceholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="monthly">{t.inputs.timeframeMonthly}</SelectItem>
                                <SelectItem value="yearly">{t.inputs.timeframeYearly}</SelectItem>
                                <SelectItem value="weekly">{t.inputs.timeframeWeekly}</SelectItem>
                                <SelectItem value="daily">{t.inputs.timeframeDaily}</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                <MoneyInput
                    id="gn-gross"
                    label={t.inputs.gross}
                    value={value.grossAmount}
                    onCommit={(n) => onChange({...value, grossAmount: clampNumber(n, 0, 1_000_000_000)})}
                    suffix="€"
                />

                <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                    <Field>
                        <Label>{t.inputs.taxClass}</Label>
                        <Select
                            value={String(value.taxClass)}
                            onValueChange={(v) =>
                                onChange({
                                    ...value,
                                    taxClass: clampNumber(Number(v), 1, 6) as InputsState["taxClass"],
                                })
                            }
                        >
                            <SelectTrigger className="w-full min-w-0">
                                <SelectValue placeholder={t.inputs.taxClassPlaceholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">I</SelectItem>
                                <SelectItem value="2">II</SelectItem>
                                <SelectItem value="3">III</SelectItem>
                                <SelectItem value="4">IV</SelectItem>
                                <SelectItem value="5">V</SelectItem>
                                <SelectItem value="6">VI</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <MoneyInput
                        id="gn-allowance"
                        label={t.inputs.allowanceAnnual}
                        value={value.allowanceAnnual}
                        onCommit={(n) => onChange({...value, allowanceAnnual: clampNumber(n, 0, 1_000_000)})}
                        suffix="€"
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                    <Field>
                        <Label>{t.inputs.bundesland}</Label>
                        <Select
                            value={value.bundesland}
                            onValueChange={(v) => onChange({...value, bundesland: v as InputsState["bundesland"]})}
                        >
                            <SelectTrigger className="w-full min-w-0">
                                <SelectValue placeholder={t.inputs.bundeslandPlaceholder}/>
                            </SelectTrigger>
                            <SelectContent>
                                {(
                                    ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"] as const
                                ).map((bl) => (
                                    <SelectItem key={bl} value={bl}>
                                        {bl}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    <NumberInput
                        id="gn-birthyear"
                        label={t.inputs.birthYear}
                        value={value.birthYear}
                        min={1900}
                        max={2030}
                        step={1}
                        onCommit={(n) =>
                            onChange({
                                ...value,
                                birthYear: clampNumber(Math.round(n), 1900, 2030),
                            })
                        }
                    />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                    <NumberInput
                        id="gn-kids"
                        label={t.inputs.children}
                        value={value.kids}
                        onCommit={(n) => onChange({...value, kids: clampNumber(Math.round(n), 0, 10)})}
                        hint={t.inputs.childrenHint}
                    />
                    <div className="hidden sm:block"/>
                </div>

                <SwitchCard
                    title={t.inputs.churchTax}
                    hint={t.inputs.churchTaxHint}
                    checked={value.churchTaxEnabled}
                    onCheckedChange={(v) => onChange({...value, churchTaxEnabled: v})}
                />

                <div className="rounded-xl border p-4 space-y-4 w-full min-w-0">
                    <p className="text-sm font-medium text-muted-foreground">{t.inputs.healthTitle}</p>

                    <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                        <Field>
                            <Label>{t.inputs.healthType}</Label>
                            <Select
                                value={value.healthInsuranceType}
                                onValueChange={(v) =>
                                    onChange({
                                        ...value,
                                        healthInsuranceType: (v as InputsState["healthInsuranceType"]) ?? "gkv-general",
                                    })
                                }
                            >
                                <SelectTrigger className="w-full min-w-0">
                                    <SelectValue placeholder={t.inputs.healthTypePlaceholder}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gkv-general">{t.inputs.healthGkvGeneral}</SelectItem>
                                    <SelectItem value="gkv-reduced">{t.inputs.healthGkvReduced}</SelectItem>
                                    <SelectItem value="pkv">{t.inputs.healthPkv}</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>

                        {showPkv ? (
                            <div className="w-full min-w-0 flex items-end">
                                <SwitchCard
                                    title={t.inputs.employerSubsidy}
                                    hint={t.inputs.employerSubsidyHint}
                                    checked={value.pkvEmployerSubsidy}
                                    onCheckedChange={(v) => onChange({...value, pkvEmployerSubsidy: v})}
                                />
                            </div>
                        ) : (
                            <div className="hidden sm:block"/>
                        )}
                    </div>

                    {showGkv ? (
                        <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                            <Field>
                                <Label>{t.inputs.gkvProvider}</Label>
                                <Select
                                    value={value.gkvProviderId}
                                    onValueChange={(v) => onChange({
                                        ...value,
                                        gkvProviderId: v,
                                        healthAddOnRatePct: Math.round(getPecentageByProviderId(v) * 1000) / 10
                                    })}
                                >
                                    <SelectTrigger className="w-full min-w-0">
                                        <SelectValue placeholder={t.inputs.gkvProviderPlaceholder}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {gkvProviders.map((p) => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </Field>

                            <MoneyInput
                                id="gn-kvz"
                                label={t.inputs.healthAddOnRate}
                                value={value.healthAddOnRatePct}
                                onCommit={(n) => onChange({...value, healthAddOnRatePct: clampNumber(n, 0, 10)})}
                                suffix="%"
                            />
                        </div>
                    ) : null}

                    {showPkv ? (
                        <MoneyInput
                            id="gn-pkv"
                            label={t.inputs.pkvEmployeeMonthly}
                            value={value.pkvEmployeeMonthly}
                            onCommit={(n) => onChange({...value, pkvEmployeeMonthly: clampNumber(n, 0, 10_000)})}
                            suffix="€"
                        />
                    ) : null}
                </div>

                <SwitchCard
                    title={t.inputs.pensionInsurance}
                    hint={t.inputs.pensionInsuranceHint}
                    checked={value.pensionInsurance}
                    onCheckedChange={(v) => onChange({...value, pensionInsurance: v})}
                />

                <div className="rounded-xl border p-4 space-y-4 w-full min-w-0">
                    <div className="flex items-center justify-between gap-4 min-w-0">
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-muted-foreground">{t.inputs.umlageTitle}</p>
                            <p className="text-xs text-muted-foreground">{t.inputs.umlageHint}</p>
                        </div>
                        <Switch checked={value.umlageEnabled}
                                onCheckedChange={(v) => onChange({...value, umlageEnabled: !!v})}/>
                    </div>

                    {value.umlageEnabled ? (
                        <div className="grid gap-4 sm:grid-cols-2 w-full min-w-0">
                            <MoneyInput
                                id="gn-u1"
                                label={t.inputs.umlageU1}
                                value={value.umlageU1Pct}
                                onCommit={(n) => onChange({...value, umlageU1Pct: clampNumber(n, 0, 20)})}
                                suffix="%"
                            />
                            <MoneyInput
                                id="gn-u2"
                                label={t.inputs.umlageU2}
                                value={value.umlageU2Pct}
                                onCommit={(n) => onChange({...value, umlageU2Pct: clampNumber(n, 0, 20)})}
                                suffix="%"
                            />
                        </div>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="button" onClick={onCalculate} className="w-full sm:w-auto">
                    {t.actions.calculate}
                </Button>
                <Button type="button" variant="outline" onClick={onReset} className="w-full sm:w-auto">
                    {t.actions.reset}
                </Button>
            </div>
        </div>
    );
}