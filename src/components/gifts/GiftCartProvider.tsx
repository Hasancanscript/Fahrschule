"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import {
  giftText,
  restoreCart,
  MAX_GIFTS,
  type GiftItem,
} from "@/lib/gift-shared";
type Cart = {
  items: GiftItem[];
  ready: boolean;
  storageError: boolean;
  add: (amountCents: number) => boolean;
  update: (
    id: string,
    patch: Partial<Pick<GiftItem, "recipient" | "message">>,
  ) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const Context = createContext<Cart | null>(null);
export const CART_KEY = "fahrschule-gift-cart-v1";
export function GiftCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<GiftItem[]>([]),
    [ready, setReady] = useState(false),
    [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate the persisted browser cart
      setItems(restoreCart(localStorage.getItem(CART_KEY)));
    } catch {
      setStorageError(true);
    }
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key === CART_KEY) setItems(restoreCart(e.newValue));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reflect a failed browser storage write
      setStorageError(true);
    }
  }, [items, ready]);
  const add = (amountCents: number) => {
    if (!ready || items.length >= MAX_GIFTS) return false;
    setItems((current) =>
      current.length >= MAX_GIFTS
        ? current
        : [
            ...current,
            {
              id: crypto.randomUUID(),
              amountCents,
              recipient: "",
              message: "",
            },
          ],
    );
    return true;
  };
  return (
    <Context.Provider
      value={{
        items,
        ready,
        storageError,
        add,
        update: (id, patch) =>
          setItems((current) =>
            current.map((i) => (i.id === id ? { ...i, ...patch } : i)),
          ),
        remove: (id) =>
          setItems((current) => current.filter((i) => i.id !== id)),
        clear: () => setItems([]),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useGiftCart() {
  const cart = useContext(Context);
  if (!cart) throw new Error("GiftCartProvider fehlt.");
  return cart;
}
export function CartButton() {
  const { items } = useGiftCart(),
    { lang } = useLanguage();
  return (
    <Link
      href="/warenkorb"
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark"
      aria-label={giftText(
        lang,
        `Warenkorb: ${items.length} Gutscheine`,
        `Panier: ${items.length} bons`,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      >
        <path d="M3 3h2l2.5 12h11l2-8H6" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {items.length > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-white"
        >
          {items.length}
        </span>
      )}
    </Link>
  );
}
