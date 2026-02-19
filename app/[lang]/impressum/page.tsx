import {notFound} from "next/navigation";
import {hasLocale} from "../dictionaries";

export default async function Page({params}: PageProps<'/[lang]/impressum'>) {
    const {lang} = await params;
    if (!hasLocale(lang)) notFound();

    return (
        <article className="mx-auto max-w-3xl space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Impressum</h1>

            <section className="space-y-3 text-sm leading-relaxed">
                <p>
                    Maximilian Henning Fanslau
                    <br/>
                    Ginsterweg 22
                    <br/>
                    40822 Mettmann
                    <br/>
                    Gebundener Versicherungsvertreter gemaess § 34d Abs. 7 GewO

                </p>

                <p>
                    Taetig im Auftrag der
                    <br/>
                    die Bayerische
                    <br/>
                    und
                    <br/>
                    compexx Finanz AG
                </p>
            </section>

            <section className="space-y-2 text-sm leading-relaxed">
                <h2 className="text-xl font-semibold">Kontakt</h2>
                <p>
                    Telefon: +49 171 3422274
                    <br/>
                    E-Mail: info@finanzlau.de
                </p>
            </section>

            <section className="space-y-2 text-sm leading-relaxed">
                <h2 className="text-xl font-semibold">
                    Vermittlerregister (
                    <a
                        href="https://www.vermittlerregister.info"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        www.vermittlerregister.info
                    </a>
                    )
                </h2>
                <p>Registrierungs-Nr.: D-OHVQ-HHOI5-12</p>
            </section>

            <section className="space-y-3 text-sm leading-relaxed">
                <h2 className="text-xl font-semibold">Berufsbezeichnung und berufsrechtliche Regelungen</h2>

                <p>
                    Berufsbezeichnung:
                    <br/>
                    Selbststaendiger Handelsvertreter
                </p>

                <p>
                    Zustaendige Kammer:
                    <br/>
                    Industrie- und Handelskammer zu Duesseldorf
                    <br/>
                    Ernst-Schneider-Platz 1
                    <br/>
                    40212 Duesseldorf
                </p>

                <p>
                    Verliehen in:
                    <br/>
                    Deutschland
                </p>

                <p>
                    Es gelten folgende berufsrechtliche Regelungen:
                    <br/>§ 34d Gewerbeordnung (GewO) Versicherungsvermittlungsverordnung (VersVermV)
                    Versicherungsvertragsgesetz (VVG)
                    <br/>
                    einsehbar unter:{" "}
                    <a
                        href="http://www.gesetze-im-internet.de"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                    >
                        http://www.gesetze-im-internet.de
                    </a>
                </p>
            </section>

            <section className="space-y-2 text-sm leading-relaxed">
                <h2 className="text-xl font-semibold">Angaben zur Berufshaftpflichtversicherung</h2>
                <p>
                    <strong>Name und Sitz des Versicherers:</strong>
                </p>
                <p>
                    Die Bayrische
                    <br/>
                    Thomas-Dehler-Straße 25
                    <br/>
                    81737 München
                </p>
            </section>
        </article>
    );
}
