"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";
import { UrlObject } from "url";

type ConsentChoice = "essential" | "all";

type StoredConsent = {
  choice: ConsentChoice;
  analytics: boolean;
  timestamp: number;
};

const STORAGE_KEY = "finanzlau_cookie_consent_v1";

function withLangPath(lang: Locale, href: string): UrlObject {
  const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
  return { pathname: path };
}

function parseStoredConsent(raw: string | null): StoredConsent | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if ((parsed.choice === "essential" || parsed.choice === "all") && typeof parsed.analytics === "boolean") {
      return {
        choice: parsed.choice,
        analytics: parsed.analytics,
        timestamp: typeof parsed.timestamp === "number" ? parsed.timestamp : Date.now(),
      };
    }
  } catch {
    return null;
  }
  return null;
}

function applyTrackingConsent(analytics: boolean) {
  if (typeof window === "undefined") return;

  const consentPayload = {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
  } as const;

  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };

  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", consentPayload);
  }

  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({
      event: "cookie_consent_updated",
      analytics,
    });
  }

  window.dispatchEvent(
    new CustomEvent("finanzlau-cookie-consent-updated", {
      detail: { analytics },
    })
  );
}

export function CookieConsentBanner({ dict, lang }: { dict: Dictionary; lang: Locale }) {
  const t = dict.cookieBanner;
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const consent = parseStoredConsent(window.localStorage.getItem(STORAGE_KEY));
    if (!consent) {
      setVisible(true);
      return;
    }
    applyTrackingConsent(consent.analytics);
  }, []);

  const saveConsent = React.useCallback((choice: ConsentChoice) => {
    const consent: StoredConsent = {
      choice,
      analytics: choice === "all",
      timestamp: Date.now(),
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    applyTrackingConsent(consent.analytics);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 sm:inset-x-6 lg:inset-x-8">
      <div className="mx-auto max-w-4xl rounded-xl border bg-background/95 p-4 shadow-xl backdrop-blur sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold">{t.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.description}</p>
            <Link href={withLangPath(lang, "/datenschutz")} className="mt-2 inline-block text-xs underline underline-offset-4">
              {t.legalLink}
            </Link>
          </div>

          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => saveConsent("essential")}> 
              {t.essentialOnly}
            </Button>
            <Button type="button" onClick={() => saveConsent("all")}>
              {t.acceptAll}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
