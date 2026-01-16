export type HealthInsurance = {
    id: string;
    name: string;
    addOnRateTotal: number; // e.g. 0.031 = 3.1%
};

export type HealthInsuranceYear = {
    year: number;
    insurances: HealthInsurance[];
};

export const HEALTH_INSURANCE_BY_YEAR: Record<number, HealthInsuranceYear> = {
    2026: {
        year: 2026,
        insurances: [
            {id: "tk", name: "Techniker Krankenkasse (TK)", addOnRateTotal: 0.026},
            {id: "barmer", name: "BARMER", addOnRateTotal: 0.028},
            {id: "aok-bw", name: "AOK Baden-Württemberg", addOnRateTotal: 0.031},
            {id: "aok-by", name: "AOK Bayern", addOnRateTotal: 0.030},
            {id: "dak", name: "DAK-Gesundheit", addOnRateTotal: 0.032},
            {id: "ikk-classic", name: "IKK classic", addOnRateTotal: 0.029},
            {id: "hkk", name: "hkk", addOnRateTotal: 0.019},
            {id: "kkh", name: "KKH Kaufmännische Krankenkasse", addOnRateTotal: 0.028},
            {id: "sbk", name: "SBK Siemens-Betriebskrankenkasse", addOnRateTotal: 0.017},
        ],
    },
};

export const getPecentageByProviderId = (id: HealthInsurance["id"]): number => HEALTH_INSURANCE_BY_YEAR[2026].insurances.find((i) => i.id === id)?.addOnRateTotal ?? 0;