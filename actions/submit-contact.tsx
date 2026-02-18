"use server";

import { z } from "zod";
import { Resend } from "resend";


const LOG = process.env.CONTACT_LOG === "1";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

function isGerman(lang: string): boolean {
    return lang === "de";
}

function msg(lang: string) {
    const de = isGerman(lang);
    return {
        checkFields: de ? "Bitte prüfe die markierten Felder." : "Please check the highlighted fields.",
        success: de ? "Danke — wir haben deine Nachricht erhalten und melden uns zeitnah." : "Thanks — we received your message and will get back to you shortly.",
        emailConfigMissing: de ? "Der E-Mail-Dienst ist noch nicht vollständig konfiguriert. Bitte versuche es in Kürze erneut." : "Email service is not configured yet. Please try again shortly.",
        sendFailed: de ? "Deine Nachricht konnte gerade nicht gesendet werden. Bitte versuche es erneut." : "We could not send your message right now. Please try again.",
    };
}

function redact(raw: Record<string, string>) {
    return {
        ...raw,
        email: raw.email ? "[redacted]" : "",
        phone: raw.phone ? "[redacted]" : "",
        message: raw.message ? `[${raw.message.length} chars]` : "",
    };
}

export type ContactFormState = {
    ok: boolean;
    message: string;
    fieldErrors: Record<string, string[]>;
    values: Record<string, string>;
};

const contactPreferenceSchema = z
    .string()
    .refine((v): v is "email" | "phone" => v === "email" || v === "phone", {
        message: "Please choose a contact preference.",
    });

const schema = z.object({
    fullName: z.string().min(2, "Please enter your full name."),
    email: z.email("Please enter a valid email address."),
    phone: z
        .string()
        .optional()
        .transform((v) => (v ?? "").trim())
        .refine((v) => v === "" || v.length >= 6, "Please enter a valid phone number."),
    country: z.string().min(2, "Please select your country."),
    interest: z.string().min(2, "Please select a topic."),
    contactPreference: contactPreferenceSchema,
    message: z.string().min(20, "Please provide a bit more detail (min. 20 characters)."),
    consent: z
        .string()
        .refine((v) => v === "on", { message: "Consent is required to contact you." }),
});

function getString(formData: FormData, key: string): string {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
}

export default async function submitContact(
    prevState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const lang = getString(formData, "lang").trim();
    const t = msg(lang);
    const website = getString(formData, "website").trim();
    const raw = {
        fullName: getString(formData, "fullName"),
        email: getString(formData, "email"),
        phone: getString(formData, "phone"),
        country: getString(formData, "country"),
        interest: getString(formData, "interest"),
        contactPreference: getString(formData, "contactPreference"),
        message: getString(formData, "message"),
        consent: getString(formData, "consent"),
    };

    if (LOG) console.info("[contact] submit raw", redact(raw));

    if (LOG) console.info("[contact] formData keys", Array.from(formData.keys()));

    const parsed = schema.safeParse(raw);

    if (!parsed.success) {
        const flat = parsed.error.flatten();
        if (LOG) console.info("[contact] validation failed", flat.fieldErrors);
        return {
            ok: false,
            message: t.checkFields,
            fieldErrors: flat.fieldErrors,
            values: raw,
        };
    }

    if (LOG) console.info("[contact] validation ok");

    // Honeypot: silently accept bots to reduce spam retries.
    if (website) {
        if (LOG) console.info("[contact] honeypot triggered");
        return {
            ok: true,
            message: t.success,
            fieldErrors: {},
            values: {},
        };
    }

    if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
        if (LOG) {
            console.error("[contact] missing email env vars", {
                hasResendApiKey: Boolean(RESEND_API_KEY),
                hasContactToEmail: Boolean(CONTACT_TO_EMAIL),
                hasContactFromEmail: Boolean(CONTACT_FROM_EMAIL),
            });
        }
        return {
            ok: false,
            message: t.emailConfigMissing,
            fieldErrors: {},
            values: raw,
        };
    }

    const resend = new Resend(RESEND_API_KEY);

    try {
        const d = parsed.data;
        await resend.emails.send({
            from: CONTACT_FROM_EMAIL,
            to: CONTACT_TO_EMAIL,
            replyTo: d.email,
            subject: `New contact inquiry: ${d.fullName}`,
            text: [
                `Name: ${d.fullName}`,
                `Email: ${d.email}`,
                `Phone: ${d.phone || "-"}`,
                `Country: ${d.country}`,
                `Topic: ${d.interest}`,
                `Preferred contact method: ${d.contactPreference}`,
                "",
                "Message:",
                d.message,
            ].join("\n"),
        });
    } catch (error) {
        console.error("[contact] email send failed", error);
        return {
            ok: false,
            message: t.sendFailed,
            fieldErrors: {},
            values: raw,
        };
    }

    return {
        ok: true,
        message: t.success,
        fieldErrors: {},
        values: {},
    };
}
