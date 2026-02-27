import type {Metadata} from "next";
import {Montserrat} from "next/font/google";
import Link from "next/link";
import Script from "next/script";
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

function InstagramIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path
                d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z"/>
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path
                d="M4.98 3.5a2.25 2.25 0 1 1 0 4.5 2.25 2.25 0 0 1 0-4.5ZM3 9h3.96v12H3V9Zm7.2 0H14v1.71h.06c.53-1 1.82-2.06 3.74-2.06 4 0 4.74 2.63 4.74 6.05V21h-3.96v-5.56c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94V21H10.2V9Z"/>
        </svg>
    );
}

function WhatsAppBusinessIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
            <path
                d="M12.04 2A10 10 0 0 0 3.4 17.06L2 22l5.06-1.33A10 10 0 1 0 12.04 2Zm0 18.5a8.47 8.47 0 0 1-4.32-1.18l-.31-.18-2.89.76.77-2.82-.2-.32a8.5 8.5 0 1 1 6.95 3.74Zm4.95-6.45c-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.14-.17.27-.69.86-.84 1.03-.16.18-.31.2-.58.07a6.87 6.87 0 0 1-2.02-1.25 7.48 7.48 0 0 1-1.4-1.73c-.15-.27-.02-.41.11-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.5c-.18 0-.46.07-.7.34-.25.27-.95.92-.95 2.23 0 1.31.97 2.58 1.1 2.76.14.18 1.87 2.85 4.52 4 .63.28 1.13.44 1.52.56.64.2 1.22.17 1.68.1.52-.08 1.58-.65 1.8-1.27.23-.63.23-1.17.16-1.28-.07-.11-.24-.18-.51-.32Zm-3.58-8.6a3.42 3.42 0 0 1 .44 6.81l.54 1.66-1.41-1.35a3.42 3.42 0 1 1 .43-7.12Zm.2 1.56h-2.28v4.53h2.28a2.27 2.27 0 0 0 0-4.53Zm-.18 1.22a1.05 1.05 0 1 1 0 2.09h-.96V8.23h.96Z"/>
        </svg>
    );
}

export default async function RootLayout({children, params}: LayoutProps<"/[lang]">) {
    const {lang} = await params;
    const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

    if (!hasLocale(lang)) notFound();

    const {dict} = await getDictionary(lang);


    return (
        <html lang={lang} className={montserrat.variable}>
        <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {gtmId ? (
            <>
                <Script id="gtm-consent-default" strategy="beforeInteractive">
                    {`
                      window.dataLayer = window.dataLayer || [];
                      window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
                      window.gtag('consent', 'default', {
                        analytics_storage: 'denied',
                        ad_storage: 'denied',
                        ad_user_data: 'denied',
                        ad_personalization: 'denied',
                        functionality_storage: 'granted',
                        security_storage: 'granted'
                      });
                    `}
                </Script>
                <Script id="gtm-loader" strategy="afterInteractive">
                    {`
                      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                      })(window,document,'script','dataLayer','${gtmId}');
                    `}
                </Script>
                <noscript>
                    <iframe
                        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
                        height="0"
                        width="0"
                        style={{display: "none", visibility: "hidden"}}
                    />
                </noscript>
            </>
        ) : null}
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
                        <div className="flex items-center gap-2">
                            <a
                                href="https://wa.me/491713422274"
                                aria-label="WhatsApp Business"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-[#25D366] p-2 text-white transition-opacity hover:opacity-90"
                            >
                                <WhatsAppBusinessIcon/>
                            </a>
                            <a
                                href="https://www.instagram.com/finanzlau?igsh=MW0yOG1ueW0zaXgxaw=="
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-[#E4405F] p-2 text-white transition-opacity hover:opacity-90"
                            >
                                <InstagramIcon/>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/maximilian-henning-fanslau-b392b63b2"
                                aria-label="LinkedIn"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md bg-[#0A66C2] p-2 text-white transition-opacity hover:opacity-90"
                            >
                                <LinkedInIcon/>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            <CookieConsentBanner dict={dict} lang={lang}/>
        </div>
        </body>
        </html>
    );
}
