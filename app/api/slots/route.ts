import { NextResponse } from "next/server";
import { addDays, format, isValid, parseISO } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";

const DEFAULT_TZ = process.env.HUBSPOT_MEETINGS_TIMEZONE ?? "Europe/Berlin";
const HUBSPOT_BASE_URL = process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com";
const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const HUBSPOT_MEETINGS_SLUG = process.env.HUBSPOT_MEETINGS_SLUG;
const HUBSPOT_DURATION_MS = Number(process.env.HUBSPOT_MEETINGS_DURATION_MS ?? "3600000");

type Slot = {
    startUtc: string;
    endUtc: string;
    startLocal: string;
    endLocal: string;
    available: boolean;
    availableCount?: number;
    availableUserIds?: string[];
    availableUsers?: Array<{ userId: string; fullName?: string; email?: string }>;
};

type DaySlots = {
    date: string;
    slots: Slot[];
};

type HubSpotBusyTime = {
    start: number;
    end: number;
};

type HubSpotUserBusyTimes = {
    meetingsUser?: {
        userId?: string;
        userProfile?: {
            fullName?: string;
            email?: string;
        };
    };
    isOffline?: boolean;
    busyTimes?: HubSpotBusyTime[];
};

type HubSpotAvailability = {
    startMillisUtc: number;
    endMillisUtc: number;
};

type HubSpotBookResponse = {
    customParams?: {
        meetingBufferTime?: number;
        durations?: number[];
    };
    allUsersBusyTimes?: HubSpotUserBusyTimes[];
    linkAvailability?: {
        hasMore?: boolean;
        linkAvailabilityByDuration?: Record<
            string,
            {
                meetingDurationMillis?: number;
                availabilities?: HubSpotAvailability[];
            }
        >;
    };
};

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && aEnd > bStart;
}

function monthOffsetsBetween(start: Date, end: Date): number[] {
    const out = new Set<number>();

    const now = new Date();
    const baseYear = Number(formatInTimeZone(now, DEFAULT_TZ, "yyyy"));
    const baseMonth = Number(formatInTimeZone(now, DEFAULT_TZ, "M")) - 1;

    let cursor = new Date(start.getTime());
    while (cursor <= end) {
        const y = Number(formatInTimeZone(cursor, DEFAULT_TZ, "yyyy"));
        const m = Number(formatInTimeZone(cursor, DEFAULT_TZ, "M")) - 1;
        out.add((y - baseYear) * 12 + (m - baseMonth));
        cursor = addDays(cursor, 32);
        cursor = parseISO(format(cursor, "yyyy-MM-01"));
    }

    return Array.from(out).sort((a, b) => a - b);
}

function makeDayList(fromDateLocal: Date, days: number): DaySlots[] {
    const out: DaySlots[] = [];
    for (let i = 0; i < days; i++) {
        const d = addDays(fromDateLocal, i);
        out.push({ date: format(d, "yyyy-MM-dd"), slots: [] });
    }
    return out;
}

async function fetchHubSpotBook(slug: string, timezone: string, monthOffset: number): Promise<HubSpotBookResponse> {
    if (!HUBSPOT_TOKEN) {
        throw new Error("Missing HUBSPOT_PRIVATE_APP_TOKEN");
    }

    const url = new URL(`${HUBSPOT_BASE_URL}/scheduler/v3/meetings/meeting-links/book/${encodeURIComponent(slug)}`);
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("monthOffset", String(monthOffset));

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HubSpot meetings API failed (${res.status}): ${body.slice(0, 200)}`);
    }

    return (await res.json()) as HubSpotBookResponse;
}

async function fetchHubSpotAvailabilityPage(
    slug: string,
    timezone: string,
    monthOffset: number
): Promise<HubSpotBookResponse> {
    if (!HUBSPOT_TOKEN) {
        throw new Error("Missing HUBSPOT_PRIVATE_APP_TOKEN");
    }

    const url = new URL(
        `${HUBSPOT_BASE_URL}/scheduler/v3/meetings/meeting-links/book/availability-page/${encodeURIComponent(slug)}`
    );
    url.searchParams.set("timezone", timezone);
    url.searchParams.set("monthOffset", String(monthOffset));

    const res = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            Accept: "application/json",
        },
        cache: "no-store",
    });

    if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`HubSpot availability-page API failed (${res.status}): ${body.slice(0, 200)}`);
    }

    return (await res.json()) as HubSpotBookResponse;
}

function flattenUniqueAvailabilities(
    responses: HubSpotBookResponse[],
    targetDurationMs: number
): Array<{ startMs: number; endMs: number }> {
    const unique = new Map<string, { startMs: number; endMs: number }>();

    for (const r of responses) {
        const byDuration = r.linkAvailability?.linkAvailabilityByDuration ?? {};
        const bucket =
            byDuration[String(targetDurationMs)] ??
            Object.values(byDuration).find((v) => v.meetingDurationMillis === targetDurationMs);
        const avs = bucket?.availabilities ?? [];

        for (const a of avs) {
            if (!Number.isFinite(a.startMillisUtc) || !Number.isFinite(a.endMillisUtc)) continue;
            const key = `${a.startMillisUtc}-${a.endMillisUtc}`;
            if (!unique.has(key)) {
                unique.set(key, { startMs: a.startMillisUtc, endMs: a.endMillisUtc });
            }
        }
    }

    return Array.from(unique.values()).sort((a, b) => a.startMs - b.startMs);
}

function mergeUserBusyTimes(responses: HubSpotBookResponse[]): Map<string, Array<{ startMs: number; endMs: number }>> {
    const map = new Map<string, Array<{ startMs: number; endMs: number }>>();

    for (const r of responses) {
        for (const u of r.allUsersBusyTimes ?? []) {
            const userId = u.meetingsUser?.userId;
            if (!userId || u.isOffline) continue;

            const current = map.get(userId) ?? [];
            for (const b of u.busyTimes ?? []) {
                if (!Number.isFinite(b.start) || !Number.isFinite(b.end)) continue;
                current.push({ startMs: b.start, endMs: b.end });
            }
            map.set(userId, current);
        }
    }

    for (const [userId, ranges] of map.entries()) {
        ranges.sort((a, b) => a.startMs - b.startMs);
        map.set(userId, ranges);
    }

    return map;
}

function mergeUserProfiles(
    responses: HubSpotBookResponse[]
): Map<string, { userId: string; fullName?: string; email?: string }> {
    const out = new Map<string, { userId: string; fullName?: string; email?: string }>();
    for (const r of responses) {
        for (const u of r.allUsersBusyTimes ?? []) {
            const userId = u.meetingsUser?.userId;
            if (!userId || u.isOffline) continue;
            out.set(userId, {
                userId,
                fullName: u.meetingsUser?.userProfile?.fullName,
                email: u.meetingsUser?.userProfile?.email,
            });
        }
    }
    return out;
}

function countAvailableUsers(
    userBusyMap: Map<string, Array<{ startMs: number; endMs: number }>>,
    startMs: number,
    endMs: number
): { availableCount: number; availableUserIds: string[] } {
    if (userBusyMap.size === 0) {
        return { availableCount: 0, availableUserIds: [] };
    }

    const freeUserIds: string[] = [];
    for (const [userId, ranges] of userBusyMap.entries()) {
        const isBusy = ranges.some((r) => overlap(startMs, endMs, r.startMs, r.endMs));
        if (!isBusy) freeUserIds.push(userId);
    }

    return { availableCount: freeUserIds.length, availableUserIds: freeUserIds };
}

export async function GET(req: Request) {
    const url = new URL(req.url);
    const fromParam = url.searchParams.get("from");
    const daysParam = url.searchParams.get("days");
    const timezone = (url.searchParams.get("timezone") || DEFAULT_TZ).trim() || DEFAULT_TZ;

    const slug = (url.searchParams.get("slug") || HUBSPOT_MEETINGS_SLUG || "").trim();
    if (!slug) {
        return NextResponse.json({ message: "Missing HUBSPOT meeting link slug." }, { status: 500 });
    }

    const days = Math.min(Math.max(Number(daysParam ?? "40"), 1), 90);

    const todayLocal = formatInTimeZone(new Date(), timezone, "yyyy-MM-dd");
    const fromDateStr = fromParam ?? todayLocal;
    const fromDateLocal = parseISO(fromDateStr);
    if (!isValid(fromDateLocal)) {
        return NextResponse.json({ message: "Invalid 'from' date. Expected yyyy-MM-dd." }, { status: 400 });
    }

    const toDateLocal = addDays(fromDateLocal, days - 1);
    const dayMap = new Map(makeDayList(fromDateLocal, days).map((d) => [d.date, d]));

    let responses: HubSpotBookResponse[];
    try {
        const monthOffsets = monthOffsetsBetween(fromDateLocal, toDateLocal);
        const reqs: Array<Promise<HubSpotBookResponse>> = [];

        for (const offset of monthOffsets) {
            reqs.push(fetchHubSpotBook(slug, timezone, offset));
            reqs.push(fetchHubSpotAvailabilityPage(slug, timezone, offset));
        }

        responses = await Promise.all(reqs);
    } catch (e) {
        console.error("[slots] hubspot fetch failed", e);
        return NextResponse.json({ message: "Failed to query HubSpot availability." }, { status: 500 });
    }

    const allDurations = responses.flatMap((r) => r.customParams?.durations ?? []);
    const fallbackDurationMs = allDurations.includes(HUBSPOT_DURATION_MS)
        ? HUBSPOT_DURATION_MS
        : (allDurations[0] ?? HUBSPOT_DURATION_MS);
    const slotDurationMs = fallbackDurationMs;

    const availabilities = flattenUniqueAvailabilities(responses, slotDurationMs);
    const userBusyMap = mergeUserBusyTimes(responses);
    const userProfiles = mergeUserProfiles(responses);

    for (const a of availabilities) {
        const start = new Date(a.startMs);
        const end = new Date(a.endMs);
        const day = formatInTimeZone(start, timezone, "yyyy-MM-dd");
        const target = dayMap.get(day);
        if (!target) continue;

        const startUtc = start.toISOString();
        const endUtc = end.toISOString();

        const { availableCount, availableUserIds } = countAvailableUsers(userBusyMap, a.startMs, a.endMs);
        const normalizedAvailableCount = userBusyMap.size === 0 ? 1 : Math.max(1, availableCount);

        target.slots.push({
            startUtc,
            endUtc,
            startLocal: formatInTimeZone(start, timezone, "yyyy-MM-dd'T'HH:mmXXX"),
            endLocal: formatInTimeZone(end, timezone, "yyyy-MM-dd'T'HH:mmXXX"),
            available: true,
            availableCount: normalizedAvailableCount,
            availableUserIds,
            availableUsers: availableUserIds.map((id) => userProfiles.get(id) ?? { userId: id }),
        });
    }

    for (const day of dayMap.values()) {
        day.slots.sort((a, b) => a.startUtc.localeCompare(b.startUtc));
    }

    const breakMinutes = Math.round(
        ((responses[0]?.customParams?.meetingBufferTime ?? 0) / 60_000)
    );
    const timeMin = fromZonedDayStartISO(fromDateLocal, timezone);
    const timeMax = fromZonedDayEndISO(toDateLocal, timezone);

    return NextResponse.json({
        timezone,
        from: fromDateStr,
        days,
        slug,
        timeMin,
        timeMax,
        slotMinutes: Math.round(slotDurationMs / 60_000),
        breakMinutes,
        data: Array.from(dayMap.values()),
    });
}

function fromZonedDayStartISO(d: Date, timezone: string): string {
    return fromZonedTime(`${format(d, "yyyy-MM-dd")}T00:00:00`, timezone).toISOString();
}

function fromZonedDayEndISO(d: Date, timezone: string): string {
    return fromZonedTime(`${format(d, "yyyy-MM-dd")}T23:59:59`, timezone).toISOString();
}
