import { getDictionary } from "@/app/[lang]/dictionaries";
import { CompoundInterestCalculator } from "./calculator";

export default async function Page({ params }: PageProps<'/[lang]/calculators/compound-interest'>) {

    const { lang: language } = await params;

    const { dict, lang } = await getDictionary(language);

    return (
        <section className="mx-auto max-w-5xl py-12">
            <h1 className="text-3xl font-semibold tracking-tight">
                {dict.calculators.compoundInterest.title}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
                {dict.calculators.compoundInterest.subtitle}
            </p>

            <div className="mt-8">
                <CompoundInterestCalculator dict={dict} lang={lang} />
            </div>
        </section>
    );
}