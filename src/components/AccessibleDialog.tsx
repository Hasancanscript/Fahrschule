"use client";
import TranslatedContent from "@/components/TranslatedContent";

import { useEffect, useId, useRef } from "react";
export default function AccessibleDialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null), heading = useRef<HTMLHeadingElement>(null), titleId = useId();
  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) { element.showModal(); heading.current?.focus(); }
    else if (!open && element?.open) element.close();
  }, [open]);
  return <TranslatedContent>{<dialog lang="de" ref={dialog} aria-labelledby={titleId} onCancel={event => { event.preventDefault(); onClose(); }} className="m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-2xl border border-ink/15 bg-white p-6 text-ink shadow-2xl backdrop:bg-ink/50 sm:p-8">
    <div className="flex items-start justify-between gap-4"><h2 ref={heading} tabIndex={-1} id={titleId} className="text-xl font-bold outline-none">{title}</h2><button type="button" onClick={onClose} aria-label="Dialog schliessen" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ink/30 text-lg">×</button></div>
    <div className="mt-5">{children}</div>
  </dialog>}</TranslatedContent>;
}
