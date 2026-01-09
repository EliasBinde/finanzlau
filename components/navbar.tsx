"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import {UrlObject} from "url";

type Props = {
    lang: "de" | "en";
    dict: Dictionary;
};

function stripLangPrefix(pathname: string, lang: string): string {
    const prefix = `/${lang}`;
    if (pathname === prefix) return "/";
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length) || "/";
    return pathname;
}

function isActive(pathnameNoLang: string, href: string): boolean {
    if (href === "/") return pathnameNoLang === "/";
    return pathnameNoLang === href || pathnameNoLang.startsWith(`${href}/`);
}

export function Navbar({ lang, dict }: Props) {
    const pathname = usePathname();
    const pathnameNoLang = stripLangPrefix(pathname, lang);
    const [open, setOpen] = React.useState(false);

    const items = [
        { href: "/" as const, label: dict.nav.home },
        { href: "/about" as const, label: dict.nav.about },
        { href: "/blog" as const, label: dict.nav.blog },
        { href: "/contact" as const, label: dict.nav.contact },
    ] as const

    function withLang(href: string, lang: string): UrlObject {
        const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
        return { pathname: path };
    }

    return (
        <nav aria-label="Primary navigation" className="flex w-full items-center justify-between gap-4">
            <Link href={`/${lang}`} className="text-sm font-semibold tracking-tight" aria-label="Go to home page">
                FINANZLAU
            </Link>

            <div className="hidden md:block">
                <NavigationMenu>
                    <NavigationMenuList className="flex-wrap">
                        {items.map((item) => {
                            const active = isActive(pathnameNoLang, item.href);
                            const cls = `${navigationMenuTriggerStyle()} ${active ? "bg-muted font-semibold" : ""}`;

                            return (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink asChild className={cls}>
                                        <Link href={withLang(item.href, lang)} aria-current={active ? "page" : undefined}>
                                            {item.label}
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            );
                        })}
                    </NavigationMenuList>
                </NavigationMenu>
            </div>

            <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen} >
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label={open ? "Close menu" : "Open menu"}
                            aria-controls="mobile-nav"
                            aria-expanded={open}
                        >
                            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="right" id="mobile-nav" aria-label="Mobile navigation" >
                        <SheetHeader>
                            <SheetTitle>
                                <span className="sr-only">Navigation</span>
                                Menu
                            </SheetTitle>
                        </SheetHeader>

                        <div className="mt-6 grid gap-2 pl-2">
                            {items.map((item) => {
                                const active = isActive(pathnameNoLang, item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={withLang(item.href, lang)}
                                        onClick={() => setOpen(false)}
                                        aria-current={active ? "page" : undefined}
                                        className={[
                                            "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                            "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                            active ? "bg-muted" : "",
                                        ].join(" ")}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}