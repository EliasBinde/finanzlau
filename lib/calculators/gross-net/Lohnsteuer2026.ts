/* eslint-disable @typescript-eslint/no-explicit-any */
// AUTO-GENERATED from PAP XML (normalized JSON)
// This file is generated; edits may be overwritten.

import DecimalJs from "decimal.js";

export type Decimal = DecimalJs;

// Callable wrapper so normalized expressions like Decimal(0) keep working
export const Decimal = Object.assign(
    (x: DecimalJs.Value) => new DecimalJs(x),
    {
        ROUND_DOWN: DecimalJs.ROUND_DOWN as DecimalJs.Rounding,
        ROUND_UP: DecimalJs.ROUND_UP as DecimalJs.Rounding,
    }
) as ((x: DecimalJs.Value) => DecimalJs) & { ROUND_DOWN: DecimalJs.Rounding; ROUND_UP: DecimalJs.Rounding };

function at<T>(arr: readonly T[], idx: number): T {
    const v = arr[idx];
    if (v === undefined) throw new Error(`Table index out of range: ${idx}`);
    return v;
}

export type PapInputs = {
    /**
     * 1, wenn die Anwendung des Faktorverfahrens gewählt wurden (nur in Steuerklasse IV)
     */
    useFactorMethod: number;
    /**
     * Auf die Vollendung des 64. Lebensjahres folgende Kalenderjahr (erforderlich, wenn ALTER1=1)
     */
    ageReliefYear: number;
    /**
     * 1, wenn das 64. Lebensjahr zu Beginn des Kalenderjahres vollendet wurde, in dem der Lohnzahlungszeitraum endet (§ 24 a EStG), sonst = 0
     */
    isAgeReliefEligible: number;
    /**
     * Merker für die Vorsorgepauschale 0 = der Arbeitnehmer ist in der Arbeitslosenversicherung pflichtversichert; es gilt die allgemeine Beitragsbemessungsgrenze 1 = wenn nicht 0
     */
    noUnemploymentInsurance: number;
    /**
     * eingetragener Faktor mit drei Nachkommastellen
     */
    taxFactor: number;
    /**
     * Jahresfreibetrag für die Ermittlung der Lohnsteuer für die sonstigen Bezüge sowie für Vermögensbeteiligungen nach § 19a Absatz 1 und 4 EStG nach Maßgabe der elektronischen Lohnsteuerabzugsmerkmale nach § 39e EStG oder der Eintragung auf der Bescheinigung für den Lohnsteuerabzug 2026 in Cent (ggf. 0)
     */
    annualAllowanceCents: Decimal;
    /**
     * Jahreshinzurechnungsbetrag für die Ermittlung der Lohnsteuer für die sonstigen Bezüge sowie für Vermögensbeteiligungen nach § 19a Absatz 1 und 4 EStG nach Maßgabe der elektronischen Lohnsteuerabzugsmerkmale nach § 39e EStG oder der Eintragung auf der Bescheinigung für den Lohnsteuerabzug 2026 in Cent (ggf. 0)
     */
    annualAddbackCents: Decimal;
    /**
     * Voraussichtlicher Jahresarbeitslohn ohne sonstige Bezüge (d.h. auch ohne die zu besteuernden Vorteile bei Vermögensbeteiligungen, § 19a Absatz 4 EStG) in Cent. Anmerkung: Die Eingabe dieses Feldes (ggf. 0) ist erforderlich bei Eingaben zu sonstigen Bezügen (Feld SONSTB). Sind in einem vorangegangenen Abrechnungszeitraum bereits sonstige Bezüge gezahlt worden, so sind sie dem voraussichtlichen Jahresarbeitslohn hinzuzurechnen. Gleiches gilt für zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG).
     */
    annualGrossCents: Decimal;
    /**
     * In JRE4 enthaltene Entschädigungen nach § 24 Nummer 1 EStG und zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG) in Cent
     */
    annualCompCents: Decimal;
    /**
     * In JRE4 enthaltene Versorgungsbezüge in Cent (ggf. 0)
     */
    annualPensionCents: Decimal;
    /**
     * Merker für die Vorsorgepauschale 0 = der Arbeitnehmer ist in der gesetzlichen Rentenversicherung oder einer berufsständischen Versorgungseinrichtung pflichtversichert oder bei Befreiung von der Versicherungspflicht freiwillig versichert; es gilt die allgemeine Beitragsbemessungsgrenze 1 = wenn nicht 0
     */
    noPublicPensionInsurance: number;
    /**
     * Kassenindividueller Zusatzbeitragssatz bei einem gesetzlich krankenversicherten Arbeitnehmer in Prozent (bspw. 2,50 für 2,50 %) mit 2 Dezimalstellen. Es ist der volle Zusatzbeitragssatz anzugeben. Die Aufteilung in Arbeitnehmer- und Arbeitgeber- anteil erfolgt im Programmablauf.
     */
    healthAddOnRatePct: Decimal;
    /**
     * Lohnzahlungszeitraum: 1 = Jahr 2 = Monat 3 = Woche 4 = Tag
     */
    payPeriod: number;
    /**
     * Der als elektronisches Lohnsteuerabzugsmerkmal für den Arbeitgeber nach § 39e EStG festgestellte oder in der Bescheinigung für den Lohnsteuerabzug 2026 eingetragene Freibetrag für den Lohnzahlungszeitraum in Cent
     */
    allowanceCents: Decimal;
    /**
     * Der als elektronisches Lohnsteuerabzugsmerkmal für den Arbeitgeber nach § 39e EStG festgestellte oder in der Bescheinigung für den Lohnsteuerabzug 2026 eingetragene Hinzurechnungsbetrag für den Lohnzahlungszeitraum in Cent
     */
    addbackCents: Decimal;
    /**
     * Nicht zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) in Cent
     */
    nonTaxableEquityBenefitsCents: Decimal;
    /**
     * Dem Arbeitgeber mitgeteilte Beiträge des Arbeitnehmers für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Cent; der Wert ist unabhängig vom Lohnzahlungszeitraum immer als Monatsbetrag anzugeben
     */
    privateHealthEmployeeMonthlyCents: Decimal;
    /**
     * Arbeitgeberzuschuss für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Cent; der Wert ist unabhängig vom Lohnzahlungszeitraum immer als Monatsbetrag anzugeben
     */
    privateHealthEmployerMonthlyCents: Decimal;
    /**
     * Krankenversicherung: 0 = gesetzlich krankenversicherte Arbeitnehmer 1 = ausschließlich privat krankenversicherte Arbeitnehmer
     */
    isPrivateHealthInsured: number;
    /**
     * Zahl der beim Arbeitnehmer zu berücksichtigenden Beitragsabschläge in der sozialen Pflegeversicherung bei mehr als einem Kind 0 = kein Abschlag 1 = Beitragsabschlag für das 2. Kind 2 = Beitragsabschläge für das 2. und 3. Kind 3 = Beitragsabschläge für 2. bis 4. Kinder 4 = Beitragsabschläge für 2. bis 5. oder mehr Kinder
     */
    careDiscountChildren: Decimal;
    /**
     * 1, wenn bei der sozialen Pflegeversicherung die Besonderheiten in Sachsen zu berücksichtigen sind bzw. zu berücksichtigen wären
     */
    isSaxonyCareRules: number;
    /**
     * 1, wenn er der Arbeitnehmer den Zuschlag zur sozialen Pflegeversicherung zu zahlen hat
     */
    isChildlessCareSurcharge: number;
    /**
     * Religionsgemeinschaft des Arbeitnehmers lt. elektronischer Lohnsteuerabzugsmerkmale oder der Bescheinigung für den Lohnsteuerabzug 2026 (bei keiner Religionszugehörigkeit = 0)
     */
    religionCode: number;
    /**
     * Steuerpflichtiger Arbeitslohn für den Lohnzahlungszeitraum vor Berücksichtigung des Versorgungsfreibetrags und des Zuschlags zum Versorgungsfreibetrag, des Altersentlastungsbetrags und des als elektronisches Lohnsteuerabzugsmerkmal festgestellten oder in der Bescheinigung für den Lohnsteuerabzug 2026 für den Lohnzahlungszeitraum eingetragenen Freibetrags bzw. Hinzurechnungsbetrags in Cent
     */
    grossWageCents: Decimal;
    /**
     * Sonstige Bezüge einschließlich zu besteuernde Vorteile bei Vermögensbeteiligungen und Sterbegeld bei Versorgungsbezügen sowie Kapitalauszahlungen/Abfindungen, in Cent (ggf. 0)
     */
    oneTimePayCents: Decimal;
    /**
     * In SONSTB enthaltene Entschädigungen nach § 24 Nummer 1 EStG sowie zu besteuernde Vorteile bei Vermögensbeteiligungen (§ 19a Absatz 4 EStG), in Cent
     */
    oneTimeCompCents: Decimal;
    /**
     * Sterbegeld bei Versorgungsbezügen sowie Kapitalauszahlungen/Abfindungen (in SONSTB enthalten), in Cent
     */
    deathBenefitCents: Decimal;
    /**
     * Steuerklasse: 1 = I 2 = II 3 = III 4 = IV 5 = V 6 = VI
     */
    taxClass: number;
    /**
     * In RE4 enthaltene Versorgungsbezüge in Cent (ggf. 0) ggf. unter Berücksichtigung einer geänderten Bemessungsgrundlage nach § 19 Absatz 2 Satz 10 und 11 EStG
     */
    pensionWageCents: Decimal;
    /**
     * Versorgungsbezug im Januar 2005 bzw. für den ersten vollen Monat, wenn der Versorgungsbezug erstmalig nach Januar 2005 gewährt wurde, in Cent
     */
    pensionJan2005Cents: Decimal;
    /**
     * Voraussichtliche Sonderzahlungen von Versorgungsbezügen im Kalenderjahr des Versorgungsbeginns bei Versorgungsempfängern ohne Sterbegeld, Kapitalauszahlungen/Abfindungen in Cent
     */
    pensionSpecialPayCents: Decimal;
    /**
     * In SONSTB enthaltene Versorgungsbezüge einschließlich Sterbegeld in Cent (ggf. 0)
     */
    oneTimePensionCents: Decimal;
    /**
     * Jahr, in dem der Versorgungsbezug erstmalig gewährt wurde; werden mehrere Versorgungsbezüge gezahlt, wird aus Vereinfachungsgründen für die Berechnung das Jahr des ältesten erstmaligen Bezugs herangezogen; auf die Möglichkeit der getrennten Abrechnung verschiedenartiger Bezüge (§ 39e Absatz 5a EStG) wird im Übrigen verwiesen
     */
    pensionStartYear: number;
    /**
     * Zahl der Freibeträge für Kinder (eine Dezimalstelle, nur bei Steuerklassen I, II, III und IV)
     */
    childAllowance: Decimal;
    /**
     * Zahl der Monate, für die Versorgungsbezüge gezahlt werden [nur erforderlich bei Jahresberechnung (LZZ = 1)]
     */
    pensionMonthsPaid: number;
};

export type PapOutputs_STANDARD = {
    /**
     * Bemessungsgrundlage für die Kirchenlohnsteuer in Cent
     */
    churchTaxBaseCents: Decimal;
    /**
     * Bemessungsgrundlage der sonstigen Bezüge für die Kirchenlohnsteuer in Cent. Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern BK (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    oneTimeChurchTaxBaseCents: Decimal;
    /**
     * Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cent
     */
    wageTaxCents: Decimal;
    /**
     * Für den Lohnzahlungszeitraum einzubehaltender Solidaritätszuschlag in Cent
     */
    solidaritySurchargeCents: Decimal;
    /**
     * Solidaritätszuschlag für sonstige Bezüge in Cent. Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern SOLZLZZ (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    oneTimeSolidaritySurchargeCents: Decimal;
    /**
     * Lohnsteuer für sonstige Bezüge in Cent Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern LSTLZZ (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    oneTimeWageTaxCents: Decimal;
};

export type PapOutputs_DBA = {
    /**
     * Verbrauchter Freibetrag bei Berechnung des laufenden Arbeitslohns, in Cent
     */
    usedAllowanceCurrentCents: Decimal;
    /**
     * Verbrauchter Freibetrag bei Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent
     */
    usedAllowanceAnnualCents: Decimal;
    /**
     * Verbrauchter Freibetrag bei Berechnung der sonstigen Bezüge, in Cent
     */
    usedAllowanceOneTimeCents: Decimal;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des laufenden Arbeitslohns, in Cent
     */
    availableZveOverBasicAllowanceCurrentCents: Decimal;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent
     */
    availableZveOverBasicAllowanceAnnualCents: Decimal;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung der sonstigen Bezüge, in Cent
     */
    availableZveOverBasicAllowanceOneTimeCents: Decimal;
};

export type PapOutputs = {
    STANDARD: PapOutputs_STANDARD;
    DBA: PapOutputs_DBA;
};

type Internals = {
    /**
     * Altersentlastungsbetrag in Euro, Cent (2 Dezimalstellen)
     */
    ALTE: Decimal;
    /**
     * Arbeitnehmer-Pauschbetrag/Werbungskosten-Pauschbetrag in Euro
     */
    ANP: Decimal;
    /**
     * Auf den Lohnzahlungszeitraum entfallender Anteil von Jahreswerten auf ganze Cent abgerundet
     */
    ANTEIL1: Decimal;
    /**
     * Beitragssatz des Arbeitnehmers zur Arbeitslosenversicherung (4 Dezimalstellen)
     */
    AVSATZAN: Decimal;
    /**
     * Beitragsbemessungsgrenze in der gesetzlichen Krankenversicherung und der sozialen Pflegeversicherung in Euro
     */
    BBGKVPV: Decimal;
    /**
     * Allgemeine Beitragsbemessungsgrenze in der allgemeinen Rentenversicherung und Arbeitslosenversicherung in Euro
     */
    BBGRVALV: Decimal;
    /**
     * Bemessungsgrundlage für Altersentlastungsbetrag in Euro, Cent (2 Dezimalstellen)
     */
    BMG: Decimal;
    /**
     * Differenz zwischen ST1 und ST2 in Euro
     */
    DIFF: Decimal;
    /**
     * Entlastungsbetrag für Alleinerziehende in Euro
     */
    EFA: Decimal;
    /**
     * Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
     */
    FVB: Decimal;
    /**
     * Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen) für die Berechnung der Lohnsteuer beim sonstigen Bezug
     */
    FVBSO: Decimal;
    /**
     * Zuschlag zum Versorgungsfreibetrag in Euro
     */
    FVBZ: Decimal;
    /**
     * Zuschlag zum Versorgungsfreibetrag in Euro für die Berechnung der Lohnsteuer beim sonstigen Bezug
     */
    FVBZSO: Decimal;
    /**
     * Grundfreibetrag in Euro
     */
    GFB: Decimal;
    /**
     * Maximaler Altersentlastungsbetrag in Euro
     */
    HBALTE: Decimal;
    /**
     * Maßgeblicher maximaler Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
     */
    HFVB: Decimal;
    /**
     * Maßgeblicher maximaler Zuschlag zum Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen)
     */
    HFVBZ: Decimal;
    /**
     * Maßgeblicher maximaler Zuschlag zum Versorgungsfreibetrag in Euro, Cent (2 Dezimalstellen) für die Berechnung der Lohnsteuer für den sonstigen Bezug
     */
    HFVBZSO: Decimal;
    /**
     * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
     */
    HOCH: Decimal;
    /**
     * Nummer der Tabellenwerte für Versorgungsparameter
     */
    J: number;
    /**
     * Jahressteuer nach § 51a EStG, aus der Solidaritätszuschlag und Bemessungsgrundlage für die Kirchenlohnsteuer ermittelt werden in Euro
     */
    JBMG: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechneter LZZFREIB in Euro, Cent (2 Dezimalstellen)
     */
    JLFREIB: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechnete LZZHINZU in Euro, Cent (2 Dezimalstellen)
     */
    JLHINZU: Decimal;
    /**
     * Jahreswert, dessen Anteil für einen Lohnzahlungszeitraum in UPANTEIL errechnet werden soll in Cent
     */
    JW: Decimal;
    /**
     * Nummer der Tabellenwerte für Parameter bei Altersentlastungsbetrag
     */
    K: number;
    /**
     * Summe der Freibeträge für Kinder in Euro
     */
    KFB: Decimal;
    /**
     * Beitragssatz des Arbeitnehmers zur Krankenversicherung (5 Dezimalstellen)
     */
    KVSATZAN: Decimal;
    /**
     * Kennzahl für die Einkommensteuer-Tabellenart: 1 = Grundtarif 2 = Splittingverfahren
     */
    KZTAB: number;
    /**
     * Jahreslohnsteuer in Euro
     */
    LSTJAHR: Decimal;
    /**
     * Zwischenfelder der Jahreslohnsteuer in Cent
     */
    LSTOSO: Decimal;
    LSTSO: Decimal;
    /**
     * Mindeststeuer für die Steuerklassen V und VI in Euro
     */
    MIST: Decimal;
    /**
     * Auf einen Jahreswert hochgerechneter Arbeitgeberzuschuss für eine private Basiskranken- bzw. Pflege-Pflichtversicherung im Sinne des § 10 Absatz 1 Nummer 3 EStG in Euro, Cent (2 Dezimalstellen)
     */
    PKPVAGZJ: Decimal;
    /**
     * Beitragssatz des Arbeitnehmers zur Pflegeversicherung (6 Dezimalstellen)
     */
    PVSATZAN: Decimal;
    /**
     * Beitragssatz des Arbeitnehmers in der allgemeinen gesetzlichen Rentenversicherung (4 Dezimalstellen)
     */
    RVSATZAN: Decimal;
    /**
     * Rechenwert in Gleitkommadarstellung
     */
    RW: Decimal;
    /**
     * Sonderausgaben-Pauschbetrag in Euro
     */
    SAP: Decimal;
    /**
     * Freigrenze für den Solidaritätszuschlag in Euro
     */
    SOLZFREI: Decimal;
    /**
     * Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent (2 Dezimalstellen)
     */
    SOLZJ: Decimal;
    /**
     * Zwischenwert für den Solidaritätszuschlag auf die Jahreslohnsteuer in Euro, Cent (2 Dezimalstellen)
     */
    SOLZMIN: Decimal;
    /**
     * Bemessungsgrundlage des Solidaritätszuschlags zur Prüfung der Freigrenze beim Solidaritätszuschlag für sonstige Bezüge in Euro
     */
    SOLZSBMG: Decimal;
    /**
     * Zu versteuerndes Einkommen für die Ermittlung der Bemessungsgrundlage des Solidaritätszuschlags zur Prüfung der Freigrenze beim Solidaritätszuschlag für sonstige Bezüge in Euro, Cent (2 Dezimalstellen)
     */
    SOLZSZVE: Decimal;
    /**
     * Tarifliche Einkommensteuer in Euro
     */
    ST: Decimal;
    /**
     * Tarifliche Einkommensteuer auf das 1,25-fache ZX in Euro
     */
    ST1: Decimal;
    /**
     * Tarifliche Einkommensteuer auf das 0,75-fache ZX in Euro
     */
    ST2: Decimal;
    /**
     * Bemessungsgrundlage für den Versorgungsfreibetrag in Cent
     */
    VBEZB: Decimal;
    /**
     * Bemessungsgrundlage für den Versorgungsfreibetrag in Cent für den sonstigen Bezug
     */
    VBEZBSO: Decimal;
    /**
     * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
     */
    VERGL: Decimal;
    /**
     * Auf den Höchstbetrag begrenzte Beiträge zur Arbeitslosenversicherung einschließlich Kranken- und Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
     */
    VSPHB: Decimal;
    /**
     * Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung sowie die gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung und private Pflege-Pflichtversicherung in Euro, Cent (2 Dezimalstellen)
     */
    VSP: Decimal;
    /**
     * Vorsorgepauschale mit Teilbeträgen für die Rentenversicherung sowie auf den Höchstbetrag begrenzten Teilbeträgen für die Arbeitslosen-, Kranken- und Pflegeversicherung in Euro, Cent (2 Dezimalstellen)
     */
    VSPN: Decimal;
    /**
     * Teilbetrag für die Arbeitslosenversicherung bei der Berechnung der Vorsorgepauschale in Euro, Cent (2 Dezimalstellen)
     */
    VSPALV: Decimal;
    /**
     * Vorsorgepauschale mit Teilbeträgen für die gesetzliche Kranken- und soziale Pflegeversicherung nach fiktiven Beträgen oder ggf. für die private Basiskrankenversicherung und private Pflege-Pflichtversicherung in Euro, Cent (2 Dezimalstellen)
     */
    VSPKVPV: Decimal;
    /**
     * Teilbetrag für die Rentenversicherung bei der Berechnung der Vorsorgepauschale in Euro, Cent (2 Dezimalstellen)
     */
    VSPR: Decimal;
    /**
     * Erster Grenzwert in Steuerklasse V/VI in Euro
     */
    W1STKL5: Decimal;
    /**
     * Zweiter Grenzwert in Steuerklasse V/VI in Euro
     */
    W2STKL5: Decimal;
    /**
     * Dritter Grenzwert in Steuerklasse V/VI in Euro
     */
    W3STKL5: Decimal;
    /**
     * Zu versteuerndes Einkommen gem. § 32a Absatz 1 und 5 EStG in Euro, Cent (2 Dezimalstellen)
     */
    X: Decimal;
    /**
     * Gem. § 32a Absatz 1 EStG (6 Dezimalstellen)
     */
    Y: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent (2 Dezimalstellen) nach Abzug der Freibeträge nach § 39 b Absatz 2 Satz 3 und 4 EStG
     */
    ZRE4: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechnetes RE4 in Euro, Cent (2 Dezimalstellen)
     */
    ZRE4J: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechnetes RE4, ggf. nach Abzug der Entschädigungen i.S.d. § 24 Nummer 1 EStG in Euro, Cent (2 Dezimalstellen)
     */
    ZRE4VP: Decimal;
    /**
     * Zwischenfeld zu ZRE4VP für die Begrenzung auf die jeweilige Beitragsbemessungsgrenze in Euro, Cent (2 Dezimalstellen)
     */
    ZRE4VPR: Decimal;
    /**
     * Feste Tabellenfreibeträge (ohne Vorsorgepauschale) in Euro, Cent (2 Dezimalstellen)
     */
    ZTABFB: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechnetes VBEZ abzüglich FVB in Euro, Cent (2 Dezimalstellen)
     */
    ZVBEZ: Decimal;
    /**
     * Auf einen Jahreslohn hochgerechnetes VBEZ in Euro, Cent (2 Dezimalstellen)
     */
    ZVBEZJ: Decimal;
    /**
     * Zu versteuerndes Einkommen in Euro, Cent (2 Dezimalstellen)
     */
    ZVE: Decimal;
    /**
     * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
     */
    ZX: Decimal;
    /**
     * Zwischenfeld zu X für die Berechnung der Steuer nach § 39b Absatz 2 Satz 7 EStG in Euro
     */
    ZZX: Decimal;
};

type Constants = {
    /**
     * Tabelle für die Prozentsätze des Versorgungsfreibetrags
     */
    TAB1: Decimal[];
    /**
     * Tabelle für die Höchstbeträge des Versorgungsfreibetrags
     */
    TAB2: Decimal[];
    /**
     * Tabelle für die Zuschläge zum Versorgungsfreibetrag
     */
    TAB3: Decimal[];
    /**
     * Tabelle für die Höchstbeträge des Altersentlastungsbetrags
     */
    TAB4: Decimal[];
    /**
     * Tabelle fuer die Hächstbeträge des Altersentlastungsbetrags
     */
    TAB5: Decimal[];
    /**
     * Zahlenkonstanten fuer im Plan oft genutzte BigDecimal Werte
     */
    ZAHL1: Decimal;
    ZAHL2: Decimal;
    ZAHL5: Decimal;
    ZAHL7: Decimal;
    ZAHL12: Decimal;
    ZAHL100: Decimal;
    ZAHL360: Decimal;
    ZAHL500: Decimal;
    ZAHL700: Decimal;
    ZAHL1000: Decimal;
    ZAHL10000: Decimal;
};

type FlatOutputs = {
    /**
     * Bemessungsgrundlage für die Kirchenlohnsteuer in Cent
     */
    BK: Decimal;
    /**
     * Bemessungsgrundlage der sonstigen Bezüge für die Kirchenlohnsteuer in Cent. Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern BK (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    BKS: Decimal;
    /**
     * Für den Lohnzahlungszeitraum einzubehaltende Lohnsteuer in Cent
     */
    LSTLZZ: Decimal;
    /**
     * Für den Lohnzahlungszeitraum einzubehaltender Solidaritätszuschlag in Cent
     */
    SOLZLZZ: Decimal;
    /**
     * Solidaritätszuschlag für sonstige Bezüge in Cent. Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern SOLZLZZ (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    SOLZS: Decimal;
    /**
     * Lohnsteuer für sonstige Bezüge in Cent Hinweis: Negativbeträge, die aus nicht zu besteuernden Vorteilen bei Vermögensbeteiligungen (§ 19a Absatz 1 Satz 4 EStG) resultieren, mindern LSTLZZ (maximal bis 0). Der Sonderausgabenabzug für tatsächlich erbrachte Vorsorgeaufwendungen im Rahmen der Veranlagung zur Einkommensteuer bleibt unberührt.
     */
    STS: Decimal;
    /**
     * Verbrauchter Freibetrag bei Berechnung des laufenden Arbeitslohns, in Cent
     */
    VFRB: Decimal;
    /**
     * Verbrauchter Freibetrag bei Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent
     */
    VFRBS1: Decimal;
    /**
     * Verbrauchter Freibetrag bei Berechnung der sonstigen Bezüge, in Cent
     */
    VFRBS2: Decimal;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des laufenden Arbeitslohns, in Cent
     */
    WVFRB: Decimal;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung des voraussichtlichen Jahresarbeitslohns, in Cent
     */
    WVFRBO: Decimal;
    /**
     * Für die weitergehende Berücksichtigung des Steuerfreibetrags nach dem DBA Türkei verfügbares ZVE über dem Grundfreibetrag bei der Berechnung der sonstigen Bezüge, in Cent
     */
    WVFRBM: Decimal;
};

type Scope = Internals & Constants & FlatOutputs;

const CONST: Constants = {
    TAB1: [Decimal(0), Decimal(0.4), Decimal(0.384), Decimal(0.368), Decimal(0.352), Decimal(0.336), Decimal(0.32), Decimal(0.304), Decimal(0.288), Decimal(0.272), Decimal(0.256), Decimal(0.24), Decimal(0.224), Decimal(0.208), Decimal(0.192), Decimal(0.176), Decimal(0.16), Decimal(0.152), Decimal(0.144), Decimal(0.14), Decimal(0.136), Decimal(0.132), Decimal(0.128), Decimal(0.124), Decimal(0.12), Decimal(0.116), Decimal(0.112), Decimal(0.108), Decimal(0.104), Decimal(0.1), Decimal(0.096), Decimal(0.092), Decimal(0.088), Decimal(0.084), Decimal(0.08), Decimal(0.076), Decimal(0.072), Decimal(0.068), Decimal(0.064), Decimal(0.06), Decimal(0.056), Decimal(0.052), Decimal(0.048), Decimal(0.044), Decimal(0.04), Decimal(0.036), Decimal(0.032), Decimal(0.028), Decimal(0.024), Decimal(0.02), Decimal(0.016), Decimal(0.012), Decimal(0.008), Decimal(0.004), Decimal(0)],
    TAB2: [Decimal(0), Decimal(3000), Decimal(2880), Decimal(2760), Decimal(2640), Decimal(2520), Decimal(2400), Decimal(2280), Decimal(2160), Decimal(2040), Decimal(1920), Decimal(1800), Decimal(1680), Decimal(1560), Decimal(1440), Decimal(1320), Decimal(1200), Decimal(1140), Decimal(1080), Decimal(1050), Decimal(1020), Decimal(990), Decimal(960), Decimal(930), Decimal(900), Decimal(870), Decimal(840), Decimal(810), Decimal(780), Decimal(750), Decimal(720), Decimal(690), Decimal(660), Decimal(630), Decimal(600), Decimal(570), Decimal(540), Decimal(510), Decimal(480), Decimal(450), Decimal(420), Decimal(390), Decimal(360), Decimal(330), Decimal(300), Decimal(270), Decimal(240), Decimal(210), Decimal(180), Decimal(150), Decimal(120), Decimal(90), Decimal(60), Decimal(30), Decimal(0)],
    TAB3: [Decimal(0), Decimal(900), Decimal(864), Decimal(828), Decimal(792), Decimal(756), Decimal(720), Decimal(684), Decimal(648), Decimal(612), Decimal(576), Decimal(540), Decimal(504), Decimal(468), Decimal(432), Decimal(396), Decimal(360), Decimal(342), Decimal(324), Decimal(315), Decimal(306), Decimal(297), Decimal(288), Decimal(279), Decimal(270), Decimal(261), Decimal(252), Decimal(243), Decimal(234), Decimal(225), Decimal(216), Decimal(207), Decimal(198), Decimal(189), Decimal(180), Decimal(171), Decimal(162), Decimal(153), Decimal(144), Decimal(135), Decimal(126), Decimal(117), Decimal(108), Decimal(99), Decimal(90), Decimal(81), Decimal(72), Decimal(63), Decimal(54), Decimal(45), Decimal(36), Decimal(27), Decimal(18), Decimal(9), Decimal(0)],
    TAB4: [Decimal(0), Decimal(0.4), Decimal(0.384), Decimal(0.368), Decimal(0.352), Decimal(0.336), Decimal(0.32), Decimal(0.304), Decimal(0.288), Decimal(0.272), Decimal(0.256), Decimal(0.24), Decimal(0.224), Decimal(0.208), Decimal(0.192), Decimal(0.176), Decimal(0.16), Decimal(0.152), Decimal(0.144), Decimal(0.14), Decimal(0.136), Decimal(0.132), Decimal(0.128), Decimal(0.124), Decimal(0.12), Decimal(0.116), Decimal(0.112), Decimal(0.108), Decimal(0.104), Decimal(0.1), Decimal(0.096), Decimal(0.092), Decimal(0.088), Decimal(0.084), Decimal(0.08), Decimal(0.076), Decimal(0.072), Decimal(0.068), Decimal(0.064), Decimal(0.06), Decimal(0.056), Decimal(0.052), Decimal(0.048), Decimal(0.044), Decimal(0.04), Decimal(0.036), Decimal(0.032), Decimal(0.028), Decimal(0.024), Decimal(0.02), Decimal(0.016), Decimal(0.012), Decimal(0.008), Decimal(0.004), Decimal(0)],
    TAB5: [Decimal(0), Decimal(1900), Decimal(1824), Decimal(1748), Decimal(1672), Decimal(1596), Decimal(1520), Decimal(1444), Decimal(1368), Decimal(1292), Decimal(1216), Decimal(1140), Decimal(1064), Decimal(988), Decimal(912), Decimal(836), Decimal(760), Decimal(722), Decimal(684), Decimal(665), Decimal(646), Decimal(627), Decimal(608), Decimal(589), Decimal(570), Decimal(551), Decimal(532), Decimal(513), Decimal(494), Decimal(475), Decimal(456), Decimal(437), Decimal(418), Decimal(399), Decimal(380), Decimal(361), Decimal(342), Decimal(323), Decimal(304), Decimal(285), Decimal(266), Decimal(247), Decimal(228), Decimal(209), Decimal(190), Decimal(171), Decimal(152), Decimal(133), Decimal(114), Decimal(95), Decimal(76), Decimal(57), Decimal(38), Decimal(19), Decimal(0)],
    ZAHL1: Decimal(1),
    ZAHL2: Decimal(2),
    ZAHL5: Decimal(5),
    ZAHL7: Decimal(7),
    ZAHL12: Decimal(12),
    ZAHL100: Decimal(100),
    ZAHL360: Decimal(360),
    ZAHL500: Decimal(500),
    ZAHL700: Decimal(700),
    ZAHL1000: Decimal(1000),
    ZAHL10000: Decimal(10000),
};

const DEFAULT_INPUTS: Record<string, any> = {
    af: 1,
    AJAHR: 0,
    ALTER1: 0,
    ALV: 0,
    f: 1.0,
    JFREIB: Decimal(0),
    JHINZU: Decimal(0),
    JRE4: Decimal(0),
    JRE4ENT: Decimal(0),
    JVBEZ: Decimal(0),
    KRV: 0,
    KVZ: Decimal(0),
    LZZ: 1,
    LZZFREIB: Decimal(0),
    LZZHINZU: Decimal(0),
    MBV: Decimal(0),
    PKPV: Decimal(0),
    PKPVAGZ: Decimal(0),
    PKV: 0,
    PVA: Decimal(0),
    PVS: 0,
    PVZ: 0,
    RE4: Decimal(0),
    SONSTB: Decimal(0),
    SONSTENT: Decimal(0),
    STERBE: Decimal(0),
    STKL: 1,
    VBEZ: Decimal(0),
    VBEZM: Decimal(0),
    VBEZS: Decimal(0),
    VBS: Decimal(0),
    VJAHR: 0,
    ZKF: Decimal(0),
    ZMVB: 0,
};

const DEFAULT_INTERNALS: Partial<Internals> = {
    ALTE: Decimal(0),
    ANP: Decimal(0),
    ANTEIL1: Decimal(0),
    AVSATZAN: Decimal(0),
    BBGKVPV: Decimal(0),
    BBGRVALV: Decimal(0),
    BMG: Decimal(0),
    DIFF: Decimal(0),
    EFA: Decimal(0),
    FVB: Decimal(0),
    FVBSO: Decimal(0),
    FVBZ: Decimal(0),
    FVBZSO: Decimal(0),
    GFB: Decimal(0),
    HBALTE: Decimal(0),
    HFVB: Decimal(0),
    HFVBZ: Decimal(0),
    HFVBZSO: Decimal(0),
    HOCH: Decimal(0),
    J: 0,
    JBMG: Decimal(0),
    JLFREIB: Decimal(0),
    JLHINZU: Decimal(0),
    JW: Decimal(0),
    K: 0,
    KFB: Decimal(0),
    KVSATZAN: Decimal(0),
    KZTAB: 0,
    LSTJAHR: Decimal(0),
    LSTOSO: Decimal(0),
    LSTSO: Decimal(0),
    MIST: Decimal(0),
    PKPVAGZJ: Decimal(0),
    PVSATZAN: Decimal(0),
    RVSATZAN: Decimal(0),
    RW: Decimal(0),
    SAP: Decimal(0),
    SOLZFREI: Decimal(0),
    SOLZJ: Decimal(0),
    SOLZMIN: Decimal(0),
    SOLZSBMG: Decimal(0),
    SOLZSZVE: Decimal(0),
    ST: Decimal(0),
    ST1: Decimal(0),
    ST2: Decimal(0),
    VBEZB: Decimal(0),
    VBEZBSO: Decimal(0),
    VERGL: Decimal(0),
    VSPHB: Decimal(0),
    VSP: Decimal(0),
    VSPN: Decimal(0),
    VSPALV: Decimal(0),
    VSPKVPV: Decimal(0),
    VSPR: Decimal(0),
    W1STKL5: Decimal(0),
    W2STKL5: Decimal(0),
    W3STKL5: Decimal(0),
    X: Decimal(0),
    Y: Decimal(0),
    ZRE4: Decimal(0),
    ZRE4J: Decimal(0),
    ZRE4VP: Decimal(0),
    ZRE4VPR: Decimal(0),
    ZTABFB: Decimal(0),
    ZVBEZ: Decimal(0),
    ZVBEZJ: Decimal(0),
    ZVE: Decimal(0),
    ZX: Decimal(0),
    ZZX: Decimal(0),
};

const DEFAULT_OUTPUTS: Partial<FlatOutputs> = {
    BK: Decimal(0),
    BKS: Decimal(0),
    LSTLZZ: Decimal(0),
    SOLZLZZ: Decimal(0),
    SOLZS: Decimal(0),
    STS: Decimal(0),
    VFRB: Decimal(0),
    VFRBS1: Decimal(0),
    VFRBS2: Decimal(0),
    WVFRB: Decimal(0),
    WVFRBO: Decimal(0),
    WVFRBM: Decimal(0),
};

function MPARA(s: Scope & Record<string, any>): void {
    s.BBGRVALV = Decimal(101400);
    s.AVSATZAN = Decimal(0.013);
    s.RVSATZAN = Decimal(0.093);
    s.BBGKVPV = Decimal(69750);
    s.KVSATZAN = (s.KVZ.div(s.ZAHL2).div(s.ZAHL100)).add(Decimal(0.07));
    if (s.PVS === 1) {
        s.PVSATZAN = Decimal(0.023);
    } else {
        s.PVSATZAN = Decimal(0.018);
    }
    if (s.PVZ === 1) {
        s.PVSATZAN = s.PVSATZAN.add(Decimal(0.006));
    } else {
        s.PVSATZAN = s.PVSATZAN.sub(s.PVA.mul(Decimal(0.0025)));
    }
    s.W1STKL5 = Decimal(14071);
    s.W2STKL5 = Decimal(34939);
    s.W3STKL5 = Decimal(222260);
    s.GFB = Decimal(12348);
    s.SOLZFREI = Decimal(20350);
}

function MRE4JL(s: Scope & Record<string, any>): void {
    if (s.LZZ === 1) {
        s.ZRE4J = s.RE4.div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.ZVBEZJ = s.VBEZ.div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.JLFREIB = s.LZZFREIB.div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.JLHINZU = s.LZZHINZU.div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    } else {
        if (s.LZZ === 2) {
            s.ZRE4J = (s.RE4.mul(s.ZAHL12)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            s.ZVBEZJ = (s.VBEZ.mul(s.ZAHL12)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            s.JLFREIB = (s.LZZFREIB.mul(s.ZAHL12)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            s.JLHINZU = (s.LZZHINZU.mul(s.ZAHL12)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        } else {
            if (s.LZZ === 3) {
                s.ZRE4J = (s.RE4.mul(s.ZAHL360)).div(s.ZAHL700).toDecimalPlaces(2, Decimal.ROUND_DOWN);
                s.ZVBEZJ = (s.VBEZ.mul(s.ZAHL360)).div(s.ZAHL700).toDecimalPlaces(2, Decimal.ROUND_DOWN);
                s.JLFREIB = (s.LZZFREIB.mul(s.ZAHL360)).div(s.ZAHL700).toDecimalPlaces(2, Decimal.ROUND_DOWN);
                s.JLHINZU = (s.LZZHINZU.mul(s.ZAHL360)).div(s.ZAHL700).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            } else {
                s.ZRE4J = (s.RE4.mul(s.ZAHL360)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
                s.ZVBEZJ = (s.VBEZ.mul(s.ZAHL360)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
                s.JLFREIB = (s.LZZFREIB.mul(s.ZAHL360)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
                s.JLHINZU = (s.LZZHINZU.mul(s.ZAHL360)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            }
        }
    }
    if (s.af === 0) {
        s.f = 1;
    }
}

function MRE4(s: Scope & Record<string, any>): void {
    if (s.ZVBEZJ.cmp(Decimal(0)) === 0) {
        s.FVBZ = Decimal(0);
        s.FVB = Decimal(0);
        s.FVBZSO = Decimal(0);
        s.FVBSO = Decimal(0);
    } else {
        if (s.VJAHR < 2006) {
            s.J = 1;
        } else {
            if (s.VJAHR < 2058) {
                s.J = s.VJAHR - 2004;
            } else {
                s.J = 54;
            }
        }
        if (s.LZZ === 1) {
            s.VBEZB = (s.VBEZM.mul(Decimal(s.ZMVB))).add(s.VBEZS);
            s.HFVB = at(s.TAB2, s.J).div(s.ZAHL12).mul(Decimal(s.ZMVB)).toDecimalPlaces(0, Decimal.ROUND_UP);
            s.FVBZ = at(s.TAB3, s.J).div(s.ZAHL12).mul(Decimal(s.ZMVB)).toDecimalPlaces(0, Decimal.ROUND_UP);
        } else {
            s.VBEZB = ((s.VBEZM.mul(s.ZAHL12)).add(s.VBEZS)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            s.HFVB = at(s.TAB2, s.J);
            s.FVBZ = at(s.TAB3, s.J);
        }
        s.FVB = ((s.VBEZB.mul(at(s.TAB1, s.J)))).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_UP);
        if (s.FVB.cmp(s.HFVB) > 0) {
            s.FVB = s.HFVB;
        }
        if (s.FVB.cmp(s.ZVBEZJ) > 0) {
            s.FVB = s.ZVBEZJ;
        }
        s.FVBSO = (s.FVB.add((s.VBEZBSO.mul(at(s.TAB1, s.J))).div(s.ZAHL100))).toDecimalPlaces(2, Decimal.ROUND_UP);
        if (s.FVBSO.cmp(at(s.TAB2, s.J)) > 0) {
            s.FVBSO = at(s.TAB2, s.J);
        }
        s.HFVBZSO = (((s.VBEZB.add(s.VBEZBSO)).div(s.ZAHL100)).sub(s.FVBSO)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.FVBZSO = (s.FVBZ.add((s.VBEZBSO).div(s.ZAHL100))).toDecimalPlaces(0, Decimal.ROUND_UP);
        if (s.FVBZSO.cmp(s.HFVBZSO) > 0) {
            s.FVBZSO = s.HFVBZSO.toDecimalPlaces(0, Decimal.ROUND_UP);
        }
        if (s.FVBZSO.cmp(at(s.TAB3, s.J)) > 0) {
            s.FVBZSO = at(s.TAB3, s.J);
        }
        s.HFVBZ = ((s.VBEZB.div(s.ZAHL100)).sub(s.FVB)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        if (s.FVBZ.cmp(s.HFVBZ) > 0) {
            s.FVBZ = s.HFVBZ.toDecimalPlaces(0, Decimal.ROUND_UP);
        }
    }
    MRE4ALTE(s);
}

function MRE4ALTE(s: Scope & Record<string, any>): void {
    if (s.ALTER1 === 0) {
        s.ALTE = Decimal(0);
    } else {
        if (s.AJAHR < 2006) {
            s.K = 1;
        } else {
            if (s.AJAHR < 2058) {
                s.K = s.AJAHR - 2004;
            } else {
                s.K = 54;
            }
        }
        s.BMG = s.ZRE4J.sub(s.ZVBEZJ);
        s.ALTE = (s.BMG.mul(at(s.TAB4, s.K))).toDecimalPlaces(0, Decimal.ROUND_UP);
        s.HBALTE = at(s.TAB5, s.K);
        if (s.ALTE.cmp(s.HBALTE) > 0) {
            s.ALTE = s.HBALTE;
        }
    }
}

function MRE4ABZ(s: Scope & Record<string, any>): void {
    s.ZRE4 = (s.ZRE4J.sub(s.FVB).sub(s.ALTE).sub(s.JLFREIB).add(s.JLHINZU)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    if (s.ZRE4.cmp(Decimal(0)) < 0) {
        s.ZRE4 = Decimal(0);
    }
    s.ZRE4VP = s.ZRE4J;
    s.ZVBEZ = s.ZVBEZJ.sub(s.FVB).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    if (s.ZVBEZ.cmp(Decimal(0)) < 0) {
        s.ZVBEZ = Decimal(0);
    }
}

function MBERECH(s: Scope & Record<string, any>): void {
    MZTABFB(s);
    s.VFRB = ((s.ANP.add(s.FVB.add(s.FVBZ))).mul(s.ZAHL100)).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    MLSTJAHR(s);
    s.WVFRB = ((s.ZVE.sub(s.GFB)).mul(s.ZAHL100)).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    if (s.WVFRB.cmp(Decimal(0)) < 0) {
        s.WVFRB = Decimal(0);
    }
    s.LSTJAHR = (s.ST.mul(Decimal(s.f))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    UPLSTLZZ(s);
    if (s.ZKF.cmp(Decimal(0)) > 0) {
        s.ZTABFB = s.ZTABFB.add(s.KFB);
        MRE4ABZ(s);
        MLSTJAHR(s);
        s.JBMG = (s.ST.mul(Decimal(s.f))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    } else {
        s.JBMG = s.LSTJAHR;
    }
    MSOLZ(s);
}

function MZTABFB(s: Scope & Record<string, any>): void {
    s.ANP = Decimal(0);
    if (s.ZVBEZ.cmp(Decimal(0)) >= 0 && s.ZVBEZ.cmp(s.FVBZ) < 0) {
        s.FVBZ = s.ZVBEZ.trunc();
    }
    if (s.STKL < 6) {
        if (s.ZVBEZ.cmp(Decimal(0)) > 0) {
            if ((s.ZVBEZ.sub(s.FVBZ)).cmp(Decimal(102)) < 0) {
                s.ANP = (s.ZVBEZ.sub(s.FVBZ)).toDecimalPlaces(0, Decimal.ROUND_UP);
            } else {
                s.ANP = Decimal(102);
            }
        }
    } else {
        s.FVBZ = Decimal(0);
        s.FVBZSO = Decimal(0);
    }
    if (s.STKL < 6) {
        if (s.ZRE4.cmp(s.ZVBEZ) > 0) {
            if (s.ZRE4.sub(s.ZVBEZ).cmp(Decimal(1230)) < 0) {
                s.ANP = s.ANP.add(s.ZRE4).sub(s.ZVBEZ).toDecimalPlaces(0, Decimal.ROUND_UP);
            } else {
                s.ANP = s.ANP.add(Decimal(1230));
            }
        }
    }
    s.KZTAB = 1;
    if (s.STKL === 1) {
        s.SAP = Decimal(36);
        s.KFB = (s.ZKF.mul(Decimal(9756))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    } else {
        if (s.STKL === 2) {
            s.EFA = Decimal(4260);
            s.SAP = Decimal(36);
            s.KFB = (s.ZKF.mul(Decimal(9756))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
        } else {
            if (s.STKL === 3) {
                s.KZTAB = 2;
                s.SAP = Decimal(36);
                s.KFB = (s.ZKF.mul(Decimal(9756))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            } else {
                if (s.STKL === 4) {
                    s.SAP = Decimal(36);
                    s.KFB = (s.ZKF.mul(Decimal(4878))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
                } else {
                    if (s.STKL === 5) {
                        s.SAP = Decimal(36);
                        s.KFB = Decimal(0);
                    } else {
                        s.KFB = Decimal(0);
                    }
                }
            }
        }
    }
    s.ZTABFB = (s.EFA.add(s.ANP).add(s.SAP).add(s.FVBZ)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
}

function MLSTJAHR(s: Scope & Record<string, any>): void {
    UPEVP(s);
    s.ZVE = s.ZRE4.sub(s.ZTABFB).sub(s.VSP);
    UPMLST(s);
}

function UPLSTLZZ(s: Scope & Record<string, any>): void {
    s.JW = s.LSTJAHR.mul(s.ZAHL100);
    UPANTEIL(s);
    s.LSTLZZ = s.ANTEIL1;
}

function UPMLST(s: Scope & Record<string, any>): void {
    if (s.ZVE.cmp(s.ZAHL1) < 0) {
        s.ZVE = Decimal(0);
        s.X = Decimal(0);
    } else {
        s.X = (s.ZVE.div(Decimal(s.KZTAB))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    }
    if (s.STKL < 5) {
        UPTAB26(s);
    } else {
        MST5_6(s);
    }
}

function UPEVP(s: Scope & Record<string, any>): void {
    if (s.KRV === 1) {
        s.VSPR = Decimal(0);
    } else {
        if (s.ZRE4VP.cmp(s.BBGRVALV) > 0) {
            s.ZRE4VPR = s.BBGRVALV;
        } else {
            s.ZRE4VPR = s.ZRE4VP;
        }
        s.VSPR = (s.ZRE4VPR.mul(s.RVSATZAN)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    }
    MVSPKVPV(s);
    if (s.ALV === 1) {
    } else {
        if (s.STKL === 6) {
        } else {
            MVSPHB(s);
        }
    }
}

function MVSPKVPV(s: Scope & Record<string, any>): void {
    if (s.ZRE4VP.cmp(s.BBGKVPV) > 0) {
        s.ZRE4VPR = s.BBGKVPV;
    } else {
        s.ZRE4VPR = s.ZRE4VP;
    }
    if (s.PKV > 0) {
        if (s.STKL === 6) {
            s.VSPKVPV = Decimal(0);
        } else {
            s.PKPVAGZJ = s.PKPVAGZ.mul(s.ZAHL12).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            s.VSPKVPV = s.PKPV.mul(s.ZAHL12).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
            s.VSPKVPV = s.VSPKVPV.sub(s.PKPVAGZJ);
            if (s.VSPKVPV.cmp(Decimal(0)) < 0) {
                s.VSPKVPV = Decimal(0);
            }
        }
    } else {
        s.VSPKVPV = s.ZRE4VPR.mul(s.KVSATZAN.add(s.PVSATZAN)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    }
    s.VSP = s.VSPKVPV.add(s.VSPR).toDecimalPlaces(0, Decimal.ROUND_UP);
}

function MVSPHB(s: Scope & Record<string, any>): void {
    if (s.ZRE4VP.cmp(s.BBGRVALV) > 0) {
        s.ZRE4VPR = s.BBGRVALV;
    } else {
        s.ZRE4VPR = s.ZRE4VP;
    }
    s.VSPALV = s.AVSATZAN.mul(s.ZRE4VPR).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    s.VSPHB = s.VSPALV.add(s.VSPKVPV).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    if (s.VSPHB.cmp(Decimal(1900)) > 0) {
        s.VSPHB = Decimal(1900);
    }
    s.VSPN = s.VSPR.add(s.VSPHB).toDecimalPlaces(0, Decimal.ROUND_UP);
    if (s.VSPN.cmp(s.VSP) > 0) {
        s.VSP = s.VSPN;
    }
}

function MST5_6(s: Scope & Record<string, any>): void {
    s.ZZX = s.X;
    if (s.ZZX.cmp(s.W2STKL5) > 0) {
        s.ZX = s.W2STKL5;
        UP5_6(s);
        if (s.ZZX.cmp(s.W3STKL5) > 0) {
            s.ST = (s.ST.add((s.W3STKL5.sub(s.W2STKL5)).mul(Decimal(0.42)))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            s.ST = (s.ST.add((s.ZZX.sub(s.W3STKL5)).mul(Decimal(0.45)))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
        } else {
            s.ST = (s.ST.add((s.ZZX.sub(s.W2STKL5)).mul(Decimal(0.42)))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
        }
    } else {
        s.ZX = s.ZZX;
        UP5_6(s);
        if (s.ZZX.cmp(s.W1STKL5) > 0) {
            s.VERGL = s.ST;
            s.ZX = s.W1STKL5;
            UP5_6(s);
            s.HOCH = (s.ST.add((s.ZZX.sub(s.W1STKL5)).mul(Decimal(0.42)))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            if (s.HOCH.cmp(s.VERGL) < 0) {
                s.ST = s.HOCH;
            } else {
                s.ST = s.VERGL;
            }
        }
    }
}

function UP5_6(s: Scope & Record<string, any>): void {
    s.X = (s.ZX.mul(Decimal(1.25))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    UPTAB26(s);
    s.ST1 = s.ST;
    s.X = (s.ZX.mul(Decimal(0.75))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    UPTAB26(s);
    s.ST2 = s.ST;
    s.DIFF = (s.ST1.sub(s.ST2)).mul(s.ZAHL2);
    s.MIST = (s.ZX.mul(Decimal(0.14))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    if (s.MIST.cmp(s.DIFF) > 0) {
        s.ST = s.MIST;
    } else {
        s.ST = s.DIFF;
    }
}

function MSOLZ(s: Scope & Record<string, any>): void {
    s.SOLZFREI = (s.SOLZFREI.mul(Decimal(s.KZTAB)));
    if (s.JBMG.cmp(s.SOLZFREI) > 0) {
        s.SOLZJ = (s.JBMG.mul(Decimal(5.5))).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.SOLZMIN = (s.JBMG.sub(s.SOLZFREI)).mul(Decimal(11.9)).div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        if (s.SOLZMIN.cmp(s.SOLZJ) < 0) {
            s.SOLZJ = s.SOLZMIN;
        }
        s.JW = s.SOLZJ.mul(s.ZAHL100).toDecimalPlaces(0, Decimal.ROUND_DOWN);
        UPANTEIL(s);
        s.SOLZLZZ = s.ANTEIL1;
    } else {
        s.SOLZLZZ = Decimal(0);
    }
    if (s.R > 0) {
        s.JW = s.JBMG.mul(s.ZAHL100);
        UPANTEIL(s);
        s.BK = s.ANTEIL1;
    } else {
        s.BK = Decimal(0);
    }
}

function UPANTEIL(s: Scope & Record<string, any>): void {
    if (s.LZZ === 1) {
        s.ANTEIL1 = s.JW;
    } else {
        if (s.LZZ === 2) {
            s.ANTEIL1 = s.JW.div(s.ZAHL12).toDecimalPlaces(0, Decimal.ROUND_DOWN);
        } else {
            if (s.LZZ === 3) {
                s.ANTEIL1 = (s.JW.mul(s.ZAHL7)).div(s.ZAHL360).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            } else {
                s.ANTEIL1 = s.JW.div(s.ZAHL360).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            }
        }
    }
}

function MSONST(s: Scope & Record<string, any>): void {
    s.LZZ = 1;
    if (s.ZMVB === 0) {
        s.ZMVB = 12;
    }
    if (s.SONSTB.cmp(Decimal(0)) === 0 && s.MBV.cmp(Decimal(0)) === 0) {
        s.LSTSO = Decimal(0);
        s.STS = Decimal(0);
        s.SOLZS = Decimal(0);
        s.BKS = Decimal(0);
    } else {
        MOSONST(s);
        s.ZRE4J = ((s.JRE4.add(s.SONSTB)).div(s.ZAHL100)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.ZVBEZJ = ((s.JVBEZ.add(s.VBS)).div(s.ZAHL100)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        s.VBEZBSO = s.STERBE;
        MRE4SONST(s);
        MLSTJAHR(s);
        s.WVFRBM = (s.ZVE.sub(s.GFB)).mul(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
        if (s.WVFRBM.cmp(Decimal(0)) < 0) {
            s.WVFRBM = Decimal(0);
        }
        s.LSTSO = s.ST.mul(s.ZAHL100);
        s.STS = s.LSTSO.sub(s.LSTOSO).mul(Decimal(s.f)).div(s.ZAHL100).toDecimalPlaces(0, Decimal.ROUND_DOWN).mul(s.ZAHL100);
        STSMIN(s);
    }
}

function STSMIN(s: Scope & Record<string, any>): void {
    if (s.STS.cmp(Decimal(0)) < 0) {
        if (s.MBV.cmp(Decimal(0)) === 0) {
        } else {
            s.LSTLZZ = s.LSTLZZ.add(s.STS);
            if (s.LSTLZZ.cmp(Decimal(0)) < 0) {
                s.LSTLZZ = Decimal(0);
            }
            s.SOLZLZZ = s.SOLZLZZ.add(s.STS.mul(Decimal(5.5).div(s.ZAHL100))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            if (s.SOLZLZZ.cmp(Decimal(0)) < 0) {
                s.SOLZLZZ = Decimal(0);
            }
            s.BK = s.BK.add(s.STS);
            if (s.BK.cmp(Decimal(0)) < 0) {
                s.BK = Decimal(0);
            }
        }
        s.STS = Decimal(0);
        s.SOLZS = Decimal(0);
    } else {
        MSOLZSTS(s);
    }
    if (s.R > 0) {
        s.BKS = s.STS;
    } else {
        s.BKS = Decimal(0);
    }
}

function MSOLZSTS(s: Scope & Record<string, any>): void {
    if (s.ZKF.cmp(Decimal(0)) > 0) {
        s.SOLZSZVE = s.ZVE.sub(s.KFB);
    } else {
        s.SOLZSZVE = s.ZVE;
    }
    if (s.SOLZSZVE.cmp(Decimal(1)) < 0) {
        s.SOLZSZVE = Decimal(0);
        s.X = Decimal(0);
    } else {
        s.X = s.SOLZSZVE.div(Decimal(s.KZTAB)).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    }
    if (s.STKL < 5) {
        UPTAB26(s);
    } else {
        MST5_6(s);
    }
    s.SOLZSBMG = s.ST.mul(Decimal(s.f)).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    if (s.SOLZSBMG.cmp(s.SOLZFREI) > 0) {
        s.SOLZS = s.STS.mul(Decimal(5.5)).div(s.ZAHL100).toDecimalPlaces(0, Decimal.ROUND_DOWN);
    } else {
        s.SOLZS = Decimal(0);
    }
}

function MOSONST(s: Scope & Record<string, any>): void {
    s.ZRE4J = (s.JRE4.div(s.ZAHL100)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    s.ZVBEZJ = (s.JVBEZ.div(s.ZAHL100)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    s.JLFREIB = s.JFREIB.div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    s.JLHINZU = s.JHINZU.div(s.ZAHL100).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    MRE4(s);
    MRE4ABZ(s);
    s.ZRE4VP = s.ZRE4VP.sub(s.JRE4ENT.div(s.ZAHL100));
    MZTABFB(s);
    s.VFRBS1 = ((s.ANP.add(s.FVB.add(s.FVBZ))).mul(s.ZAHL100)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    MLSTJAHR(s);
    s.WVFRBO = ((s.ZVE.sub(s.GFB)).mul(s.ZAHL100)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
    if (s.WVFRBO.cmp(Decimal(0)) < 0) {
        s.WVFRBO = Decimal(0);
    }
    s.LSTOSO = s.ST.mul(s.ZAHL100);
}

function MRE4SONST(s: Scope & Record<string, any>): void {
    MRE4(s);
    s.FVB = s.FVBSO;
    MRE4ABZ(s);
    s.ZRE4VP = s.ZRE4VP.add(s.MBV.div(s.ZAHL100)).sub(s.JRE4ENT.div(s.ZAHL100)).sub(s.SONSTENT.div(s.ZAHL100));
    s.FVBZ = s.FVBZSO;
    MZTABFB(s);
    s.VFRBS2 = ((((s.ANP.add(s.FVB).add(s.FVBZ))).mul(s.ZAHL100))).sub(s.VFRBS1);
}

function UPTAB26(s: Scope & Record<string, any>): void {
    if (s.X.cmp(s.GFB.add(s.ZAHL1)) < 0) {
        s.ST = Decimal(0);
    } else {
        if (s.X.cmp(Decimal(17800)) < 0) {
            s.Y = (s.X.sub(s.GFB)).div(s.ZAHL10000).toDecimalPlaces(6, Decimal.ROUND_DOWN);
            s.RW = s.Y.mul(Decimal(914.51));
            s.RW = s.RW.add(Decimal(1400));
            s.ST = (s.RW.mul(s.Y)).toDecimalPlaces(0, Decimal.ROUND_DOWN);
        } else {
            if (s.X.cmp(Decimal(69879)) < 0) {
                s.Y = (s.X.sub(Decimal(17799))).div(s.ZAHL10000).toDecimalPlaces(6, Decimal.ROUND_DOWN);
                s.RW = s.Y.mul(Decimal(173.1));
                s.RW = s.RW.add(Decimal(2397));
                s.RW = s.RW.mul(s.Y);
                s.ST = (s.RW.add(Decimal(1034.87))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
            } else {
                if (s.X.cmp(Decimal(277826)) < 0) {
                    s.ST = ((s.X.mul(Decimal(0.42))).sub(Decimal(11135.63))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
                } else {
                    s.ST = ((s.X.mul(Decimal(0.45))).sub(Decimal(19470.38))).toDecimalPlaces(0, Decimal.ROUND_DOWN);
                }
            }
        }
    }
    s.ST = s.ST.mul(Decimal(s.KZTAB));
}

export function computePAP(inputs: Partial<PapInputs>): PapOutputs {
    // required input checks (accept pretty or raw keys)
    if ((inputs as any).R == null && (inputs as any).religionCode == null && (DEFAULT_INPUTS as any).R == null) {
        throw new Error("Missing required input: religionCode (aka R)");
    }

    const s: (Scope & Record<string, any>) = {
        ...(CONST as any),
        ...(DEFAULT_OUTPUTS as any),
        ...(DEFAULT_INTERNALS as any),
        ...(DEFAULT_INPUTS as any),
    } as any;

    // apply user inputs (raw PAP keys and/or pretty keys if enabled)
    if ((inputs as any).af != null) (s as any).af = (inputs as any).af;
    if ((inputs as any).useFactorMethod != null) (s as any).af = (inputs as any).useFactorMethod;
    if ((inputs as any).AJAHR != null) (s as any).AJAHR = (inputs as any).AJAHR;
    if ((inputs as any).ageReliefYear != null) (s as any).AJAHR = (inputs as any).ageReliefYear;
    if ((inputs as any).ALTER1 != null) (s as any).ALTER1 = (inputs as any).ALTER1;
    if ((inputs as any).isAgeReliefEligible != null) (s as any).ALTER1 = (inputs as any).isAgeReliefEligible;
    if ((inputs as any).ALV != null) (s as any).ALV = (inputs as any).ALV;
    if ((inputs as any).noUnemploymentInsurance != null) (s as any).ALV = (inputs as any).noUnemploymentInsurance;
    if ((inputs as any).f != null) (s as any).f = (inputs as any).f;
    if ((inputs as any).taxFactor != null) (s as any).f = (inputs as any).taxFactor;
    if ((inputs as any).JFREIB != null) (s as any).JFREIB = (inputs as any).JFREIB;
    if ((inputs as any).annualAllowanceCents != null) (s as any).JFREIB = (inputs as any).annualAllowanceCents;
    if ((inputs as any).JHINZU != null) (s as any).JHINZU = (inputs as any).JHINZU;
    if ((inputs as any).annualAddbackCents != null) (s as any).JHINZU = (inputs as any).annualAddbackCents;
    if ((inputs as any).JRE4 != null) (s as any).JRE4 = (inputs as any).JRE4;
    if ((inputs as any).annualGrossCents != null) (s as any).JRE4 = (inputs as any).annualGrossCents;
    if ((inputs as any).JRE4ENT != null) (s as any).JRE4ENT = (inputs as any).JRE4ENT;
    if ((inputs as any).annualCompCents != null) (s as any).JRE4ENT = (inputs as any).annualCompCents;
    if ((inputs as any).JVBEZ != null) (s as any).JVBEZ = (inputs as any).JVBEZ;
    if ((inputs as any).annualPensionCents != null) (s as any).JVBEZ = (inputs as any).annualPensionCents;
    if ((inputs as any).KRV != null) (s as any).KRV = (inputs as any).KRV;
    if ((inputs as any).noPublicPensionInsurance != null) (s as any).KRV = (inputs as any).noPublicPensionInsurance;
    if ((inputs as any).KVZ != null) (s as any).KVZ = (inputs as any).KVZ;
    if ((inputs as any).healthAddOnRatePct != null) (s as any).KVZ = (inputs as any).healthAddOnRatePct;
    if ((inputs as any).LZZ != null) (s as any).LZZ = (inputs as any).LZZ;
    if ((inputs as any).payPeriod != null) (s as any).LZZ = (inputs as any).payPeriod;
    if ((inputs as any).LZZFREIB != null) (s as any).LZZFREIB = (inputs as any).LZZFREIB;
    if ((inputs as any).allowanceCents != null) (s as any).LZZFREIB = (inputs as any).allowanceCents;
    if ((inputs as any).LZZHINZU != null) (s as any).LZZHINZU = (inputs as any).LZZHINZU;
    if ((inputs as any).addbackCents != null) (s as any).LZZHINZU = (inputs as any).addbackCents;
    if ((inputs as any).MBV != null) (s as any).MBV = (inputs as any).MBV;
    if ((inputs as any).nonTaxableEquityBenefitsCents != null) (s as any).MBV = (inputs as any).nonTaxableEquityBenefitsCents;
    if ((inputs as any).PKPV != null) (s as any).PKPV = (inputs as any).PKPV;
    if ((inputs as any).privateHealthEmployeeMonthlyCents != null) (s as any).PKPV = (inputs as any).privateHealthEmployeeMonthlyCents;
    if ((inputs as any).PKPVAGZ != null) (s as any).PKPVAGZ = (inputs as any).PKPVAGZ;
    if ((inputs as any).privateHealthEmployerMonthlyCents != null) (s as any).PKPVAGZ = (inputs as any).privateHealthEmployerMonthlyCents;
    if ((inputs as any).PKV != null) (s as any).PKV = (inputs as any).PKV;
    if ((inputs as any).isPrivateHealthInsured != null) (s as any).PKV = (inputs as any).isPrivateHealthInsured;
    if ((inputs as any).PVA != null) (s as any).PVA = (inputs as any).PVA;
    if ((inputs as any).careDiscountChildren != null) (s as any).PVA = (inputs as any).careDiscountChildren;
    if ((inputs as any).PVS != null) (s as any).PVS = (inputs as any).PVS;
    if ((inputs as any).isSaxonyCareRules != null) (s as any).PVS = (inputs as any).isSaxonyCareRules;
    if ((inputs as any).PVZ != null) (s as any).PVZ = (inputs as any).PVZ;
    if ((inputs as any).isChildlessCareSurcharge != null) (s as any).PVZ = (inputs as any).isChildlessCareSurcharge;
    if ((inputs as any).R != null) (s as any).R = (inputs as any).R;
    if ((inputs as any).religionCode != null) (s as any).R = (inputs as any).religionCode;
    if ((inputs as any).RE4 != null) (s as any).RE4 = (inputs as any).RE4;
    if ((inputs as any).grossWageCents != null) (s as any).RE4 = (inputs as any).grossWageCents;
    if ((inputs as any).SONSTB != null) (s as any).SONSTB = (inputs as any).SONSTB;
    if ((inputs as any).oneTimePayCents != null) (s as any).SONSTB = (inputs as any).oneTimePayCents;
    if ((inputs as any).SONSTENT != null) (s as any).SONSTENT = (inputs as any).SONSTENT;
    if ((inputs as any).oneTimeCompCents != null) (s as any).SONSTENT = (inputs as any).oneTimeCompCents;
    if ((inputs as any).STERBE != null) (s as any).STERBE = (inputs as any).STERBE;
    if ((inputs as any).deathBenefitCents != null) (s as any).STERBE = (inputs as any).deathBenefitCents;
    if ((inputs as any).STKL != null) (s as any).STKL = (inputs as any).STKL;
    if ((inputs as any).taxClass != null) (s as any).STKL = (inputs as any).taxClass;
    if ((inputs as any).VBEZ != null) (s as any).VBEZ = (inputs as any).VBEZ;
    if ((inputs as any).pensionWageCents != null) (s as any).VBEZ = (inputs as any).pensionWageCents;
    if ((inputs as any).VBEZM != null) (s as any).VBEZM = (inputs as any).VBEZM;
    if ((inputs as any).pensionJan2005Cents != null) (s as any).VBEZM = (inputs as any).pensionJan2005Cents;
    if ((inputs as any).VBEZS != null) (s as any).VBEZS = (inputs as any).VBEZS;
    if ((inputs as any).pensionSpecialPayCents != null) (s as any).VBEZS = (inputs as any).pensionSpecialPayCents;
    if ((inputs as any).VBS != null) (s as any).VBS = (inputs as any).VBS;
    if ((inputs as any).oneTimePensionCents != null) (s as any).VBS = (inputs as any).oneTimePensionCents;
    if ((inputs as any).VJAHR != null) (s as any).VJAHR = (inputs as any).VJAHR;
    if ((inputs as any).pensionStartYear != null) (s as any).VJAHR = (inputs as any).pensionStartYear;
    if ((inputs as any).ZKF != null) (s as any).ZKF = (inputs as any).ZKF;
    if ((inputs as any).childAllowance != null) (s as any).ZKF = (inputs as any).childAllowance;
    if ((inputs as any).ZMVB != null) (s as any).ZMVB = (inputs as any).ZMVB;
    if ((inputs as any).pensionMonthsPaid != null) (s as any).ZMVB = (inputs as any).pensionMonthsPaid;

    MPARA(s);
    MRE4JL(s);
    s.VBEZBSO = Decimal(0);
    MRE4(s);
    MRE4ABZ(s);
    MBERECH(s);
    MSONST(s);
    return {
        STANDARD: {
            churchTaxBaseCents: s.BK,
            oneTimeChurchTaxBaseCents: s.BKS,
            wageTaxCents: s.LSTLZZ,
            solidaritySurchargeCents: s.SOLZLZZ,
            oneTimeSolidaritySurchargeCents: s.SOLZS,
            oneTimeWageTaxCents: s.STS,
        },
        DBA: {
            usedAllowanceCurrentCents: s.VFRB,
            usedAllowanceAnnualCents: s.VFRBS1,
            usedAllowanceOneTimeCents: s.VFRBS2,
            availableZveOverBasicAllowanceCurrentCents: s.WVFRB,
            availableZveOverBasicAllowanceAnnualCents: s.WVFRBO,
            availableZveOverBasicAllowanceOneTimeCents: s.WVFRBM,
        },
    };
}
