import {getDictionary} from "@/app/[lang]/dictionaries";
import {GrossNetCalculator} from "./calculator";


export default async function Page({params}: PageProps<'/[lang]/calculators/gross-net'>) {
    const {lang: language} = await params;
    const {dict, lang} = await getDictionary(language);

    return (
        <section className="mx-auto max-w-5xl py-12">
            <h1 className="text-3xl font-semibold tracking-tight">{dict.calculators.grossNet.title}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{dict.calculators.grossNet.subtitle}</p>

            <div className="mt-8">
                <GrossNetCalculator dict={dict} lang={lang}/>
            </div>
        </section>
    );
}