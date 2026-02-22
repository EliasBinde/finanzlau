"use client";

import * as React from "react";
import {addDays, format, parseISO} from "date-fns";
import {ChevronLeft, ChevronRight, RefreshCw} from "lucide-react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {AppointmentBookingModal} from "@/components/appointment-booking-modal";
import type {Dictionary} from "@/app/[lang]/dictionaries";

type Slot = {
    startUtc: string;
    endUtc: string;
    startLocal: string;
    endLocal: string;
    available: boolean;
    availableUserIds?: string[];
};

type DaySlots = {
    date: string;
    slots: Slot[];
};

type SlotsResponse = {
    timezone: string;
    from: string;
    days: number;
    timeMin: string;
    timeMax: string;
    data: DaySlots[];
};

type Props = {
    dict: Dictionary;
    lang: "de" | "en";
    /** window size to fetch; default 40 */
    days?: number;
    /** initial start date (yyyy-MM-dd). if omitted, API uses "today" */
    from?: string;
};


function formatTimeRange(slot: Slot): string {
    const start = slot.startLocal.slice(11, 16);
    const end = slot.endLocal.slice(11, 16);
    return `${start}–${end}`;
}

function interpolate(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}

function clamp(n: number, min: number, max: number) {
    return Math.min(Math.max(n, min), max);
}

export function AppointmentSlots({dict, lang, days = 40, from}: Props) {
    const t = dict.appointmentSlots;

    const WINDOW_DAYS = days;
    const CENTER_INDEX = Math.floor(WINDOW_DAYS / 2); // for 40 => 20

    const [data, setData] = React.useState<SlotsResponse | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [err, setErr] = React.useState<string>("");
    const [dayIndex, setDayIndex] = React.useState(0);
    const [pendingDate, setPendingDate] = React.useState<string | null>(null);


    // dynamic window anchor (yyyy-MM-dd)
    const [activeFrom, setActiveFrom] = React.useState<string | undefined>(from);

    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedSlot, setSelectedSlot] = React.useState<Slot | null>(null);

    const load = React.useCallback(
        async (opts?: { preserveDayIndex?: boolean; desiredDate?: string }) => {
            setLoading(true);
            setErr("");

            const params = new URLSearchParams();
            params.set("days", String(WINDOW_DAYS));
            if (activeFrom) params.set("from", activeFrom);

            let res: Response;
            try {
                res = await fetch(`/api/slots?${params.toString()}`, {
                    method: "GET",
                    headers: {Accept: "application/json"},
                    cache: "no-store",
                });
            } catch {
                setErr(interpolate(t.errors.failedWithStatus, {status: "network"}));
                setData(null);
                setLoading(false);
                return;
            }

            if (!res.ok) {
                const contentType = res.headers.get("content-type") ?? "";
                const status = res.status;

                let message = interpolate(t.errors.failedWithStatus, {status});

                if (contentType.includes("application/json")) {
                    try {
                        const j = (await res.json()) as unknown;
                        if (j && typeof j === "object") {
                            const maybeMessage = (j as { message?: unknown }).message;
                            if (typeof maybeMessage === "string" && maybeMessage.trim()) {
                                message = maybeMessage;
                            }
                        }
                    } catch {
                        // ignore
                    }
                } else {
                    try {
                        const text = (await res.text()).trim();
                        const looksLikeHtml =
                            text.startsWith("<!DOCTYPE") ||
                            text.startsWith("<html") ||
                            text.includes("<head") ||
                            text.includes("<body");
                        if (!looksLikeHtml && text.length > 0 && text.length < 200) {
                            message = text;
                        }
                    } catch {
                        // ignore
                    }
                }

                if (status === 404) message = t.errors.endpointNotFound;
                if (status === 500) message = t.errors.serverError;

                setErr(message);
                setData(null);
                setLoading(false);
                return;
            }

            const json = (await res.json()) as SlotsResponse;

            setData(json);

            if (pendingDate) {
                const idx = json.data.findIndex((d) => d.date === pendingDate);
                setDayIndex(idx >= 0 ? idx : clamp(CENTER_INDEX, 0, Math.max(json.data.length - 1, 0)));
                setPendingDate(null);
                setLoading(false);
                return;
            }

            // If caller wants to land on a particular date, try to find it in the window.
            if (opts?.desiredDate) {
                const idx = json.data.findIndex((d) => d.date === opts.desiredDate);
                if (idx >= 0) {
                    setDayIndex(idx);
                    setLoading(false);
                    return;
                }
                // fallback: center
                setDayIndex(clamp(CENTER_INDEX, 0, Math.max(json.data.length - 1, 0)));
                setLoading(false);
                return;
            }

            if (opts?.preserveDayIndex) {
                // keep index, but clamp
                setDayIndex((i) => clamp(i, 0, Math.max(json.data.length - 1, 0)));
                setLoading(false);
                return;
            }

            const firstWithFreeSlot = json.data.findIndex((d) => d.slots.some((s) => s.available));
            setDayIndex(firstWithFreeSlot >= 0 ? firstWithFreeSlot : 0);
            setLoading(false);
        },
        [
            WINDOW_DAYS,
            CENTER_INDEX,
            activeFrom,
            pendingDate,
            t.errors.failedWithStatus,
            t.errors.endpointNotFound,
            t.errors.serverError,
        ]
    );

    React.useEffect(() => {
        void load();
    }, [load]);

    const daysData = React.useMemo(() => data?.data ?? [], [data?.data]);
    const current = daysData[dayIndex];

    const canPrev = dayIndex > 0;
    const canNext = dayIndex < daysData.length - 1;

    const goPrev = React.useCallback(() => {
        setDayIndex((i) => (i > 0 ? i - 1 : i));
    }, []);

    const goNext = React.useCallback(() => {
        setDayIndex((i) => {
            if (i >= daysData.length - 1) return i;

            for (let next = i + 1; next < daysData.length; next++) {
                if (daysData[next]?.slots.some((s) => s.available)) {
                    return next;
                }
            }

            return i + 1;
        });
    }, [daysData]);

    const onKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                if (canPrev) goPrev();
            }
            if (e.key === "ArrowRight") {
                e.preventDefault();
                if (canNext) goNext();
            }
        },
        [canPrev, canNext, goPrev, goNext]
    );

    const onSlotClick = React.useCallback((slot: Slot) => {
        setSelectedSlot(slot);
        setModalOpen(true);
    }, []);

    const onBooked = React.useCallback(() => {
        void load({preserveDayIndex: true});
    }, [load]);

    const onPickDate = React.useCallback(
        (pickedIso: string) => {
            if (!pickedIso) return;

            const inWindowIdx = daysData.findIndex((d) => d.date === pickedIso);
            if (inWindowIdx >= 0) {
                setDayIndex(inWindowIdx);
                return;
            }

            const picked = parseISO(pickedIso);
            const newFrom = format(addDays(picked, -CENTER_INDEX), "yyyy-MM-dd");

            setPendingDate(pickedIso);
            setActiveFrom(newFrom); // <-- effect will load once with the NEW from
        },
        [CENTER_INDEX, daysData]
    );

    // Optional: if API returns `from`, keep activeFrom in sync (useful if user didn't pass `from` initially).
    React.useEffect(() => {
        if (data?.from && data.from !== activeFrom) {
            setActiveFrom(data.from);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.from]);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{t.title}</CardTitle>
                    <CardDescription>{t.description}</CardDescription>
                    <p className="text-sm font-medium text-muted-foreground">{t.freeNote}</p>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                        <Button type="button" variant="outline" onClick={() => load()} disabled={loading}
                                aria-label={t.labels.reloadAria}>
                            <RefreshCw className="h-4 w-4" aria-hidden="true"/>
                            {loading ? t.actions.loading : t.actions.refresh}
                        </Button>

                        {data?.timezone ? (
                            <div className="text-sm text-muted-foreground" aria-label={t.labels.timezone}>
                                {t.labels.timezone}: {data.timezone}
                            </div>
                        ) : null}
                    </div>

                    {err ? (
                        <p className="text-sm font-medium text-destructive" role="alert" aria-live="polite">
                            {err}
                        </p>
                    ) : null}

                    {loading ? (
                        <p className="text-sm text-muted-foreground" aria-live="polite">
                            {t.messages.loadingSlots}
                        </p>
                    ) : null}

                    {!loading && current ? (
                        <div className="space-y-4" role="region" aria-label={t.labels.regionAria} tabIndex={0}
                             onKeyDown={onKeyDown}>
                            <div className="grid grid-cols-[40px_1fr_40px] items-center gap-2">
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={goPrev}
                                    disabled={!canPrev}
                                    aria-label={t.labels.prevDayAria}
                                >
                                    <ChevronLeft className="h-4 w-4" aria-hidden="true"/>
                                </Button>

                                <div className="flex flex-col items-center gap-1">


                                    <input
                                        type="date"
                                        className="h-9 rounded-md border bg-background px-2 text-sm"
                                        value={current.date}
                                        onChange={(e) => onPickDate(e.target.value)}
                                    />
                                </div>

                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    onClick={goNext}
                                    disabled={!canNext}
                                    aria-label={t.labels.nextDayAria}
                                >
                                    <ChevronRight className="h-4 w-4" aria-hidden="true"/>
                                </Button>
                            </div>

                            <div className="flex flex-col gap-2" aria-label={t.labels.slotsAria}>
                                {current.slots.map((slot) => {
                                    const label = formatTimeRange(slot);
                                    const disabled = !slot.available;

                                    const ariaLabel = disabled
                                        ? interpolate(t.slot.unavailableAria, {label})
                                        : interpolate(t.slot.bookAria, {label});

                                    return (
                                        <Button
                                            key={slot.startUtc}
                                            type="button"
                                            variant={disabled ? "outline" : "default"}
                                            disabled={disabled}
                                            onClick={() => onSlotClick(slot)}
                                            aria-disabled={disabled}
                                            aria-label={ariaLabel}
                                            className={disabled ? "opacity-50 w-full justify-center" : "w-full justify-center"}
                                        >
                                            {label}
                                        </Button>
                                    );
                                })}
                            </div>

                            <div className="text-xs text-muted-foreground">{t.messages.tip}</div>
                        </div>
                    ) : null}

                    {!loading && !err && (!data || !data.data.length) ? (
                        <p className="text-sm text-muted-foreground" aria-live="polite">
                            {t.messages.noSlots}
                        </p>
                    ) : null}
                </CardContent>
            </Card>

            <AppointmentBookingModal
                open={modalOpen}
                onOpenChangeAction={setModalOpen}
                slot={selectedSlot}
                onBookedAction={onBooked}
                lang={lang}
                timezone={data?.timezone}
                dict={dict}
            />
        </>
    );
}
