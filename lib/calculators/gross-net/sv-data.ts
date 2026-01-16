export type SvYearConfig = {
    year: number;

    bbgMonthly: {
        kvPv: number;
        rvAv: number;
    };

    rates: {
        rvEmployee: number;
        avEmployee: number;

        kvEmployeeBase: number;

        pvTotalBase: number;
        pvChildlessSurcharge: number;
        pvChildDiscountPerExtraChild: number;
        pvMaxDiscountChildren: number;
    };

    pvSplit: {
        nonSaxonyEmployer: number;
        saxonyEmployer: number;
    };
};

export const SV_BY_YEAR: Record<number, SvYearConfig> = {
    2026: {
        year: 2026,
        bbgMonthly: {
            kvPv: 5812.5,
            rvAv: 8450,
        },
        rates: {
            rvEmployee: 0.093,
            avEmployee: 0.013,
            kvEmployeeBase: 0.073,
            pvTotalBase: 0.036,
            pvChildlessSurcharge: 0.006,
            pvChildDiscountPerExtraChild: 0.0025,
            pvMaxDiscountChildren: 4,
        },
        pvSplit: {
            nonSaxonyEmployer: 0.018,
            saxonyEmployer: 0.013,
        },
    },
};