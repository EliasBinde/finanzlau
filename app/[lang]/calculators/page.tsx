import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getDictionary} from "@/app/[lang]/dictionaries";
import Link from "next/link";
import {UrlObject} from "url";

function withLang(href: string, lang: string): UrlObject {
    const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
    return {pathname: path};
}

export default async function Page({params}: PageProps<'/[lang]/calculators'>) {

    const {lang: language} = await params;

    const {dict} = await getDictionary(language);


    return (
        <div className="flex flex-col items-center justify-around">
            <Card>
                <CardHeader>
                    <CardTitle>Finanzrechner</CardTitle>
                    <CardDescription>
                        Hilfreiche Finanzrechner
                    </CardDescription>
                </CardHeader>
                <CardContent className={"flex flex-col gap-4 p-6"}>
                    <Link href={withLang(`/calculators/compound-interest`, language)}>
                        <Button className="w-full cursor-pointer">
                            {dict.calculators.compoundInterest.title}
                        </Button>
                    </Link>
                    <Link href={withLang(`/calculators/gross-net`, language)}>
                        <Button className="w-full cursor-pointer">
                            {dict.calculators.grossNet.title}
                        </Button>
                    </Link>
                    <Link href={withLang(`/calculators/emergency-fund`, language)}>
                        <Button className="w-full cursor-pointer">
                            {dict.calculators.emergencyFund.title}
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </div>
    )
}