import {getDictionary} from "@/app/[lang]/dictionaries";
import {HomeHero} from "@/app/[lang]/home/hero";
import {HomeStats} from "@/app/[lang]/home/stats";
import {HomeServices} from "@/app/[lang]/home/services";
import {HomeTrust} from "@/app/[lang]/home/trust";
import {HomeCta} from "@/app/[lang]/home/cta";

type PageProps = {
    params: Promise<{ lang: string }>;
};
export default async function Page({ params }: PageProps) {
    const { lang } = await params;

    const { dict, lang: language } = await getDictionary(lang);

    return (
        <div className="flex flex-col gap-10 md:gap-4">
            <HomeHero lang={lang} dict={dict} />
            <HomeStats dict={dict} />
            <HomeServices dict={dict} lang={language} />
            <HomeTrust dict={dict} />
            <HomeCta dict={dict} lang={language} />
        </div>
    );
}
