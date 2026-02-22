import { NextResponse } from "next/server";
import { z } from "zod";

const HUBSPOT_BASE_URL = process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com";
const HUBSPOT_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const HUBSPOT_MEETINGS_SLUG = process.env.HUBSPOT_MEETINGS_SLUG;
const HUBSPOT_MEETINGS_TIMEZONE = process.env.HUBSPOT_MEETINGS_TIMEZONE ?? "Europe/Berlin";
const HUBSPOT_MEETINGS_LOCALE_DEFAULT = process.env.HUBSPOT_MEETINGS_LOCALE_DEFAULT ?? "de-de";

const schema = z.object({
    startUtc: z.string().min(10),
    endUtc: z.string().min(10),
    name: z.string().min(2),
    email: z.email("Invalid email"),
    phone: z.string().optional(),
    message: z.string().optional(),
    timezone: z.string().optional(),
    locale: z.string().optional(),
    likelyAvailableUserIds: z.array(z.string()).optional(),
});

function splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) {
        return { firstName: fullName.trim(), lastName: "Website" };
    }

    return {
        firstName: parts.slice(0, -1).join(" "),
        lastName: parts[parts.length - 1] ?? "Website",
    };
}

type HubSpotError = {
    status?: string;
    message?: string;
    category?: string;
    subCategory?: string;
    correlationId?: string;
};

type HubSpotBookSuccess = {
    start?: number;
    end?: number;
    duration?: number;
    contactId?: string;
    calendarEventId?: string | null;
    isOffline?: boolean;
    meetingsOwnerUserId?: string | null;
};

type HubSpotContactSearchResponse = {
    total?: number;
    results?: Array<{
        id: string;
        properties?: {
            firstname?: string | null;
            lastname?: string | null;
        };
    }>;
};

async function findContactByEmail(email: string): Promise<{ id: string; firstName?: string; lastName?: string } | null> {
    if (!HUBSPOT_TOKEN) return null;

    const url = `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/search`;
    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${HUBSPOT_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            filterGroups: [
                {
                    filters: [{ propertyName: "email", operator: "EQ", value: email }],
                },
            ],
            properties: ["firstname", "lastname"],
            limit: 1,
        }),
        cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json().catch(() => null)) as HubSpotContactSearchResponse | null;
    const found = data?.results?.[0];
    if (!found?.id) return null;

    return {
        id: found.id,
        firstName: found.properties?.firstname ?? undefined,
        lastName: found.properties?.lastname ?? undefined,
    };
}

export async function POST(req: Request) {
    if (!HUBSPOT_TOKEN || !HUBSPOT_MEETINGS_SLUG) {
        return NextResponse.json(
            { ok: false, message: "HubSpot booking is not configured." },
            { status: 500 }
        );
    }

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { startUtc, endUtc, name, email, timezone, locale, likelyAvailableUserIds } = parsed.data;
    const start = new Date(startUtc);
    const end = new Date(endUtc);

    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
        return NextResponse.json({ ok: false, message: "Invalid time range." }, { status: 400 });
    }

    const durationMs = end.getTime() - start.getTime();
    const tz = (timezone ?? HUBSPOT_MEETINGS_TIMEZONE).trim() || HUBSPOT_MEETINGS_TIMEZONE;
    const loc = (locale ?? HUBSPOT_MEETINGS_LOCALE_DEFAULT).trim() || HUBSPOT_MEETINGS_LOCALE_DEFAULT;
    const split = splitName(name);
    let firstName = split.firstName;
    let lastName = split.lastName;
    let contactId: string | undefined;

    try {
        const existing = await findContactByEmail(email);
        if (existing?.id) {
            contactId = existing.id;
            if (existing.firstName?.trim()) firstName = existing.firstName.trim();
            if (existing.lastName?.trim()) lastName = existing.lastName.trim();
        }
    } catch (e) {
        console.error("[book] contact lookup failed, continuing without contactId", e);
    }

    const payload = {
        slug: HUBSPOT_MEETINGS_SLUG,
        ...(contactId ? { contactId } : {}),
        firstName,
        lastName,
        email,
        startTime: start.getTime(),
        duration: durationMs,
        guestEmails: [] as string[],
        timezone: tz,
        locale: loc,
        likelyAvailableUserIds: likelyAvailableUserIds ?? [],
    };

    try {
        const url = new URL(`${HUBSPOT_BASE_URL}/scheduler/v3/meetings/meeting-links/book`);
        url.searchParams.set("timezone", tz);

        const res = await fetch(url.toString(), {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HUBSPOT_TOKEN}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
            cache: "no-store",
        });

        if (!res.ok) {
            const err = (await res.json().catch(() => null)) as HubSpotError | null;
            const rawMessage = err?.message?.trim() || "Booking failed. Please try another slot.";
            const hasFieldPermissionError = rawMessage.includes("sufficient field-level-permission");
            const message = hasFieldPermissionError
                ? "HubSpot booking is blocked by contact field permissions. Please allow writing firstname, lastname, and hubspot_owner_id for the private app user."
                : rawMessage;
            const status = hasFieldPermissionError ? 403 : (res.status === 409 ? 409 : 400);

            return NextResponse.json(
                {
                    ok: false,
                    message,
                    rawMessage,
                    category: err?.category ?? null,
                    subCategory: err?.subCategory ?? null,
                    correlationId: err?.correlationId ?? null,
                },
                { status }
            );
        }

        const data = (await res.json()) as HubSpotBookSuccess;

        return NextResponse.json({
            ok: true,
            contactId: data.contactId ?? null,
            calendarEventId: data.calendarEventId ?? null,
            meetingsOwnerUserId: data.meetingsOwnerUserId ?? null,
            isOffline: data.isOffline ?? false,
            start: data.start ?? start.getTime(),
            end: data.end ?? end.getTime(),
            duration: data.duration ?? durationMs,
        });
    } catch (e) {
        console.error("[book] hubspot booking failed", e);
        return NextResponse.json(
            { ok: false, message: "Could not book your appointment right now." },
            { status: 500 }
        );
    }
}
