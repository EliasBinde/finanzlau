"use client";

import * as React from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { UrlObject } from "url";

export type BlogPostListItem = {
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

type Props = {
  lang: "de" | "en";
  posts: BlogPostListItem[];
};

function withLangPath(lang: string, href: string) {
  const path = href === "/" ? `/${lang}` : `/${lang}${href}`;
  return { pathname: path } as UrlObject;
}

function blogPostHref(lang: string, slug: string): UrlObject {
  return {
    pathname: `/${lang}/blog/${slug}`,
  };
}

export function BlogPostList({ lang, posts }: Props) {
  const [query, setQuery] = React.useState("");

  const t = {
    readPost: lang === "de" ? "Beitrag lesen →" : "Read post →",
    ctaTitle: lang === "de" ? "Nicht gefunden, was du suchst?" : "Didn’t find what you were looking for?",
    ctaBody: lang === "de" ? "Schreib uns und wir helfen dir persönlich weiter." : "Write to us and we’ll help you directly.",
    ctaButton: lang === "de" ? "Kontakt" : "Contact",
    searchLabel: lang === "de" ? "Blog durchsuchen" : "Search blog",
    searchPlaceholder: lang === "de" ? "Nach Beiträgen suchen…" : "Search posts…",
    noResults: lang === "de" ? "Keine passenden Beiträge gefunden." : "No matching posts found.",
    empty: lang === "de" ? "Noch keine Beiträge." : "No posts yet.",
  } as const;

  const filteredPosts = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;

    const locale = lang === "de" ? "de-DE" : "en-US";

    return posts.filter((post) => {
      const date = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(locale) : "";
      const haystack = `${post.title} ${post.slug} ${date}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [lang, posts, query]);

  const firstPosts = filteredPosts.slice(0, 2);
  const remainingPosts = filteredPosts.slice(2);

  function renderPostCard(post: BlogPostListItem) {
    const date = post.publishedAt
      ? new Date(post.publishedAt).toLocaleDateString(lang === "de" ? "de-DE" : "en-US")
      : null;

    const heroImage = post.hero?.kind === "image" ? post.hero?.image?.asset?.url : null;

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

          <div className="text-sm font-medium">{t.readPost}</div>
        </div>
      </Link>
    );
  }

  const contactBanner = (
    <div className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t.ctaTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.ctaBody}</p>
        </div>
        <Link
          href={withLangPath(lang, "/contact")}
          className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          {t.ctaButton}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="blog-search" className="text-sm font-medium">
          {t.searchLabel}
        </label>
        <Input
          id="blog-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.searchPlaceholder}
        />
      </div>

      {posts.length === 0 ? (
        <div className="space-y-4">
          {contactBanner}
          <p className="text-sm text-muted-foreground">{t.empty}</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="space-y-4">
          {contactBanner}
          <p className="text-sm text-muted-foreground">{t.noResults}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">{firstPosts.map(renderPostCard)}</div>

          {contactBanner}

          {remainingPosts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">{remainingPosts.map(renderPostCard)}</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
