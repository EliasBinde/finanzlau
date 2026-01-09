import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

export const locales = ["de", "en"] as const;
export const defaultLocale = "de";

type Locale = (typeof locales)[number];

function getLocale(request: NextRequest): Locale {
    const acceptLanguage = request.headers.get("accept-language") ?? "";
    const languages = new Negotiator({ headers: { "accept-language": acceptLanguage } }).languages();
    return match(languages, [...locales], defaultLocale) as Locale;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) return;

    const locale = getLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
};