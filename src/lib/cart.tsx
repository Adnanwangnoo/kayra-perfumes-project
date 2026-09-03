import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { BRAND, getProduct, type Product } from "@/lib/products";
import { track } from "@/lib/analytics";

export type CartLine = {
  slug: string;
  sku: string;
  size: string;
  quantity: number;
};

export type ResolvedLine = CartLine & {
  product: Product;
  unitPrice: number;
  lineTotal: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (slug: string, sku: string, quantity?: number) => void;
  remove: (sku: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
  clear: () => void;
  resolved: ResolvedLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
};

const CartContext = createContext<CartState | null>(null);
const STORAGE_KEY = "kayra.cart.v1";

const readStored = (): CartLine[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        !!l && typeof l === "object" && "sku" in l && "slug" in l && "quantity" in l,
    );
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Hydration-safe: read storage after mount only.
  useEffect(() => {
    setLines(readStored());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((slug: string, sku: string, quantity = 1) => {
    const product = getProduct(slug);
    const variant = product?.variants.find((v) => v.sku === sku);
    if (!product || !variant) return;

    setLines((prev) => {
      const existing = prev.find((l) => l.sku === sku);
      if (existing) {
        return prev.map((l) =>
          l.sku === sku ? { ...l, quantity: Math.min(l.quantity + quantity, 20) } : l,
        );
      }
      return [...prev, { slug, sku, size: variant.size, quantity }];
    });
    setIsOpen(true);
    track("add_to_cart", { slug, sku, size: variant.size, price: variant.price, quantity });
  }, []);

  const remove = useCallback((sku: string) => {
    setLines((prev) => prev.filter((l) => l.sku !== sku));
    track("remove_from_cart", { sku });
  }, []);

  const setQuantity = useCallback((sku: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.sku !== sku)
        : prev.map((l) => (l.sku === sku ? { ...l, quantity: Math.min(quantity, 20) } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const resolved = useMemo<ResolvedLine[]>(
    () =>
      lines.flatMap((line) => {
        const product = getProduct(line.slug);
        const variant = product?.variants.find((v) => v.sku === line.sku);
        if (!product || !variant) return [];
        return [
          {
            ...line,
            product,
            unitPrice: variant.price,
            lineTotal: variant.price * line.quantity,
          },
        ];
      }),
    [lines],
  );

  const subtotal = resolved.reduce((sum, l) => sum + l.lineTotal, 0);
  const shipping =
    subtotal === 0 || subtotal >= BRAND.shippingThreshold ? 0 : BRAND.shippingFlat;

  const value: CartState = {
    lines,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    add,
    remove,
    setQuantity,
    clear,
    resolved,
    count: resolved.reduce((n, l) => n + l.quantity, 0),
    subtotal,
    shipping,
    total: subtotal + shipping,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
