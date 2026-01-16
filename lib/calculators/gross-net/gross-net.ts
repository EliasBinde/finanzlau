import {SV_BY_YEAR, type SvYearConfig} from "./sv-data";
import {HEALTH_INSURANCE_BY_YEAR} from "./health-insurance";
import {computePAP, Decimal} from "./Lohnsteuer2026";

export type Timeframe = "year" | "month" | "week" | "day";

export type HealthType = "gkv-general" | "gkv-reduced" | "pkv";

export type Bundesland =
    | "BW" | "BY" | "BE" | "BB" | "HB" | "HH" | "HE" | "MV" | "NI" | "NW" | "RP" | "SL" | "SN" | "ST" | "SH" | "TH";

export type InputsGrossNet = {
    gross: number;
    timeframe: Timeframe;

    year: number;

    steuerklasse: 1 | 2 | 3 | 4 | 5 | 6;
    freibetrag: number;

    churchTax: boolean;
    bundesland: Bundesland;

    birthYear: number;
    kids: number;

    healthType: HealthType;

    childAllowance: number;

    gkvInsuranceId?: string;

    pkvPremiumMonthly?: number;
    pkvEmployerSubsidy?: boolean;

    rvPflicht: boolean;

    umlagen?: {
        enabled: boolean;
        u1Pct: number;
        u2Pct: number;
    };
};

export type DeductionLine = {
    key: string;
    label: string;
    periodCents: number;
    annualCents: number;
};

export type GrossNetResult = {
    meta: {
        year: number;
        timeframe: Timeframe;
        grossPeriodCents: number;
        grossAnnualCents: number;
    };

    employee: {
        deductions: DeductionLine[];
        totalDeductionsPeriodCents: number;
        totalDeductionsAnnualCents: number;

        netPeriodCents: number;
        netAnnualCents: number;
    };

    employer?: {
        deductions: DeductionLine[];
        totalEmployerCostPeriodCents: number;
        totalEmployerCostAnnualCents: number;
    };
};

function clampNumber(v: number, min: number, max: number): number {
    if (!Number.isFinite(v)) return min;
    return Math.min(max, Math.max(min, v));
}

function eurToCents(n: number): number {
    return Math.round(clampNumber(n, 0, 1_000_000_000) * 100);
}

function centsToEur(c: number): number {
    return c / 100;
}

function timeframeToLZZ(tf: Timeframe): 1 | 2 | 3 | 4 {
    if (tf === "year") return 1;
    if (tf === "month") return 2;
    if (tf === "week") return 3;
    return 4;
}

function annualMultiplier(tf: Timeframe): number {
    if (tf === "year") return 1;
    if (tf === "month") return 12;
    if (tf === "week") return 360 / 7;
    return 360;
}

function churchTaxRate(bl: Bundesland): number {
    return bl === "BY" || bl === "BW" ? 0.08 : 0.09;
}

function getSvYear(year: number): SvYearConfig {
    const y = SV_BY_YEAR[year];
    if (!y) throw new Error(`Missing SV data for year ${year}`);
    return y;
}

function getGkvAddOnTotal(year: number, insuranceId: string | undefined): number {
    const y = HEALTH_INSURANCE_BY_YEAR[year];
    if (!y) throw new Error(`Missing GKV data for year ${year}`);

    const id = (insuranceId ?? "").trim();
    if (id) {
        const k = y.insurances.find((i) => i.id === id);
        if (!k) throw new Error(`Unknown GKV id '${id}' for year ${year}`);
        return k.addOnRateTotal;
    }

    const avg = y.insurances.find((i) => i.id === "avg");
    if (avg) return avg.addOnRateTotal;

    const first = y.insurances[0];
    if (first) return first.addOnRateTotal;

    return 0;
}

function computeCareChildDiscount(kids: number): number {
    const k = clampNumber(Math.floor(kids), 0, 20);
    if (k <= 1) return 0;
    return Math.min(4, k - 1);
}

function computeEmployeeContribMonthly(args: {
    sv: SvYearConfig;
    year: number;
    birthYear: number;
    kids: number;
    bundesland: Bundesland;

    grossMonthlyEur: number;

    healthType: HealthType;

    gkvAddOnTotal?: number;
    pkvPremiumMonthly?: number;
    pkvEmployerSubsidy?: boolean;

    rvPflicht: boolean;
}): {
    rvEur: number;
    avEur: number;
    kvEur: number;
    pvEur: number;

    pkvEmployerSubsidyEur: number;

    base: {
        grossKvPv: number;
        grossRvAv: number;
    };
} {
    const grossMonthly = clampNumber(args.grossMonthlyEur, 0, 1_000_000_000);

    const bbgKvPv = args.sv.bbgMonthly.kvPv;
    const bbgRvAv = args.sv.bbgMonthly.rvAv;

    const grossKvPv = Math.min(grossMonthly, bbgKvPv);
    const grossRvAv = Math.min(grossMonthly, bbgRvAv);

    const rvRate = args.rvPflicht ? args.sv.rates.rvEmployee : 0;
    const avRate = args.sv.rates.avEmployee;

    const isSaxony = args.bundesland === "SN";
    const age = args.year - args.birthYear;
    const childless = clampNumber(args.kids, 0, 20) === 0;
    const childlessSurchargeApplies = childless && age >= 24;

    const careDiscountChildren = computeCareChildDiscount(args.kids);
    const pvDiscount = args.sv.rates.pvChildDiscountPerExtraChild * careDiscountChildren;

    const pvEmployeeBase = isSaxony
        ? args.sv.rates.pvTotalBase - args.sv.pvSplit.saxonyEmployer
        : args.sv.rates.pvTotalBase / 2;

    const pvEmployeeRate =
        pvEmployeeBase +
        (childlessSurchargeApplies ? args.sv.rates.pvChildlessSurcharge : 0) -
        pvDiscount;

    const pvEur = grossKvPv * clampNumber(pvEmployeeRate, 0, 0.2);

    if (args.healthType === "pkv") {
        const premium = clampNumber(args.pkvPremiumMonthly ?? 0, 0, 50_000);
        const subsidyOn = Boolean(args.pkvEmployerSubsidy);

        const subsidyCap = 384.58;
        const subsidy = subsidyOn ? Math.min(premium * 0.5, subsidyCap) : 0;
        const employeeShare = Math.max(0, premium - subsidy);

        return {
            rvEur: grossRvAv * rvRate,
            avEur: grossRvAv * avRate,
            kvEur: employeeShare,
            pvEur,
            pkvEmployerSubsidyEur: subsidy,
            base: {grossKvPv, grossRvAv},
        };
    }

    const baseRate = args.healthType === "gkv-reduced" ? 0.07 : 0.073;
    const addOnTotal = clampNumber(args.gkvAddOnTotal ?? 0, 0, 0.2);
    const kvEmployeeRate = baseRate + addOnTotal / 2;

    return {
        rvEur: grossRvAv * rvRate,
        avEur: grossRvAv * avRate,
        kvEur: grossKvPv * kvEmployeeRate,
        pvEur,
        pkvEmployerSubsidyEur: 0,
        base: {grossKvPv, grossRvAv},
    };
}

export function computeGrossNet(input: InputsGrossNet): GrossNetResult {

    console.log("ComputeGrossNet called with: ")
    console.log(input)


    const year = Math.floor(input.year);
    const sv = getSvYear(year);

    const grossPeriodCents = eurToCents(input.gross);
    const mult = annualMultiplier(input.timeframe);
    const grossAnnualCents = Math.round(grossPeriodCents * mult);

    const grossAnnualEur = centsToEur(grossAnnualCents);
    const grossMonthlyEur = grossAnnualEur / 12;

    const kids = clampNumber(Math.floor(input.kids), 0, 20);

    const isSaxony = input.bundesland === "SN";
    const age = year - Math.floor(input.birthYear);
    const childlessSurchargeApplies = kids === 0 && age >= 24;

    const careDiscountChildren = computeCareChildDiscount(kids);

    const gkvAddOnTotal =
        input.healthType === "gkv-general" || input.healthType === "gkv-reduced"
            ? getGkvAddOnTotal(year, input.gkvInsuranceId)
            : undefined;

    const contrib = computeEmployeeContribMonthly({
        sv,
        year,
        birthYear: input.birthYear,
        kids,
        bundesland: input.bundesland,
        grossMonthlyEur,
        healthType: input.healthType,
        gkvAddOnTotal,
        pkvPremiumMonthly: input.pkvPremiumMonthly,
        pkvEmployerSubsidy: input.pkvEmployerSubsidy,
        rvPflicht: input.rvPflicht,
    });

    const kvzPctForPap =
        input.healthType === "pkv"
            ? Decimal(0)
            : Decimal(clampNumber((gkvAddOnTotal ?? 0) * 100, 0, 30));

    const pkvPremiumMonthly = clampNumber(input.pkvPremiumMonthly ?? 0, 0, 50_000);
    const pkvSubsidyCap = 384.58;
    const pkvSubsidyEur = input.healthType === "pkv" && input.pkvEmployerSubsidy
        ? Math.min(pkvPremiumMonthly * 0.5, pkvSubsidyCap)
        : 0;
    const pkvEmployeeShareEur = input.healthType === "pkv"
        ? Math.max(0, pkvPremiumMonthly - pkvSubsidyEur)
        : 0;

    const ageReliefEligible = age >= 65 ? 1 : 0;

    const zkf =
        input.steuerklasse <= 4
            ? clampNumber(input.childAllowance ?? 0, 0, 10)
            : 0;

    const papInputs = {
        payPeriod: timeframeToLZZ(input.timeframe),
        taxClass: input.steuerklasse,
        allowanceCents: Decimal(eurToCents(input.freibetrag)),
        religionCode: input.churchTax ? 1 : 0,
        isSaxonyCareRules: isSaxony ? 1 : 0,
        isChildlessCareSurcharge: childlessSurchargeApplies ? 1 : 0,
        careDiscountChildren: Decimal(careDiscountChildren),

        noPublicPensionInsurance: input.rvPflicht ? 0 : 1,
        noUnemploymentInsurance: 0,

        isPrivateHealthInsured: input.healthType === "pkv" ? 1 : 0,
        healthAddOnRatePct: kvzPctForPap,
        privateHealthEmployeeMonthlyCents: Decimal(eurToCents(pkvEmployeeShareEur)),
        privateHealthEmployerMonthlyCents: Decimal(eurToCents(pkvSubsidyEur)),

        isAgeReliefEligible: ageReliefEligible,
        ageReliefYear: ageReliefEligible ? year : 0,

        childAllowance: Decimal(zkf),

        grossWageCents: Decimal(grossPeriodCents),
    };

    console.log("SV year:", year, sv);
    console.log("GKV add-on total:", gkvAddOnTotal);
    console.log("Contrib monthly:", contrib);
    console.log("PAP inputs:", papInputs);

    const pap = computePAP(papInputs);

    console.log("PAP raw output:", pap);
    console.log("PAP STANDARD keys:", Object.keys((pap as Record<string, unknown>).STANDARD ?? {}));

    const wageTaxCents = Number(pap.STANDARD.wageTaxCents);
    const soliCents = Number(pap.STANDARD.solidaritySurchargeCents);

    const churchRate = input.churchTax ? churchTaxRate(input.bundesland) : 0;
    const churchTaxCents = input.churchTax
        ? Math.round(Number(pap.STANDARD.churchTaxBaseCents) * churchRate)
        : 0;

    const rvAnnualCents = eurToCents(contrib.rvEur * 12);
    const avAnnualCents = eurToCents(contrib.avEur * 12);
    const kvAnnualCents = eurToCents(contrib.kvEur * 12);
    const pvAnnualCents = eurToCents(contrib.pvEur * 12);

    const rvPeriodCents = Math.round(rvAnnualCents / mult);
    const avPeriodCents = Math.round(avAnnualCents / mult);
    const kvPeriodCents = Math.round(kvAnnualCents / mult);
    const pvPeriodCents = Math.round(pvAnnualCents / mult);

    const taxAnnualCents = Math.round(wageTaxCents * mult);
    const soliAnnualCents = Math.round(soliCents * mult);
    const churchAnnualCents = Math.round(churchTaxCents * mult);

    const deductionsEmployee: DeductionLine[] = [
        {key: "wageTax", label: "Lohnsteuer", periodCents: wageTaxCents, annualCents: taxAnnualCents},
        {key: "soli", label: "Solidaritätszuschlag", periodCents: soliCents, annualCents: soliAnnualCents},
        {key: "churchTax", label: "Kirchensteuer", periodCents: churchTaxCents, annualCents: churchAnnualCents},

        {key: "rv", label: "Rentenversicherung", periodCents: rvPeriodCents, annualCents: rvAnnualCents},
        {key: "av", label: "Arbeitslosenversicherung", periodCents: avPeriodCents, annualCents: avAnnualCents},
        {key: "pv", label: "Pflegeversicherung", periodCents: pvPeriodCents, annualCents: pvAnnualCents},
        {key: "kv", label: "Krankenversicherung", periodCents: kvPeriodCents, annualCents: kvAnnualCents},
    ];

    console.log("PAP derived:", {
        wageTaxCents,
        soliCents,
        churchTaxBaseCents: Number(pap.STANDARD.churchTaxBaseCents),
        grossPeriodCents,
        timeframe: input.timeframe,
    });

    const churchTaxBaseCents = Number(pap.STANDARD.churchTaxBaseCents);

    if (grossAnnualCents >= 20_000_00 && wageTaxCents === 0 && soliCents === 0 && churchTaxBaseCents === 0) {
        throw new Error("PAP returned 0 tax on substantial gross. Likely wrong input/output keys for generated module.");
    }

    const totalDeductionsPeriodCents = deductionsEmployee.reduce((a, x) => a + x.periodCents, 0);
    const totalDeductionsAnnualCents = deductionsEmployee.reduce((a, x) => a + x.annualCents, 0);

    const netPeriodCents = Math.max(0, grossPeriodCents - totalDeductionsPeriodCents);
    const netAnnualCents = Math.max(0, grossAnnualCents - totalDeductionsAnnualCents);

    const employerDeductions: DeductionLine[] = [];

    if (input.umlagen?.enabled) {
        const u1Pct = clampNumber(input.umlagen.u1Pct, 0, 10);
        const u2Pct = clampNumber(input.umlagen.u2Pct, 0, 10);

        const baseAnnual = grossAnnualCents;
        const u1Annual = Math.round(baseAnnual * (u1Pct / 100));
        const u2Annual = Math.round(baseAnnual * (u2Pct / 100));

        employerDeductions.push(
            {key: "u1", label: "U1", periodCents: Math.round(u1Annual / mult), annualCents: u1Annual},
            {key: "u2", label: "U2", periodCents: Math.round(u2Annual / mult), annualCents: u2Annual},
        );
    }

    const totalEmployerCostAnnualCents =
        grossAnnualCents + employerDeductions.reduce((a, x) => a + x.annualCents, 0);

    const totalEmployerCostPeriodCents =
        grossPeriodCents + employerDeductions.reduce((a, x) => a + x.periodCents, 0);

    return {
        meta: {
            year,
            timeframe: input.timeframe,
            grossPeriodCents,
            grossAnnualCents,
        },
        employee: {
            deductions: deductionsEmployee,
            totalDeductionsPeriodCents,
            totalDeductionsAnnualCents,
            netPeriodCents,
            netAnnualCents,
        },
        employer: employerDeductions.length
            ? {
                deductions: employerDeductions,
                totalEmployerCostPeriodCents,
                totalEmployerCostAnnualCents,
            }
            : undefined,
    };
}