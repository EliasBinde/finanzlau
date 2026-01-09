"use client";

import * as React from "react";
import { format } from "date-fns";
import { de, enUS } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Dictionary } from "@/app/[lang]/dictionaries";

type Slot = {
    startUtc: string;
    endUtc: string;
    startLocal: string;
    endLocal: string;
    available: boolean;
};

type Props = {
    dict: Dictionary;
    lang: "de" | "en";
    open: boolean;
    onOpenChangeAction: (open: boolean) => void;
    slot: Slot | null;
    onBookedAction?: () => void;
};

type BookState =
    | { status: "idle"; message: string }
    | { status: "submitting"; message: string }
    | { status: "success"; message: string }
    | { status: "error"; message: string };

function interpolate(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
}

function formatSlotLabel(slot: Slot, lang: "de" | "en"): string {
    const date = new Date(slot.startLocal);
    const locale = lang === "de" ? de : enUS;
    const day = format(date, "EEEE, dd.MM.yyyy", { locale });
    const start = slot.startLocal.slice(11, 16);
    const end = slot.endLocal.slice(11, 16);
    return `${day} · ${start}–${end}`;
}

function getString(formData: FormData, key: string): string {
    const v = formData.get(key);
    return typeof v === "string" ? v.trim() : "";
}

export function AppointmentBookingModal({ dict, lang, open, onOpenChangeAction, slot, onBookedAction }: Props) {
    const t = dict.appointmentBookingModal;

    const [state, setState] = React.useState<BookState>({ status: "idle", message: "" });

    const close = React.useCallback(() => {
        onOpenChangeAction(false);
    }, [onOpenChangeAction]);

    React.useEffect(() => {
        if (open) setState({ status: "idle", message: "" });
    }, [open]);

    const onSubmit = React.useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!slot) return;

            const formData = new FormData(e.currentTarget);

            const name = getString(formData, "name");
            const email = getString(formData, "email");
            const phone = getString(formData, "phone");
            const message = getString(formData, "message");

            if (name.length < 2 || email.length < 3) {
                setState({ status: "error", message: t.status.validationError });
                return;
            }

            setState({ status: "submitting", message: "" });

            let res: Response;
            try {
                res = await fetch("/api/book", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({
                        startUtc: slot.startUtc,
                        endUtc: slot.endUtc,
                        name,
                        email,
                        phone: phone || undefined,
                        message: message || undefined,
                    }),
                });
            } catch {
                setState({ status: "error", message: t.status.bookingFailedFallback });
                return;
            }

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as { message?: string } | null;
                setState({
                    status: "error",
                    message: data?.message ?? t.status.bookingFailedFallback,
                });
                return;
            }

            setState({ status: "success", message: t.status.success });
            onBookedAction?.();
        },
        [slot, onBookedAction, t.status.bookingFailedFallback, t.status.success, t.status.validationError]
    );

    const slotLabel = slot ? formatSlotLabel(slot, lang) : "";

    return (
        <Dialog open={open} onOpenChange={onOpenChangeAction}>
            <DialogContent aria-label={t.dialogAriaLabel}>
                <DialogHeader>
                    <DialogTitle>{t.title}</DialogTitle>
                    <DialogDescription>
                        {slot ? (
                            <span aria-live="polite">{interpolate(t.description.withSlot, { slotLabel })}</span>
                        ) : (
                            <span aria-live="polite">{t.description.noSlot}</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {state.message ? (
                    <p
                        className={state.status === "success" ? "text-sm text-green-700" : "text-sm text-destructive"}
                        role={state.status === "success" ? "status" : "alert"}
                        aria-live="polite"
                    >
                        {state.message}
                    </p>
                ) : null}

                <form onSubmit={onSubmit} className="space-y-4" aria-label={t.form.ariaLabel}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="booking-name">
                            {t.form.fields.name.label}
                        </label>
                        <Input id="booking-name" name="name" autoComplete="name" required disabled={state.status === "submitting"} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="booking-email">
                            {t.form.fields.email.label}
                        </label>
                        <Input
                            id="booking-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            disabled={state.status === "submitting"}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="booking-phone">
                            {t.form.fields.phone.label}
                        </label>
                        <Input id="booking-phone" name="phone" autoComplete="tel" disabled={state.status === "submitting"} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="booking-message">
                            {t.form.fields.message.label}
                        </label>
                        <Textarea id="booking-message" name="message" rows={4} disabled={state.status === "submitting"} />
                    </div>

                    <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" onClick={close} disabled={state.status === "submitting"}>
                            {state.status === "success" ? t.actions.close : t.actions.cancel}
                        </Button>

                        <Button type="submit" disabled={!slot || state.status === "submitting" || state.status === "success"}>
                            {state.status === "submitting"
                                ? t.actions.booking
                                : state.status === "success"
                                    ? t.actions.booked
                                    : t.actions.confirm}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}