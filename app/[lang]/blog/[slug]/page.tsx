import { notFound } from "next/navigation";
import { client } from "@/lib/sanity/sanity";
import { postBySlugQuery } from "@/lib/sanity/sanity-queries/postBySlugQuery";
import { postSlugsQuery } from "@/lib/sanity/sanity-queries/postSlugsQuery";
import { RichText } from "@/components/portable-text";
import { hasLocale } from "@/app/[lang]/dictionaries";
import { locales } from "@/proxy";

export const revalidate = 600;

export const dynamicParams = true;


type ImageGalleryItem = {
    _type: "image";
    asset: {
        url: string;
    };
    alt?: string;
};

type YouTubeGalleryItem = {
    _type: "youtube";
    url: string;
    title?: string;
};

type GalleryItem = ImageGalleryItem | YouTubeGalleryItem;

type Post = {
    _id: string;
    slug: string;
    title: string;
    publishedAt?: string;
    body: unknown[];
    hero?: {
        kind?: "image" | "youtube";
        caption?: string;
        image?: {
            asset?: { url?: string };
            alt?: string;
        };
        youtube?: { url?: string };
    };
    gallery?: GalleryItem[];
};

type PageProps = {
    params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
    const rows = await client.fetch<Array<{ slug: string }>>(postSlugsQuery);

    return locales.flatMap((lang) => rows.map((r) => ({ lang, slug: r.slug })));
}

function YouTubeEmbed({ url }: { url: string }) {
    const id = extractYouTubeId(url);
    if (!id) return null;

    return (
        <div className="aspect-video w-full overflow-hidden rounded-xl border">
            <iframe
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
}

function extractYouTubeId(url: string): string | null {
    try {
        const u = new URL(url);
        if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
        if (u.hostname.includes("youtube.com")) return u.searchParams.get("v");
        return null;
    } catch {
        return null;
    }
}

export default async function Page({ params }: PageProps) {
    const { lang, slug } = await params;

    if (!hasLocale(lang)) notFound();

    const post = await client.fetch<Post | null>(postBySlugQuery, { slug, lang });
    if (!post) notFound();

    return (
        <article className="mx-auto max-w-3xl space-y-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
                {post.publishedAt ? (
                    <p className="text-sm text-muted-foreground">
                        {new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")}
                    </p>
                ) : null}
            </header>

            {post.hero?.kind === "image" && post.hero?.image?.asset?.url ? (
                <figure className="space-y-2">
                    <img
                        src={post.hero.image.asset.url}
                        alt={post.hero.image.alt ?? post.title}
                        className="w-full rounded-xl border"
                    />
                    {post.hero.caption ? (
                        <figcaption className="text-sm text-muted-foreground">{post.hero.caption}</figcaption>
                    ) : null}
                </figure>
            ) : null}

            {post.hero?.kind === "youtube" && post.hero?.youtube?.url ? (
                <div className="space-y-2">
                    <YouTubeEmbed url={post.hero.youtube.url} />
                    {post.hero.caption ? <p className="text-sm text-muted-foreground">{post.hero.caption}</p> : null}
                </div>
            ) : null}

            {/* BODY */}
            <div className="prose prose-neutral max-w-none dark:prose-invert">
                <RichText value={post.body} />
            </div>

            {/* GALLERY */}
            {Array.isArray(post.gallery) && post.gallery.length > 0 ? (
                <section className="space-y-4 pt-8">
                    <h2 className="text-xl font-semibold">Gallery</h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {post.gallery.map((item, idx: number) => {
                            if (item?._type === "image" && item?.asset?.url) {
                                return (
                                    <img
                                        key={`${idx}-img`}
                                        src={item.asset.url}
                                        alt={item.alt ?? ""}
                                        className="w-full rounded-xl border"
                                    />
                                );
                            }

                            if (item?._type === "youtube" && typeof item.url === "string") {
                                return <YouTubeEmbed key={`${idx}-yt`} url={item.url} />;
                            }

                            return null;
                        })}
                    </div>
                </section>
            ) : null}
        </article>
    );
}