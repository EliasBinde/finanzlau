"use client";

import * as React from "react";
import { useActionState } from "react";
import submitContact, { type ContactFormState } from "@/actions/submit-contact";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { initialState } from "@/actions/submit-contact.state";
import type { Dictionary, Locale } from "@/app/[lang]/dictionaries";

type ContactPreference = "email" | "phone";

function asContactPreference(value: string): ContactPreference {
    return value === "phone" ? "phone" : "email";
}

function hasError(state: ContactFormState, name: string): boolean {
    return (state.fieldErrors[name]?.length ?? 0) > 0;
}

function FieldError({ state, name }: { state: ContactFormState; name: string }) {
    const msg = state.fieldErrors[name]?.[0];
    return msg ? (
        <p className="mt-1 text-sm font-medium text-destructive" role="alert" aria-live="polite">
            {msg}
        </p>
    ) : null;
}

export function ContactForm({ dict, lang }: { dict: Dictionary; lang: Locale }) {
    const [state, formAction, pending] = useActionState(submitContact, initialState);

    const interests = dict.contactForm.options.interests;
    const countries = dict.contactForm.options.countries;

    const [country, setCountry] = React.useState(state.values.country ?? "");
    const [interest, setInterest] = React.useState(state.values.interest ?? "");
    const [contactPreference, setContactPreference] = React.useState<ContactPreference>(
        asContactPreference(state.values.contactPreference ?? "email")
    );

    React.useEffect(() => {
        setCountry(state.values.country ?? "");
        setInterest(state.values.interest ?? "");
        setContactPreference(asContactPreference(state.values.contactPreference ?? "email"));
    }, [state.values]);

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>{dict.contactForm.title}</CardTitle>
                <CardDescription>{dict.contactForm.description}</CardDescription>
                <CardAction>
                    <Button variant="outline" type="reset" disabled={pending}>
                        {dict.contactForm.reset}
                    </Button>
                </CardAction>
            </CardHeader>

            <CardContent>
                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="lang" value={lang} />
                    {state.message ? (
                        <p
                            aria-live="polite"
                            className={state.ok ? "text-sm font-medium text-emerald-600" : "text-sm font-medium text-destructive"}
                            role={state.ok ? "status" : "alert"}
                        >
                            {state.message}
                        </p>
                    ) : null}

                    <div className="hidden" aria-hidden="true">
                        <label>
                            {dict.contactForm.honeypotLabel}
                            <input name="website" tabIndex={-1} autoComplete="off" />
                        </label>
                    </div>

                    <FieldGroup>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="fullName">{dict.contactForm.fields.fullName.label}</FieldLabel>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    placeholder={dict.contactForm.fields.fullName.placeholder}
                                    defaultValue={state.values.fullName ?? ""}
                                    required
                                    autoComplete="name"
                                    aria-invalid={hasError(state, "fullName")}
                                    className={hasError(state, "fullName") ? "border-destructive focus-visible:ring-destructive" : undefined}
                                />
                                <FieldError state={state} name="fullName" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="email">{dict.contactForm.fields.email.label}</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={dict.contactForm.fields.email.placeholder}
                                    defaultValue={state.values.email ?? ""}
                                    required
                                    autoComplete="email"
                                    aria-invalid={hasError(state, "email")}
                                    className={hasError(state, "email") ? "border-destructive focus-visible:ring-destructive" : undefined}
                                />
                                <FieldError state={state} name="email" />
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="phone">{dict.contactForm.fields.phone.label}</FieldLabel>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder={dict.contactForm.fields.phone.placeholder}
                                    defaultValue={state.values.phone ?? ""}
                                    autoComplete="tel"
                                    aria-invalid={hasError(state, "phone")}
                                    className={hasError(state, "phone") ? "border-destructive focus-visible:ring-destructive" : undefined}
                                />
                                <FieldError state={state} name="phone" />
                            </Field>

                            <Field>
                                <FieldLabel>{dict.contactForm.fields.country.label}</FieldLabel>
                                <input type="hidden" name="country" value={country} />
                                <Select value={country} onValueChange={setCountry}>
                                    <SelectTrigger
                                        id="country"
                                        aria-invalid={hasError(state, "country")}
                                        className={hasError(state, "country") ? "border-destructive focus:ring-destructive" : undefined}
                                    >
                                        <SelectValue placeholder={dict.contactForm.fields.country.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {countries.map((c) => (
                                                <SelectItem key={c} value={c}>
                                                    {c}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError state={state} name="country" />
                            </Field>

                            <Field>
                                <FieldLabel>{dict.contactForm.fields.topic.label}</FieldLabel>
                                <input type="hidden" name="interest" value={interest} />
                                <Combobox items={interests} value={interest} onValueChange={(v) => setInterest(v ?? "")}>
                                    <ComboboxInput
                                        placeholder={dict.contactForm.fields.topic.placeholder}
                                        aria-invalid={hasError(state, "interest")}
                                        className={hasError(state, "interest") ? "border-destructive focus-visible:ring-destructive" : undefined}
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>{dict.contactForm.fields.topic.empty}</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item} value={item}>
                                                    {item}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FieldError state={state} name="interest" />
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel htmlFor="message">{dict.contactForm.fields.message.label}</FieldLabel>
                            <Textarea
                                id="message"
                                name="message"
                                placeholder={dict.contactForm.fields.message.placeholder}
                                defaultValue={state.values.message ?? ""}
                                required
                                rows={6}
                                aria-invalid={hasError(state, "message")}
                                className={hasError(state, "message") ? "border-destructive focus-visible:ring-destructive" : undefined}
                            />
                            <FieldError state={state} name="message" />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel>{dict.contactForm.fields.contactPreference.label}</FieldLabel>
                                <input type="hidden" name="contactPreference" value={contactPreference} />
                                <Select value={contactPreference} onValueChange={(v) => setContactPreference(asContactPreference(v))}>
                                    <SelectTrigger
                                        aria-invalid={hasError(state, "contactPreference")}
                                        className={hasError(state, "contactPreference") ? "border-destructive focus:ring-destructive" : undefined}
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="email">{dict.contactForm.fields.contactPreference.email}</SelectItem>
                                            <SelectItem value="phone">{dict.contactForm.fields.contactPreference.phone}</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError state={state} name="contactPreference" />
                            </Field>

                            <Field>
                                <FieldLabel className={hasError(state, "consent") ? "text-destructive" : "text-foreground"}>
                  <span className="flex items-center gap-2">
                    <input type="checkbox" name="consent" defaultChecked={state.values.consent === "on"} />
                      {dict.contactForm.fields.consent.label}
                  </span>
                                </FieldLabel>
                                <FieldError state={state} name="consent" />
                            </Field>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={pending}>
                                {pending ? dict.contactForm.actions.submitting : dict.contactForm.actions.submit}
                            </Button>
                            <Button type="reset" variant="outline" disabled={pending}>
                                {dict.contactForm.actions.clear}
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
