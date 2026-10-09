"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
export default function NavDropdown({
  label,
  links,
  mobile = false,
  onNavigate,
  children,
}: {
  label: string;
  links: { href: string; label: string }[];
  mobile?: boolean;
  onNavigate?: () => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false),
    root = useRef<HTMLDivElement>(null),
    button = useRef<HTMLButtonElement>(null),
    id = useId();
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`flex min-h-11 items-center gap-2 font-medium transition hover:text-accent-dark ${mobile ? "w-full justify-between" : ""}`}
      >
        {label}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          className="h-3.5 w-3.5"
        >
          <path
            d={open ? "m4 10 4-4 4 4" : "m4 6 4 4 4-4"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      {open && (
        <div
          id={id}
          className={
            mobile
              ? "mt-1 rounded-xl border border-ink/10 bg-white p-2"
              : "absolute right-0 top-full mt-2 w-64 rounded-2xl border border-ink/10 bg-white p-2 shadow-xl"
          }
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-11 items-center rounded-xl px-4 py-2 text-sm hover:bg-surface-2 hover:text-accent-dark"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
            >
              {link.label}
            </Link>
          ))}
          {children && (
            <div className="mt-2 border-t border-ink/10 p-2">{children}</div>
          )}
        </div>
      )}
    </div>
  );
}
