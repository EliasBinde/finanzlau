"use server";

import { z } from "zod";
import { Resend } from "resend";
import { getDictionary } from "@/app/[lang]/dictionaries";


const LOG = process.env.CONTACT_LOG === "1";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL;

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

function buildSchema(v: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    topic: string;
    contactPreference: string;
    messageMin: string;
    consent: string;
    emailOrPhone: string;
    contactPreferenceAvailability: string;
}) {
    const contactPreferenceSchema = z
        .string()
        .refine((value): value is "email" | "phone" => value === "email" || value === "phone", {
            message: v.contactPreference,
        });

    return z.object({
        fullName: z.string().min(2, v.fullName),
        email: z
            .string()
            .optional()
            .transform((value) => (value ?? "").trim())
            .refine((value) => value === "" || z.email().safeParse(value).success, v.email),
        phone: z
            .string()
            .optional()
            .transform((value) => (value ?? "").trim())
            .refine((value) => value === "" || value.length >= 6, v.phone),
        country: z.string().min(2, v.country),
        interest: z.string().min(2, v.topic),
        contactPreference: contactPreferenceSchema,
        message: z.string().min(20, v.messageMin),
        consent: z
            .string()
            .refine((value) => value === "on", { message: v.consent }),
    }).superRefine((data, ctx) => {
        const hasEmail = Boolean(data.email);
        const hasPhone = Boolean(data.phone);

        if (!hasEmail && !hasPhone) {
            ctx.addIssue({ code: "custom", path: ["email"], message: v.emailOrPhone });
            ctx.addIssue({ code: "custom", path: ["phone"], message: v.emailOrPhone });
            return;
        }

        if (hasEmail && !hasPhone && data.contactPreference !== "email") {
            ctx.addIssue({
                code: "custom",
                path: ["contactPreference"],
                message: v.contactPreferenceAvailability,
            });
        }

        if (hasPhone && !hasEmail && data.contactPreference !== "phone") {
            ctx.addIssue({
                code: "custom",
                path: ["contactPreference"],
                message: v.contactPreferenceAvailability,
            });
        }
    });
}

function getString(formData: FormData, key: string): string {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
}

export default async function submitContact(
    prevState: ContactFormState,
    formData: FormData
): Promise<ContactFormState> {
    const lang = getString(formData, "lang").trim();
    const { dict } = await getDictionary(lang || "de");
    const t = dict.contactForm;
    const schema = buildSchema(t.validationMessages);
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
            message: t.errorMessage,
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
            message: t.successMessage,
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
            message: t.systemMessages.emailConfigMissing,
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
            ...(d.email ? { replyTo: d.email } : {}),
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
            message: t.systemMessages.sendFailed,
            fieldErrors: {},
            values: raw,
        };
    }

    return {
        ok: true,
        message: t.successMessage,
        fieldErrors: {},
        values: {},
    };
}
