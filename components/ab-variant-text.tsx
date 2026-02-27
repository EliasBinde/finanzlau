"use client";

type AbVariantTextProps = {
    items: readonly string[];
};

function hashString(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function AbVariantText({items}: AbVariantTextProps) {
    if (items.length === 0) return null;
    if (items.length === 1) return <span>{items[0]}</span>;

    const fingerprint =
        typeof navigator === "undefined"
            ? ""
            : `${navigator.userAgent}|${navigator.language}|${navigator.platform}`;

    const index = hashString(fingerprint) % items.length;

    return <span suppressHydrationWarning>{items[index]}</span>;
}
