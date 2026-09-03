/**
 * Kayra product catalogue.
 *
 * Source of truth for now. All copy below is derived from Kayra's own product
 * labels and photography — sizes (6ml / 12ml), MRP (₹599 / ₹699), fragrance
 * notes, and the non-alcoholic formulation. Fields marked `editorial` are
 * brand copy that can be replaced through a CMS later without touching UI code.
 *
 * When the database/admin layer lands, this module keeps the same shape so
 * components do not change: swap the source, keep the types.
 */

export type NoteLayer = "top" | "heart" | "base";

export type ProductVariant = {
  size: string;
  /** price in paise (integer money, never floats) */
  price: number;
  sku: string;
};

export type Product = {
  slug: string;
  name: string;
  concentration: string;
  /** one-line fragrance identity */
  identity: string;
  /** short description used in cards and hero */
  summary: string;
  /** longer editorial story — replaceable brand copy */
  editorial: string;
  image: string;
  imageAlt: string;
  variants: ProductVariant[];
  notes: Record<NoteLayer, string[]>;
  longevity: string;
  projection: string;
  occasion: string;
  season: string;
  formulation: string;
  featured: boolean;
};

/**
 * Product photography is served from the local `public/images/` folder so the
 * build stays fully portable (self-hosting, Vercel, Netlify — no external CDN).
 */
const bloom = { url: "/images/bloom.jpg" };
const paris = { url: "/images/paris.jpg" };
const london = { url: "/images/london.jpg" };
const oudh = { url: "/images/signature-oudh.jpg" };

const variants = (skuPrefix: string): ProductVariant[] => [
  { size: "6 ml", price: 59900, sku: `${skuPrefix}-06` },
  { size: "12 ml", price: 69900, sku: `${skuPrefix}-12` },
];

export const products: Product[] = [
  {
    slug: "bloom",
    name: "Bloom",
    concentration: "Eau de Parfum",
    identity: "Bright · Amber · Airy",
    summary:
      "Cool mint and orange lifted over soft amber — the first light of a Kashmiri morning.",
    editorial:
      "Bloom opens the way spring opens in the valley: quietly, then all at once. Mint reads like air off snowmelt, orange warms it, and amber holds the whole thing close to the skin long after the day has moved on.",
    image: bloom.url,
    imageAlt: "Kayra Perfumes Bloom eau de parfum bottle in its black box among autumn leaves",
    variants: variants("BLO01"),
    notes: {
      top: ["Mint", "Orange"],
      heart: ["Orange blossom"],
      base: ["Amber"],
    },
    longevity: "6–8 hours on skin",
    projection: "Moderate, close to the wearer",
    occasion: "Daytime, work, everyday wear",
    season: "Spring and summer",
    formulation: "Non-alcoholic fragrance · Best before 48 months",
    featured: true,
  },
  {
    slug: "london",
    name: "London",
    concentration: "Eau de Parfum",
    identity: "Woody · Spiced · Refined",
    summary:
      "Bergamot and cardamom over musk, sandalwood and cedarwood. Tailored, quiet, certain.",
    editorial:
      "London is the most composed fragrance in the house — bergamot and lavender at the opening, cardamom and iris through the middle, and a long dry-down of sandalwood, cedarwood, musk and vanilla. Wear it when you want to be remembered rather than noticed.",
    image: london.url,
    imageAlt:
      "Kayra Perfumes London eau de parfum bottle in an open black box on a hand-painted Kashmiri tray",
    variants: variants("LON01"),
    notes: {
      top: ["Bergamot", "Lavender"],
      heart: ["Cardamom", "Iris"],
      base: ["Musk", "Sandalwood", "Cedarwood", "Vanilla"],
    },
    longevity: "8–10 hours on skin",
    projection: "Moderate to strong",
    occasion: "Evening, formal, winter gatherings",
    season: "Autumn and winter",
    formulation: "Non-alcoholic fragrance · Best before 48 months",
    featured: true,
  },
  {
    slug: "paris",
    name: "Paris",
    concentration: "Eau de Parfum",
    identity: "Floral · Fruity · Warm",
    summary: "Citrus and fruit into a floral heart, settled on amber and patchouli.",
    editorial:
      "Paris is unashamedly romantic. Fruit and citrus arrive first, a full floral heart follows, and amber with patchouli keeps it grounded — luminous at the top, warm where it rests.",
    image: paris.url,
    imageAlt: "Kayra Perfumes Paris eau de parfum bottle beside its black gold-foiled box",
    variants: variants("PAR01"),
    notes: {
      top: ["Citrus", "Fruits"],
      heart: ["Florals"],
      base: ["Amber", "Patchouli"],
    },
    longevity: "6–8 hours on skin",
    projection: "Moderate",
    occasion: "Dinner, celebrations, gifting",
    season: "All seasons",
    formulation: "Non-alcoholic fragrance · Best before 48 months",
    featured: true,
  },
  {
    slug: "signature-oudh",
    name: "Signature Oudh",
    concentration: "Eau de Parfum",
    identity: "Oudh · Resinous · Deep",
    summary: "Oudh and labdanum with vanilla and patchouli. The darkest note in the house.",
    editorial:
      "Signature Oudh is Kayra at its most serious. Oudh carries resin and smoke, labdanum adds a leathered sweetness, and vanilla softens the edge. Apply sparingly — one touch is the whole evening.",
    image: oudh.url,
    imageAlt:
      "Kayra Perfumes Signature Oudh eau de parfum bottle in front of a papier-mâché Kashmiri box",
    variants: variants("SOU01"),
    notes: {
      top: ["Labdanum"],
      heart: ["Patchouli"],
      base: ["Oudh", "Vanilla"],
    },
    longevity: "10+ hours on skin",
    projection: "Strong",
    occasion: "Evening, weddings, special occasions",
    season: "Autumn and winter",
    formulation: "Non-alcoholic fragrance · Best before 48 months",
    featured: true,
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const formatPrice = (paise: number): string =>
  `₹${(paise / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export const fromPrice = (product: Product): number =>
  Math.min(...product.variants.map((v) => v.price));

export const searchProducts = (query: string): Product[] => {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [
      p.name,
      p.identity,
      p.summary,
      p.concentration,
      p.occasion,
      p.season,
      ...Object.values(p.notes).flat(),
    ]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
};

export const BRAND = {
  name: "Kayra Perfumes",
  email: "kayraperfumes@gmail.com",
  phone: "+91 95963 63602",
  address: "Lal Bazar, Baghwanpora, Hakim Mohalla, Srinagar 190023, J&K, India",
  instagram: "https://www.instagram.com/kayraperfumes",
  shippingThreshold: 99900,
  shippingFlat: 6900,
} as const;
