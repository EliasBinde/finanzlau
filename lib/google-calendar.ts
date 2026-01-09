import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

function getEnv(name: string): string {
    const v = process.env[name];
    if (!v) throw new Error(`Missing env: ${name}`);
    return v;
}

export function getCalendarClient() {
    const clientEmail = getEnv("GOOGLE_SA_CLIENT_EMAIL");
    const privateKey = getEnv("GOOGLE_SA_PRIVATE_KEY").replace(/\\n/g, "\n");

    const auth = new google.auth.JWT({
        email: clientEmail,
        key: privateKey,
        scopes: SCOPES,
    });

    const calendar = google.calendar({ version: "v3", auth });
    const calendarId = getEnv("GOOGLE_CALENDAR_ID");

    return { calendar, calendarId };
}