"use client";

import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { useLanguage } from "@/lib/i18n";
import { translateUi, type UiLanguage } from "@/lib/ui-translations";

const textProps = new Set(["alt", "title", "placeholder", "label", "aria-label", "aria-description"]);

// Localize rendered content, including server-rendered legal pages. Only display
// attributes are translated: IDs, URLs, callbacks and form values are preserved.
function localize(node: ReactNode, lang: UiLanguage): ReactNode {
  if (typeof node === "string") return translateUi(node, lang);
  if (Array.isArray(node)) return Children.map(node, child => localize(child, lang));
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  if (node.props.translate === "no") return node;
  const props: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(node.props)) {
    if ((key === "children" && node.type !== "textarea") || key === "fallback") props.children = localize(value as ReactNode, lang);
    else if (textProps.has(key) && typeof value === "string") props[key] = translateUi(value, lang);
    else if (key === "lang" && (value === "de" || value === "fr")) props.lang = lang;
  }
  return cloneElement(node, props);
}

export default function TranslatedContent({ children }: { children: ReactNode }) {
  const { lang } = useLanguage();
  return localize(children, lang);
}
