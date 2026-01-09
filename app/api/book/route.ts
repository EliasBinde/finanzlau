import { NextResponse } from "next/server";
import { z } from "zod";
import { formatInTimeZone } from "date-fns-tz";
import { getCalendarClient } from "@/lib/google-calendar";

const TZ = "Europe/Berlin";

const schema = z.object({
    startUtc: z.string().min(10),
    endUtc: z.string().min(10),
    name: z.string().min(2),
    email: z.email("Invalid email"),
    phone: z.string().optional(),
    message: z.string().optional(),
});

function overlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
    return aStart < bEnd && aEnd > bStart;
}

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { startUtc, endUtc, name, email, phone, message } = parsed.data;

    const start = new Date(startUtc);
    const end = new Date(endUtc);

    if (!Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
        return NextResponse.json({ ok: false, message: "Invalid time range." }, { status: 400 });
    }

    const { calendar, calendarId } = getCalendarClient();

    const fb = await calendar.freebusy.query({
        requestBody: {
            timeMin: start.toISOString(),
            timeMax: end.toISOString(),
            timeZone: TZ,
            items: [{ id: calendarId }],
        },
    });

    const busyRaw = fb.data.calendars?.[calendarId]?.busy ?? [];
    const busy = busyRaw
        .map((b) => ({
            startMs: b.start ? new Date(b.start).getTime() : NaN,
            endMs: b.end ? new Date(b.end).getTime() : NaN,
        }))
        .filter((x) => Number.isFinite(x.startMs) && Number.isFinite(x.endMs));

    const isBusy = busy.some((b) => overlap(start.getTime(), end.getTime(), b.startMs, b.endMs));
    if (isBusy) {
        return NextResponse.json({ ok: false, message: "That slot is no longer available." }, { status: 409 });
    }

    const startLocalForText = formatInTimeZone(start, TZ, "yyyy-MM-dd'T'HH:mmXXX");
    const endLocalForText = formatInTimeZone(end, TZ, "yyyy-MM-dd'T'HH:mmXXX");

    const descriptionLines = [
        `Name: ${name}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : "",
        message ? `Message: ${message}` : "",
        "",
        `Slot: ${startLocalForText} – ${endLocalForText} (${TZ})`,
    ].filter(Boolean);

    const startDateTime = start.toISOString();
    const endDateTime = end.toISOString();

    try {
        const created = await calendar.events.insert({
            calendarId,
            requestBody: {
                summary: `Appointment: ${name}`,
                description: descriptionLines.join("\n"),
                start: { dateTime: startDateTime },
                end: { dateTime: endDateTime },
            },
        });

        return NextResponse.json({
            ok: true,
            eventId: created.data.id ?? null,
            htmlLink: created.data.htmlLink ?? null,
        });
    } catch (e: unknown) {
        const err = e as {
            message?: string;
            code?: number;
            response?: { data?: unknown; status?: number };
        };

        console.error("events.insert failed", {
            message: err.message,
            code: err.code,
            status: err.response?.status,
            data: err.response?.data,
            payload: {
                summary: `Appointment: ${name}`,
                start: { dateTime: startDateTime },
                end: { dateTime: endDateTime },
            },
        });

        return NextResponse.json(
            { ok: false, message: "Google Calendar rejected the request.", details: err.response?.data ?? null },
            { status: 400 }
        );
    }
}