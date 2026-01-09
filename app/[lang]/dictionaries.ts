import "server-only";
import { locales } from "@/proxy";

export const defaultLocale = "de" as const;
export type Locale = (typeof locales)[number];

export const hasLocale = (locale: string): locale is Locale =>
    (locales as readonly string[]).includes(locale);

export type Dictionary = typeof import("./dictionaries/de.json") &
    typeof import("./dictionaries/en.json");

async function loadJson<T>(loader: () => Promise<unknown>): Promise<T> {
    const mod = await loader();
    // @ts-expect-error Json Type Foo
    return (mod.default ?? mod) as T;
}

const loaders = {
    de: () => loadJson<Dictionary>(() => import("./dictionaries/de.json")),
    en: () => loadJson<Dictionary>(() => import("./dictionaries/en.json")),
} satisfies Record<Locale, () => Promise<Dictionary>>;

export async function getDictionary(locale: string): Promise<{ lang: Locale; dict: Dictionary }> {
    const lang: Locale = hasLocale(locale) ? locale : defaultLocale;

    const primary = await loaders[lang]();
    if (lang === defaultLocale) return { lang, dict: primary };

    const fallback = await loaders[defaultLocale]();
    const merged = deepMergePreferPrimary(primary, fallback) as Dictionary;

    return { lang, dict: merged };
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null && !Array.isArray(v);
}

function deepMergePreferPrimary(primary: unknown, fallback: unknown): unknown {
    if (primary === undefined) return fallback;
    if (fallback === undefined) return primary;

    if (Array.isArray(primary)) return primary;
    if (Array.isArray(fallback)) return primary;

    if (isPlainObject(primary) && isPlainObject(fallback)) {
        const out: Record<string, unknown> = { ...fallback };
        for (const [k, v] of Object.entries(primary)) {
            out[k] = deepMergePreferPrimary(v, fallback[k]);
        }
        return out;
    }

    return primary;
}