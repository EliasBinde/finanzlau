import { notFound } from "next/navigation";
import {getDictionary, hasLocale} from "../dictionaries";
import { ContactForm } from "@/components/contact-form";
import { AppointmentSlots } from "@/components/appointment-slots";

export default async function Page({ params }: PageProps<'/[lang]/contact'>) {
    const { lang } = await params;

    if (!hasLocale(lang)) notFound();

    const { dict, lang: locale } = await getDictionary(lang);

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <ContactForm dict={dict} lang={locale} />
            <AppointmentSlots dict={dict} lang={lang} />
        </div>
    );
}
