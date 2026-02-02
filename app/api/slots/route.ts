import {NextResponse} from "next/server";
import {addDays, format, isSunday, parseISO, setHours, setMinutes} from "date-fns";
import {formatInTimeZone, fromZonedTime} from "date-fns-tz";
import {getCalendarClient} from "@/lib/google-calendar";

const TZ = "Europe/Berlin";

const SLOT_MINUTES = 60;
const BREAK_MINUTES = 30;
const MIN_LEAD_TIME_MINUTES = 3 * 60;

type Slot = {
    startUtc: string;
    endUtc: string;
    startLocal: string;
    endLocal: string;
    available: boolean;
};

type DaySlots = {
    date: string;
    slots: Slot[];
};

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && aEnd > bStart;
}

function isBookableDay(d: Date): boolean {
    return !isSunday(d);
}

function dayLocalRange(date: Date): { dayStartLocal: Date; dayEndLocal: Date } {
    const dayStartLocal = setMinutes(setHours(date, 8), 0);
    const dayEndLocal = setMinutes(setHours(date, 17), 1);
    return {dayStartLocal, dayEndLocal};
}

function makeSlotsForDay(dateLocal: Date, busy: Array<{ startMs: number; endMs: number }>): DaySlots {
    const {dayStartLocal, dayEndLocal} = dayLocalRange(dateLocal);

    const slots: Slot[] = [];
    const stepMinutes = SLOT_MINUTES + BREAK_MINUTES;

    const nowMs = Date.now();
    const minStartMs = nowMs + MIN_LEAD_TIME_MINUTES * 60_000;

    for (let cursor = dayStartLocal; cursor < dayEndLocal; cursor = new Date(cursor.getTime() + stepMinutes * 60_000)) {
        const slotStartUtc = fromZonedTime(cursor, TZ);

        if (slotStartUtc.getTime() < minStartMs) {
            continue;
        }

        const slotEndUtc = new Date(slotStartUtc.getTime() + SLOT_MINUTES * 60_000);

        const startMs = slotStartUtc.getTime();
        const endMs = slotEndUtc.getTime();

        const available = !busy.some((b) => overlap(startMs, endMs, b.startMs, b.endMs));

        const startUtc = slotStartUtc.toISOString();
        const endUtc = slotEndUtc.toISOString();

        const startLocal = formatInTimeZone(slotStartUtc, TZ, "yyyy-MM-dd'T'HH:mmXXX");
        const endLocal = formatInTimeZone(slotEndUtc, TZ, "yyyy-MM-dd'T'HH:mmXXX");

        slots.push({startUtc, endUtc, startLocal, endLocal, available});
    }

    return {date: format(dateLocal, "yyyy-MM-dd"), slots};
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const fromParam = url.searchParams.get("from");
    const daysParam = url.searchParams.get("days");

    // keep this below Google Calendar freebusy practical limits
    const days = Math.min(Math.max(Number(daysParam ?? "40"), 1), 90);

    const todayLocal = formatInTimeZone(new Date(), TZ, "yyyy-MM-dd");
    const fromDateStr = fromParam ?? todayLocal;

    const fromDateLocal = parseISO(fromDateStr);

    const dates: Date[] = [];
    for (let i = 0; i < days; i++) {
        const d = addDays(fromDateLocal, i);
        if (isBookableDay(d)) dates.push(d);
    }

    const first = dates[0] ?? fromDateLocal;
    const last = dates[dates.length - 1] ?? fromDateLocal;

    const {dayStartLocal: rangeStartLocal} = dayLocalRange(first);
    const {dayEndLocal: rangeEndLocal} = dayLocalRange(last);

    const timeMin = fromZonedTime(rangeStartLocal, TZ).toISOString();
    const timeMax = fromZonedTime(rangeEndLocal, TZ).toISOString();

    const {calendar, calendarId} = getCalendarClient();

    let fb;
    try {
        fb = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                timeZone: TZ,
                items: [{id: calendarId}],
            },
        });
    } catch (e) {
        // Return a helpful JSON error instead of throwing HTML
        console.error(e);
        return NextResponse.json({message: "Failed to query calendar availability."}, {status: 500});
    }

    const busyRaw = fb.data.calendars?.[calendarId]?.busy ?? [];
    const busy = busyRaw
        .map((b) => {
            const s = b.start ? new Date(b.start).getTime() : NaN;
            const e = b.end ? new Date(b.end).getTime() : NaN;
            return Number.isFinite(s) && Number.isFinite(e) ? {startMs: s, endMs: e} : null;
        })
        .filter((x): x is { startMs: number; endMs: number } => x !== null);

    const out: DaySlots[] = dates.map((d) => makeSlotsForDay(d, busy));

    return NextResponse.json({
        timezone: TZ,
        from: fromDateStr,
        days,
        timeMin,
        timeMax,
        slotMinutes: SLOT_MINUTES,
        breakMinutes: BREAK_MINUTES,
        data: out,
    });
}