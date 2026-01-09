import * as React from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
    block: {
        h2: ({ children }) => <h2 className="mt-8 text-2xl font-semibold">{children}</h2>,
        normal: ({ children }) => <p className="mt-4 leading-7">{children}</p>,
    },
    list: {
        bullet: ({ children }) => <ul className="mt-4 list-disc pl-6">{children}</ul>,
        number: ({ children }) => <ol className="mt-4 list-decimal pl-6">{children}</ol>,
    },
    listItem: {
        bullet: ({ children }) => <li className="mt-2">{children}</li>,
        number: ({ children }) => <li className="mt-2">{children}</li>,
    },
};

export function RichText({ value }: { value: unknown }) {
    if (!Array.isArray(value)) return null;
    return <PortableText value={value} components={components} />;
}