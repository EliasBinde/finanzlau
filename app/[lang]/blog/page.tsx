import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/sanity";
import { postsListQuery } from "@/lib/sanity/sanity-queries/postsListQuery";
import { postSlugsQuery } from "@/lib/sanity/sanity-queries/postSlugsQuery";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { locales } from "@/proxy";
import { BlogPostList, type BlogPostListItem } from "./blog-post-list";

export const revalidate = 600;

export const dynamicParams = false;

type PageProps = {
    params: Promise<{ lang: string }>;
};

export async function generateStaticParams() {
    await client.fetch<Array<{ slug: string }>>(postSlugsQuery);
    return locales.map((lang) => ({ lang }));
}

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();

    const posts = await client.fetch<BlogPostListItem[]>(postsListQuery, { lang });
    const t = {
        heading: lang === "de" ? "Blog" : "Blog",
        subheading: lang === "de" ? "Aktuelle Beiträge" : "Latest posts",
    } as const;

    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{t.heading}</h1>
                <p className="text-sm text-muted-foreground">{t.subheading}</p>
            </header>

            <BlogPostList lang={lang} posts={posts} />
        </section>
    );
}
