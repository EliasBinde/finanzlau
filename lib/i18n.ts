import "server-only";
import { getDictionary, hasLocale } from "@/app/[lang]/dictionaries";
import {defaultLocale} from "@/proxy";

function getObjValue(obj: unknown, path: readonly string[]): unknown {
    let cur: unknown = obj;

    for (const key of path) {
        if (typeof cur !== "object" || cur === null) return undefined;
        cur = (cur as Record<string, unknown>)[key];
    }

    return cur;
}

function isStringArray(v: unknown): v is readonly string[] {
    return Array.isArray(v) && v.every((x) => typeof x === "string");
}

export async function getI18n(lang: string) {
    const primaryLang = hasLocale(lang) ? lang : defaultLocale;

    const primary = await getDictionary(primaryLang);
    const fallback = primaryLang === defaultLocale ? null : await getDictionary(defaultLocale);

    function t(path: readonly string[]): string {
        const v1 = getObjValue(primary, path);
        if (typeof v1 === "string") return v1;

        const v2 = fallback ? getObjValue(fallback, path) : undefined;
        if (typeof v2 === "string") return v2;

        throw new Error(`Missing i18n string at: ${path.join(".")} (lang=${primaryLang}, fallback=${defaultLocale})`);
    }

    function ta(path: readonly string[]): readonly string[] {
        const v1 = getObjValue(primary, path);
        if (isStringArray(v1)) return v1;

        const v2 = fallback ? getObjValue(fallback, path) : undefined;
        if (isStringArray(v2)) return v2;

        throw new Error(`Missing i18n string[] at: ${path.join(".")} (lang=${primaryLang}, fallback=${defaultLocale})`);
    }

    return { lang: primaryLang, t, ta };
}