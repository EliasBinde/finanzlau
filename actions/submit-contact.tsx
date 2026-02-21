"use server";

import { z } from "zod";
import { getDictionary } from "@/app/[lang]/dictionaries";


const LOG = process.env.CONTACT_LOG === "1";
const HUBSPOT_PRIVATE_APP_TOKEN = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
const HUBSPOT_BASE_URL = process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com";
const HUBSPOT_LEAD_PIPELINE_ID = process.env.HUBSPOT_LEAD_PIPELINE_ID;
const HUBSPOT_LEAD_PIPELINE_STAGE_ID = process.env.HUBSPOT_LEAD_PIPELINE_STAGE_ID;
const HUBSPOT_LEAD_TYPE = process.env.HUBSPOT_LEAD_TYPE;
const HUBSPOT_LEAD_LABEL = process.env.HUBSPOT_LEAD_LABEL;
const HUBSPOT_CONTACT_INTEREST_PROPERTY = process.env.HUBSPOT_CONTACT_INTEREST_PROPERTY;
const HUBSPOT_CONTACT_PREFERRED_CONTACT_PROPERTY =
    process.env.HUBSPOT_CONTACT_PREFERRED_CONTACT_PROPERTY ?? "preferred_channels";
const HUBSPOT_CONTACT_PREFERRED_CONTACT_EMAIL_VALUE =
    process.env.HUBSPOT_CONTACT_PREFERRED_CONTACT_EMAIL_VALUE ?? "Email";
const HUBSPOT_CONTACT_PREFERRED_CONTACT_PHONE_VALUE =
    process.env.HUBSPOT_CONTACT_PREFERRED_CONTACT_PHONE_VALUE ?? "SMS";
const HUBSPOT_LEAD_INTEREST_PROPERTY = process.env.HUBSPOT_LEAD_INTEREST_PROPERTY;
const HUBSPOT_LEAD_PREFERRED_CONTACT_PROPERTY = process.env.HUBSPOT_LEAD_PREFERRED_CONTACT_PROPERTY;

// Defaults for the standard lead pipeline properties.
const HUBSPOT_LEAD_PIPELINE_PROPERTY = process.env.HUBSPOT_LEAD_PIPELINE_PROPERTY ?? "hs_pipeline";
const HUBSPOT_LEAD_PIPELINE_STAGE_PROPERTY =
    process.env.HUBSPOT_LEAD_PIPELINE_STAGE_PROPERTY ?? "hs_pipeline_stage";

const HUBSPOT_CONTACT_ASSOCIATION_TYPE_ID = 578;
const HUBSPOT_NOTE_TO_LEAD_ASSOCIATION_TYPE_ID = 855;

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

function splitName(fullName: string): { firstName: string; lastName: string } {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length <= 1) {
        return { firstName: fullName.trim(), lastName: "" };
    }

    return {
        firstName: parts.slice(0, -1).join(" "),
        lastName: parts[parts.length - 1] ?? "",
    };
}

async function hubspotRequest(path: string, init: RequestInit): Promise<Response> {
    if (!HUBSPOT_PRIVATE_APP_TOKEN) {
        throw new Error("Missing HubSpot token");
    }

    return fetch(`${HUBSPOT_BASE_URL}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${HUBSPOT_PRIVATE_APP_TOKEN}`,
            "Content-Type": "application/json",
            ...(init.headers ?? {}),
        },
        cache: "no-store",
    });
}

type HubSpotObjectResponse = {
    id?: string;
    message?: string;
    status?: string;
    errors?: Array<{ message?: string }>;
};

async function parseHubSpotResponse(res: Response): Promise<HubSpotObjectResponse> {
    const data = (await res.json().catch(() => null)) as HubSpotObjectResponse | null;
    return data ?? {};
}

function buildNoteBody(d: {
    interest: string;
    message: string;
}) {
    return [
        "Lead inquiry",
        "",
        `Interest: ${d.interest}`,
        "",
        "Message:",
        d.message,
    ].join("\n");
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

    if (!HUBSPOT_PRIVATE_APP_TOKEN || !HUBSPOT_LEAD_PIPELINE_ID || !HUBSPOT_LEAD_PIPELINE_STAGE_ID) {
        if (LOG) {
            console.error("[contact] missing hubspot env vars", {
                hasHubSpotPrivateAppToken: Boolean(HUBSPOT_PRIVATE_APP_TOKEN),
                hasHubSpotLeadPipelineId: Boolean(HUBSPOT_LEAD_PIPELINE_ID),
                hasHubSpotLeadPipelineStageId: Boolean(HUBSPOT_LEAD_PIPELINE_STAGE_ID),
            });
        }
        return {
            ok: false,
            message: t.systemMessages.emailConfigMissing,
            fieldErrors: {},
            values: raw,
        };
    }

    try {
        const d = parsed.data;
        const { firstName, lastName } = splitName(d.fullName);

        const contactProperties: Record<string, string> = {
            firstname: firstName,
            lastname: lastName,
            country: d.country,
            phone: d.phone ?? "",
        };
        if (d.email) {
            contactProperties.email = d.email;
        }
        if (HUBSPOT_CONTACT_INTEREST_PROPERTY) {
            contactProperties[HUBSPOT_CONTACT_INTEREST_PROPERTY] = d.interest;
        }
        if (HUBSPOT_CONTACT_PREFERRED_CONTACT_PROPERTY) {
            contactProperties[HUBSPOT_CONTACT_PREFERRED_CONTACT_PROPERTY] =
                d.contactPreference === "email"
                    ? HUBSPOT_CONTACT_PREFERRED_CONTACT_EMAIL_VALUE
                    : HUBSPOT_CONTACT_PREFERRED_CONTACT_PHONE_VALUE;
        }

        let contactId: string | undefined;

        if (d.email) {
            const patchRes = await hubspotRequest(
                `/crm/v3/objects/contacts/${encodeURIComponent(d.email)}?idProperty=email`,
                {
                    method: "PATCH",
                    body: JSON.stringify({ properties: contactProperties }),
                }
            );

            if (patchRes.ok) {
                const patchData = await parseHubSpotResponse(patchRes);
                contactId = patchData.id;
            } else if (patchRes.status !== 404) {
                const patchErr = await parseHubSpotResponse(patchRes);
                throw new Error(
                    `HubSpot contact update failed (${patchRes.status}): ${patchErr.message ?? patchErr.status ?? "unknown"}`
                );
            }
        }

        if (!contactId) {
            const createContactRes = await hubspotRequest("/crm/v3/objects/contacts", {
                method: "POST",
                body: JSON.stringify({ properties: contactProperties }),
            });

            if (!createContactRes.ok) {
                const contactErr = await parseHubSpotResponse(createContactRes);
                throw new Error(
                    `HubSpot contact create failed (${createContactRes.status}): ${contactErr.message ?? contactErr.status ?? "unknown"}`
                );
            }

            const createContactData = await parseHubSpotResponse(createContactRes);
            contactId = createContactData.id;
        }

        if (!contactId) {
            throw new Error("HubSpot contact ID missing from response");
        }
        if (LOG) console.info("[contact] hubspot contact upserted", { contactId });

        const leadProperties: Record<string, string> = {
            hs_lead_name: d.fullName,
        };

        if (HUBSPOT_LEAD_TYPE) {
            leadProperties.hs_lead_type = HUBSPOT_LEAD_TYPE;
        }
        if (HUBSPOT_LEAD_LABEL) {
            leadProperties.hs_lead_label = HUBSPOT_LEAD_LABEL;
        }
        if (HUBSPOT_LEAD_INTEREST_PROPERTY) {
            leadProperties[HUBSPOT_LEAD_INTEREST_PROPERTY] = d.interest;
        }
        if (HUBSPOT_LEAD_PREFERRED_CONTACT_PROPERTY) {
            leadProperties[HUBSPOT_LEAD_PREFERRED_CONTACT_PROPERTY] = d.contactPreference;
        }
        if (HUBSPOT_LEAD_PIPELINE_ID) {
            leadProperties[HUBSPOT_LEAD_PIPELINE_PROPERTY] = HUBSPOT_LEAD_PIPELINE_ID;
        }
        if (HUBSPOT_LEAD_PIPELINE_STAGE_ID) {
            leadProperties[HUBSPOT_LEAD_PIPELINE_STAGE_PROPERTY] = HUBSPOT_LEAD_PIPELINE_STAGE_ID;
        }

        const createLeadRes = await hubspotRequest("/crm/v3/objects/leads", {
            method: "POST",
            body: JSON.stringify({
                properties: leadProperties,
                associations: [
                    {
                        to: { id: contactId },
                        types: [
                            {
                                associationCategory: "HUBSPOT_DEFINED",
                                associationTypeId: HUBSPOT_CONTACT_ASSOCIATION_TYPE_ID,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!createLeadRes.ok) {
            const leadErr = await parseHubSpotResponse(createLeadRes);
            throw new Error(
                `HubSpot lead create failed (${createLeadRes.status}): ${
                    leadErr.message ?? leadErr.errors?.[0]?.message ?? leadErr.status ?? "unknown"
                }`
            );
        }

        const createLeadData = await parseHubSpotResponse(createLeadRes);
        const leadId = createLeadData.id;
        if (!leadId) {
            throw new Error("HubSpot lead ID missing from response");
        }

        const noteBody = buildNoteBody(d);
        const createNoteRes = await hubspotRequest("/crm/v3/objects/notes", {
            method: "POST",
            body: JSON.stringify({
                properties: {
                    hs_timestamp: String(Date.now()),
                    hs_note_body: noteBody,
                },
                associations: [
                    {
                        to: { id: leadId },
                        types: [
                            {
                                associationCategory: "HUBSPOT_DEFINED",
                                associationTypeId: HUBSPOT_NOTE_TO_LEAD_ASSOCIATION_TYPE_ID,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!createNoteRes.ok) {
            const noteErr = await parseHubSpotResponse(createNoteRes);
            throw new Error(
                `HubSpot note create failed (${createNoteRes.status}): ${
                    noteErr.message ?? noteErr.errors?.[0]?.message ?? noteErr.status ?? "unknown"
                }`
            );
        }

        const createNoteData = await parseHubSpotResponse(createNoteRes);
        if (LOG) {
            console.info("[contact] hubspot lead created", {
                leadId: leadId ?? null,
                pipelineId: HUBSPOT_LEAD_PIPELINE_ID,
                pipelineStageId: HUBSPOT_LEAD_PIPELINE_STAGE_ID,
            });
            console.info("[contact] hubspot note created", {
                noteId: createNoteData.id ?? null,
            });
        }
    } catch (error) {
        console.error("[contact] hubspot submit failed", error);
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
