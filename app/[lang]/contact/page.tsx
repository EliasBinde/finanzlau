import {notFound} from "next/navigation";
import {getDictionary, hasLocale} from "../dictionaries";
import {ContactForm} from "@/components/contact-form";
import {AppointmentSlots} from "@/components/appointment-slots";

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-current">
            <path
                d="M12.04 2A10 10 0 0 0 3.4 17.06L2 22l5.06-1.33A10 10 0 1 0 12.04 2Zm0 18.5a8.47 8.47 0 0 1-4.32-1.18l-.31-.18-2.89.76.77-2.82-.2-.32a8.5 8.5 0 1 1 6.95 3.74Zm4.95-6.45c-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.14-.17.27-.69.86-.84 1.03-.16.18-.31.2-.58.07a6.87 6.87 0 0 1-2.02-1.25 7.48 7.48 0 0 1-1.4-1.73c-.15-.27-.02-.41.11-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.6-1.45-.82-1.99-.22-.52-.44-.45-.6-.46h-.5c-.18 0-.46.07-.7.34-.25.27-.95.92-.95 2.23 0 1.31.97 2.58 1.1 2.76.14.18 1.87 2.85 4.52 4 .63.28 1.13.44 1.52.56.64.2 1.22.17 1.68.1.52-.08 1.58-.65 1.8-1.27.23-.63.23-1.17.16-1.28-.07-.11-.24-.18-.51-.32Z"/>
        </svg>
    );
}

export default async function Page({params}: PageProps<'/[lang]/contact'>) {
    const {lang} = await params;

    if (!hasLocale(lang)) notFound();

    const {dict, lang: locale} = await getDictionary(lang);

    return (
        <div className="space-y-8">
            <section className="rounded-xl border border-primary/30 bg-primary/5 p-4 md:p-5">
                <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                            {dict.contactPage.whatsappCta.badge}
                        </p>
                        <h2 className="text-xl font-bold md:text-2xl">
                            {dict.contactPage.whatsappCta.title}
                        </h2>
                    </div>
                    <a
                        href="https://wa.me/491713422274"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-base font-semibold text-white shadow-md transition-colors hover:bg-[#1ebe5d]"
                    >
                        <WhatsAppIcon/>
                        <span>{dict.contactPage.whatsappCta.button}</span>
                    </a>
                </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
                <ContactForm dict={dict} lang={locale}/>
                <AppointmentSlots dict={dict} lang={lang}/>
            </div>
        </div>
    );
}
