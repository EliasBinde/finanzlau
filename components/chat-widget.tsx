"use client";

import * as React from "react";
import {MessageCircle, X, Send, ArrowRight, Info} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {cn} from "@/lib/utils";
import Link from "next/link";

type Message = {
    id: number;
    role: "bot" | "user";
    text: string;
};

type ApiMessage = {
    role: "user" | "assistant";
    content: string;
};

type Cta = { href: string; label: string };

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        role: "bot",
        text: "Hallo! Ich bin der FINANZLAU-Assistent. Wie kann ich Ihnen heute helfen?",
    },
];

// ── Inline markdown renderer ─────────────────────────────────────────────────

function parseInline(text: string): React.ReactNode[] {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("*") && part.endsWith("*"))
            return <em key={i}>{part.slice(1, -1)}</em>;
        return part;
    });
}

function parseBotText(raw: string): { nodes: React.ReactNode; ctas: Cta[] } {
    // Extract [CTA:/path|Label] tokens
    const ctaRegex = /\[CTA:([^|]+)\|([^\]]+)\]/g;
    const ctas: Cta[] = [];
    const cleaned = raw
        .replace(ctaRegex, (_, href, label) => {
            ctas.push({href: href.trim(), label: label.trim()});
            return "";
        })
        .trim();

    const lines = cleaned.split("\n");
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        if (!line.trim()) {
            i++;
            continue;
        }

        // Headings → bold paragraph
        if (/^#{1,3} /.test(line)) {
            const content = line.replace(/^#{1,3} /, "");
            nodes.push(<p key={i} className="font-semibold">{parseInline(content)}</p>);
            i++;
            continue;
        }

        // Bullet list – collect consecutive items
        if (/^[-*] /.test(line)) {
            const items: React.ReactNode[] = [];
            while (i < lines.length && /^[-*] /.test(lines[i])) {
                items.push(<li key={i}>{parseInline(lines[i].slice(2))}</li>);
                i++;
            }
            nodes.push(
                <ul key={`ul${i}`} className="ml-4 list-disc space-y-0.5">
                    {items}
                </ul>
            );
            continue;
        }

        // Numbered list
        if (/^\d+\. /.test(line)) {
            const items: React.ReactNode[] = [];
            while (i < lines.length && /^\d+\. /.test(lines[i])) {
                items.push(<li key={i}>{parseInline(lines[i].replace(/^\d+\. /, ""))}</li>);
                i++;
            }
            nodes.push(
                <ol key={`ol${i}`} className="ml-4 list-decimal space-y-0.5">
                    {items}
                </ol>
            );
            continue;
        }

        nodes.push(<p key={i}>{parseInline(line)}</p>);
        i++;
    }

    return {nodes: <div className="space-y-1.5">{nodes}</div>, ctas};
}

// ── Bot message component ─────────────────────────────────────────────────────

function BotMessageContent({text, lang}: { text: string; lang: string }) {
    const {nodes, ctas} = parseBotText(text);
    return (
        <div className="space-y-2">
            <div>{nodes}</div>
            {ctas.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-0.5">
                    {ctas.map((cta, i) => (
                        <Link key={i} href={`/${lang}${cta.href}`}>
                            <Button size="xs" variant="outline" className="gap-1">
                                {cta.label}
                                <ArrowRight className="h-3 w-3"/>
                            </Button>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Widget ────────────────────────────────────────────────────────────────────

export function ChatWidget({lang}: { lang: string }) {
    const [open, setOpen] = React.useState(true);
    const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
    const [history, setHistory] = React.useState<ApiMessage[]>([]);
    const [input, setInput] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const bottomRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({behavior: "smooth"});
            inputRef.current?.focus();
        }
    }, [open, messages]);

    async function handleSend() {
        const text = input.trim();
        if (!text || loading) return;

        const newHistory: ApiMessage[] = [...history, {role: "user", content: text}];
        setHistory(newHistory);
        setMessages((prev) => [...prev, {id: Date.now(), role: "user", text}]);
        setInput("");
        setLoading(true);

        const botId = Date.now() + 1;
        setMessages((prev) => [...prev, {id: botId, role: "bot", text: ""}]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({messages: newHistory}),
            });

            if (!res.ok || !res.body) throw new Error("Request failed");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let botText = "";

            while (true) {
                const {done, value} = await reader.read();
                if (done) break;
                botText += decoder.decode(value, {stream: true});
                setMessages((prev) =>
                    prev.map((m) => (m.id === botId ? {...m, text: botText} : m))
                );
                bottomRef.current?.scrollIntoView({behavior: "smooth"});
            }

            setHistory((prev) => [...prev, {role: "assistant", content: botText}]);
        } catch {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === botId
                        ? {...m, text: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."}
                        : m
                )
            );
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
            {/* Chat window */}
            {open && (
                <div
                    className="flex h-[560px] w-80 flex-col overflow-hidden rounded-xl border bg-background shadow-xl sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b bg-primary px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div
                                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                                <MessageCircle className="h-4 w-4 text-primary-foreground"/>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-primary-foreground">FINANZLAU</p>
                                <p className="text-xs text-primary-foreground/70">Assistent</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button
                                        aria-label="Hinweis zur KI"
                                        className="flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[10px] text-white text-xs hover:bg-primary-foreground/25 transition-colors"
                                    >
                                        <Info className="h-2.5 w-2.5"/>
                                        KI kann Fehler machen.
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" className="max-w-56 text-center">
                                    KI kann Fehler machen. Für verbindliche Auskünfte empfehlen wir ein persönliches
                                    Beratungsgespräch.
                                </TooltipContent>
                            </Tooltip>
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setOpen(false)}
                                aria-label="Chat schließen"
                                className="text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                            >
                                <X className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={cn(
                                    "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                                    msg.role === "bot"
                                        ? "self-start bg-muted text-foreground"
                                        : "ml-auto bg-primary text-primary-foreground"
                                )}
                            >
                                {msg.role === "bot" ? (
                                    msg.text ? (
                                        <BotMessageContent text={msg.text} lang={lang}/>
                                    ) : (
                                        <span className="flex gap-1 items-center py-0.5">
                                            <span
                                                className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:0ms]"/>
                                            <span
                                                className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:150ms]"/>
                                            <span
                                                className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:300ms]"/>
                                        </span>
                                    )
                                ) : (
                                    msg.text
                                )}
                            </div>
                        ))}
                        <div ref={bottomRef}/>
                    </div>

                    {/* Input */}
                    <div className="border-t p-3">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Nachricht eingeben…"
                                disabled={loading}
                                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground disabled:opacity-50"
                            />
                            <Button
                                size="icon-sm"
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                aria-label="Nachricht senden"
                            >
                                <Send className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle button */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? "Chat schließen" : "Chat öffnen"}
                aria-expanded={open}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                {open ? <X className="h-6 w-6"/> : <MessageCircle className="h-6 w-6"/>}
            </button>
        </div>
    );
}
