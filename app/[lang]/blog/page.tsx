import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/sanity";
import { postsListQuery } from "@/lib/sanity/sanity-queries/postsListQuery";
import { postSlugsQuery } from "@/lib/sanity/sanity-queries/postSlugsQuery";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { locales } from "@/proxy";
import {UrlObject} from "url";

export const revalidate = 600;

export const dynamicParams = false;

type PageProps = {
    params: Promise<{ lang: string }>;
};

type PostListItem = {
    _id: string;
    slug: string;
    publishedAt?: string;
    title: string;
    hero?: {
        kind?: "image" | "youtube";
        image?: { asset?: { url?: string }; alt?: string };
        youtube?: { url?: string };
    };
};

export async function generateStaticParams() {
    await client.fetch<Array<{ slug: string }>>(postSlugsQuery);
    return locales.map((lang) => ({ lang }));
}

function withLangPath(lang: string, href: string) {
    return href === "/" ? `/${lang}` : `/${lang}${href}`;
}

export default async function Page({ params }: PageProps) {
    const { lang } = await params;
    if (!hasLocale(lang)) notFound();

    const posts = await client.fetch<PostListItem[]>(postsListQuery, { lang });

    return (
        <section className="mx-auto max-w-5xl space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
                <p className="text-sm text-muted-foreground">{lang === "de" ? "Aktuelle Beiträge" : "Latest posts"}</p>
            </header>

            {posts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{lang === "de" ? "Noch keine Beiträge." : "No posts yet."}</p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {posts.map((post) => {
                        const href = withLangPath(lang, `/blog/${post.slug}`);
                        const date = post.publishedAt
                            ? new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")
                            : null;

                        const heroImage = post.hero?.kind === "image" ? post.hero?.image?.asset?.url : null;

                        function blogPostHref(lang: string, slug: string): UrlObject {
                            return {
                                pathname: `/${lang}/blog/${slug}`,
                            };
                        }

                        return (
                            <Link
                                key={post._id}
                                href={blogPostHref(lang, post.slug)}
                                className="group rounded-xl border bg-background p-4 transition-colors hover:bg-muted/30"
                            >
                                <div className="space-y-3">
                                    {heroImage ? (
                                        <img
                                            src={heroImage}
                                            alt={post.hero?.image?.alt ?? post.title}
                                            className="aspect-[16/9] w-full rounded-lg border object-cover"
                                            loading="lazy"
                                        />
                                    ) : null}

                                    <div className="space-y-1">
                                        <h2 className="text-lg font-semibold leading-snug group-hover:underline">{post.title}</h2>
                                        {date ? <p className="text-sm text-muted-foreground">{date}</p> : null}
                                    </div>

                                    <div className="text-sm font-medium">{lang === "de" ? "Beitrag lesen →" : "Read post →"}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </section>
    );
}