"use client";
// Normal text flow keeps headings readable without animation and avoids per-word line-height gaps.
export default function RevealText({ text, as: Tag = "span", className }: { text: string; as?: "h1" | "h2" | "h3" | "p" | "span"; className?: string; delay?: number; immediate?: boolean }) { return <Tag className={className}>{text}</Tag>; }
