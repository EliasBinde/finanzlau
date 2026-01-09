"use server";

import { z } from "zod";


const LOG = process.env.CONTACT_LOG === "1";

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
            message: "Please check the highlighted fields.",
            fieldErrors: flat.fieldErrors,
            values: raw,
        };
    }

    if (LOG) console.info("[contact] validation ok");

    return {
        ok: true,
        message: "Thanks — we received your message and will get back to you shortly.",
        fieldErrors: {},
        values: {},
    };
}