import {getDictionary} from "@/app/[lang]/dictionaries";
import {EmergencyFundCalculator} from "./calculator";

export default async function Page({params}: PageProps<'/[lang]/calculators/emergency-fund'>) {

    const {lang: language} = await params;

    const {dict} = await getDictionary(language);

    return (
        <section className="mx-auto max-w-5xl py-12">
            <h1 className="text-3xl font-semibold tracking-tight">
                {dict.calculators.emergencyFund.title}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
                {dict.calculators.emergencyFund.subtitle}
            </p>

            <div className="mt-8">
                <EmergencyFundCalculator dict={dict}/>
            </div>
        </section>
    );
}