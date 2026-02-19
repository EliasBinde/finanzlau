import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import Link from "next/link";
import "../globals.css";
import {Navbar} from "@/components/navbar";
import {getDictionary, hasLocale} from "./dictionaries";
import {notFound} from 'next/navigation'
import {locales} from "@/proxy";
import {UrlObject} from "url";
import {CookieConsentBanner} from "@/components/cookie-consent-banner";


const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "FINANZLAU",
        template: "%s · FINANZLAU",
    },
    description: "Professional financial advisory services tailored to your needs.",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon.ico",
    },
};
export const viewport = "width=device-width, initial-scale=1";

export async function generateStaticParams() {
    return locales.map((lang) => ({lang}));
}

function withLangPath(lang: string, href: string): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return {pathname: path};
}

export default async function RootLayout({children, params}: LayoutProps<"/[lang]">) {
    const {lang} = await params;

    if (!hasLocale(lang)) notFound();

    const {dict} = await getDictionary(lang);


    return (
        <html lang={lang} className={montserrat.variable}>
        <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <div className="flex min-h-screen flex-col">
            <header className="border-b">
                <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                    <Navbar lang={lang} dict={dict}/>
                </div>
            </header>

            <main className="flex-1">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
            </main>

            <footer className="border-t">
                <div
                    className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                    <span>© {new Date().getFullYear()} FINANZLAU. {dict.footer.rightsReserved}</span>
                    <div className="flex items-center gap-4">
                        <Link href={withLangPath(lang, "/impressum")} className="underline underline-offset-4">
                            {dict.footer.impressum}
                        </Link>
                        <Link href={withLangPath(lang, "/datenschutz")} className="underline underline-offset-4">
                            {dict.footer.privacy}
                        </Link>
                    </div>
                </div>
            </footer>
            <CookieConsentBanner dict={dict} lang={lang}/>
        </div>
        </body>
        </html>
    );
}
