import p1 from "@/assets/products/p1.jpg";
import p2 from "@/assets/products/p2.jpg";
import p3 from "@/assets/products/p3.jpg";
import p4 from "@/assets/products/p4.jpg";
import p5 from "@/assets/products/p5.jpg";
import p6 from "@/assets/products/p6.jpg";
import p7 from "@/assets/products/p7.jpg";
import p8 from "@/assets/products/p8.jpg";
import p9 from "@/assets/products/p9.jpg";
import p10 from "@/assets/products/p10.jpg";
import p11 from "@/assets/products/p11.jpg";
import p12 from "@/assets/products/p12.jpg";
import p13 from "@/assets/products/p13.jpg";
import p14 from "@/assets/products/p14.jpg";
import p15 from "@/assets/products/p15.jpg";
import p16 from "@/assets/products/p16.jpg";
import p17 from "@/assets/products/p17.jpg";
import p18 from "@/assets/products/p18.jpg";
import p19 from "@/assets/products/p19.jpg";
import p20 from "@/assets/products/p20.jpg";
import p21 from "@/assets/products/p21.jpg";
import p22 from "@/assets/products/p22.jpg";
import catMen from "@/assets/cat-men.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catAccessories from "@/assets/cat-accessories.jpg";
import lookbook from "@/assets/lookbook.jpg";

export type Category = "Men" | "Women" | "Accessories";

export interface Review {
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  type: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  rating: number;
  reviewCount: number;
  description: string;
  specifications: Record<string, string>;
  inStock: boolean;
  addedOn: string;
  popularity: number;
  tags: Array<"new" | "bestseller" | "trending">;
  reviews: Review[];
}

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL"];
const BOTTOM_SIZES = ["28", "30", "32", "34", "36"];
const SHOE_SIZES = ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10"];
const ONE_SIZE = ["One Size"];

function reviews(names: string[], titles: string[], bodies: string[], ratings: number[]): Review[] {
  return names.map((author, i) => ({
    author,
    rating: ratings[i] ?? 5,
    date: `2026-0${(i % 8) + 1}-1${i}`,
    title: titles[i] ?? "",
    body: bodies[i] ?? "",
  }));
}

const genericReviews = (product: string): Review[] =>
  reviews(
    ["Ananya R.", "Vikram S.", "Meera T."],
    ["Worth every rupee", "Beautifully made", "Exactly as pictured"],
    [
      `The ${product} arrived beautifully packed and the finish is far better than the price suggests.`,
      `Fabric quality is excellent and the cut is true to size. I've worn it weekly since it arrived.`,
      `Colour and texture match the photographs precisely. Delivery took four days.`,
    ],
    [5, 4, 5],
  );

export const products: Product[] = [
  {
    id: "lx-001",
    name: "Stone-Wash Cotton Tee",
    category: "Men",
    type: "T-shirts",
    price: 2490,
    originalPrice: 3100,
    images: [p1, catMen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Chalk", "Charcoal", "Sand"],
    rating: 4.8,
    reviewCount: 212,
    description:
      "A boxy, garment-dyed tee cut from 240gsm long-staple cotton. Washed over stone for a softened hand that only improves with wear.",
    specifications: {
      Material: "100% long-staple cotton",
      Weight: "240 gsm",
      Fit: "Relaxed, boxy",
      Care: "Machine wash cold, dry flat",
      Origin: "Made in Portugal",
    },
    inStock: true,
    addedOn: "2026-08-02",
    popularity: 96,
    tags: ["bestseller", "trending"],
    reviews: genericReviews("tee"),
  },
  {
    id: "lx-002",
    name: "Oxford Button-Down Shirt",
    category: "Men",
    type: "Shirts",
    price: 4290,
    originalPrice: 5200,
    images: [p2, catMen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Pale Blue", "Chalk", "Stone"],
    rating: 4.7,
    reviewCount: 148,
    description:
      "The house oxford, woven in Japan and finished with a soft roll collar. An honest shirt that carries a decade of wear.",
    specifications: {
      Material: "100% Japanese oxford cotton",
      Collar: "Soft button-down",
      Fit: "Regular",
      Care: "Machine wash warm, warm iron",
      Origin: "Made in India",
    },
    inStock: true,
    addedOn: "2026-07-18",
    popularity: 88,
    tags: ["bestseller"],
    reviews: genericReviews("shirt"),
  },
  {
    id: "lx-003",
    name: "Selvedge Straight Jeans",
    category: "Men",
    type: "Jeans",
    price: 6890,
    images: [p3, catMen, lookbook],
    sizes: BOTTOM_SIZES,
    colors: ["Raw Indigo", "Washed Black"],
    rating: 4.9,
    reviewCount: 96,
    description:
      "14.5oz raw selvedge denim on a straight leg. Unsanforised, so it fades to the shape of whoever wears it.",
    specifications: {
      Material: "14.5oz selvedge denim",
      Fit: "Straight, mid-rise",
      Hardware: "Copper rivets, tack buttons",
      Care: "Wash sparingly, inside out",
      Origin: "Woven in Okayama",
    },
    inStock: true,
    addedOn: "2026-06-11",
    popularity: 84,
    tags: ["bestseller"],
    reviews: genericReviews("pair of jeans"),
  },
  {
    id: "lx-004",
    name: "Camel Wool Overcoat",
    category: "Men",
    type: "Jackets",
    price: 18900,
    originalPrice: 24500,
    images: [p4, lookbook, catMen],
    sizes: APPAREL_SIZES,
    colors: ["Camel", "Charcoal"],
    rating: 5,
    reviewCount: 64,
    description:
      "A single-breasted overcoat in a wool and cashmere melton, cut long and lean with a half-canvas chest.",
    specifications: {
      Material: "80% wool, 20% cashmere",
      Lining: "Bemberg cupro",
      Fit: "Tailored, knee length",
      Care: "Dry clean only",
      Origin: "Made in Italy",
    },
    inStock: true,
    addedOn: "2026-08-20",
    popularity: 91,
    tags: ["new", "trending"],
    reviews: genericReviews("overcoat"),
  },
  {
    id: "lx-005",
    name: "Merino Crewneck Sweater",
    category: "Men",
    type: "Knitwear",
    price: 7450,
    originalPrice: 8900,
    images: [p5, catMen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Charcoal", "Oat", "Navy"],
    rating: 4.6,
    reviewCount: 132,
    description:
      "Fine-gauge extra-fine merino knitted in a clean crew. Light enough for a layer, warm enough on its own.",
    specifications: {
      Material: "100% extra-fine merino wool",
      Gauge: "14gg",
      Fit: "Regular",
      Care: "Hand wash cold, dry flat",
      Origin: "Made in Scotland",
    },
    inStock: true,
    addedOn: "2026-07-02",
    popularity: 79,
    tags: ["bestseller"],
    reviews: genericReviews("sweater"),
  },
  {
    id: "lx-006",
    name: "Heavyweight Loopback Hoodie",
    category: "Men",
    type: "Hoodies",
    price: 5490,
    images: [p6, catMen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Heather Grey", "Black", "Ecru"],
    rating: 4.7,
    reviewCount: 187,
    description:
      "460gsm loopback cotton with a twin-panel hood and ribbed cuffs. Built dense so it holds its shape.",
    specifications: {
      Material: "100% loopback cotton",
      Weight: "460 gsm",
      Fit: "Oversized",
      Care: "Machine wash cold",
      Origin: "Made in Portugal",
    },
    inStock: true,
    addedOn: "2026-08-12",
    popularity: 93,
    tags: ["new", "trending"],
    reviews: genericReviews("hoodie"),
  },
  {
    id: "lx-007",
    name: "Undyed Linen Shirt",
    category: "Men",
    type: "Shirts",
    price: 4990,
    originalPrice: 5900,
    images: [p7, catMen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Natural", "Chalk"],
    rating: 4.5,
    reviewCount: 74,
    description:
      "European flax, left undyed and washed twice. A shirt for heat, creased exactly as it should be.",
    specifications: {
      Material: "100% European flax linen",
      Fit: "Relaxed",
      Detail: "Single patch pocket",
      Care: "Machine wash cold, line dry",
      Origin: "Made in India",
    },
    inStock: true,
    addedOn: "2026-05-28",
    popularity: 68,
    tags: [],
    reviews: genericReviews("linen shirt"),
  },
  {
    id: "lx-008",
    name: "Cotton Twill Field Jacket",
    category: "Men",
    type: "Jackets",
    price: 9800,
    images: [p8, catMen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Olive", "Stone"],
    rating: 4.6,
    reviewCount: 58,
    description:
      "Four-pocket field jacket in a dry cotton twill with corozo buttons and a clean, unlined body.",
    specifications: {
      Material: "100% cotton twill",
      Buttons: "Corozo",
      Fit: "Regular",
      Care: "Machine wash cold",
      Origin: "Made in India",
    },
    inStock: false,
    addedOn: "2026-04-14",
    popularity: 61,
    tags: [],
    reviews: genericReviews("field jacket"),
  },
  {
    id: "lx-009",
    name: "Silk Bias Slip Dress",
    category: "Women",
    type: "Dresses",
    price: 12400,
    originalPrice: 15900,
    images: [p9, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Champagne", "Ink", "Sage"],
    rating: 4.9,
    reviewCount: 241,
    description:
      "Cut on the bias from 22-momme sand-washed silk so it falls without clinging. Adjustable straps, French seams throughout.",
    specifications: {
      Material: "100% mulberry silk, 22 momme",
      Finish: "Sand-washed",
      Fit: "Bias cut, midi length",
      Care: "Dry clean or hand wash cold",
      Origin: "Made in Italy",
    },
    inStock: true,
    addedOn: "2026-08-25",
    popularity: 98,
    tags: ["new", "bestseller", "trending"],
    reviews: genericReviews("slip dress"),
  },
  {
    id: "lx-010",
    name: "Pleated Midi Skirt",
    category: "Women",
    type: "Skirts",
    price: 8900,
    images: [p10, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Ecru", "Black"],
    rating: 4.6,
    reviewCount: 98,
    description:
      "Knife pleats set into a clean waistband, heat-pressed to hold their line wash after wash.",
    specifications: {
      Material: "Recycled polyester crepe",
      Fit: "High waist, midi",
      Closure: "Concealed side zip",
      Care: "Machine wash cold, hang dry",
      Origin: "Made in India",
    },
    inStock: true,
    addedOn: "2026-07-30",
    popularity: 77,
    tags: ["new"],
    reviews: genericReviews("skirt"),
  },
  {
    id: "lx-011",
    name: "Ivory Tailored Blazer",
    category: "Women",
    type: "Jackets",
    price: 15600,
    originalPrice: 18900,
    images: [p11, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Ivory", "Black"],
    rating: 4.8,
    reviewCount: 83,
    description:
      "A single-button blazer with a softly structured shoulder and a lengthened lapel. Cut from Italian wool crepe.",
    specifications: {
      Material: "96% wool, 4% elastane",
      Lining: "Viscose twill",
      Fit: "Tailored",
      Care: "Dry clean only",
      Origin: "Made in Italy",
    },
    inStock: true,
    addedOn: "2026-08-08",
    popularity: 86,
    tags: ["trending"],
    reviews: genericReviews("blazer"),
  },
  {
    id: "lx-012",
    name: "Cashmere V-Neck Cardigan",
    category: "Women",
    type: "Knitwear",
    price: 13900,
    images: [p12, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Oat", "Dove", "Ink"],
    rating: 4.9,
    reviewCount: 117,
    description:
      "Grade-A Inner Mongolian cashmere, two-ply and knitted loosely so it drapes rather than holds.",
    specifications: {
      Material: "100% grade-A cashmere",
      Ply: "2-ply, 12gg",
      Fit: "Relaxed",
      Care: "Hand wash cold, dry flat",
      Origin: "Made in Scotland",
    },
    inStock: true,
    addedOn: "2026-06-22",
    popularity: 90,
    tags: ["bestseller"],
    reviews: genericReviews("cardigan"),
  },
  {
    id: "lx-013",
    name: "Wide-Leg Tailored Trousers",
    category: "Women",
    type: "Trousers",
    price: 7900,
    originalPrice: 9500,
    images: [p13, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Black", "Stone", "Chocolate"],
    rating: 4.7,
    reviewCount: 156,
    description:
      "A high-rise trouser with a pressed crease and a full, floor-skimming leg. Quietly formal, endlessly wearable.",
    specifications: {
      Material: "Wool-blend suiting",
      Fit: "High rise, wide leg",
      Detail: "Front pleats, side pockets",
      Care: "Dry clean recommended",
      Origin: "Made in India",
    },
    inStock: true,
    addedOn: "2026-07-14",
    popularity: 89,
    tags: ["bestseller"],
    reviews: genericReviews("pair of trousers"),
  },
  {
    id: "lx-014",
    name: "Cropped Denim Jacket",
    category: "Women",
    type: "Jackets",
    price: 6490,
    images: [p14, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Light Wash", "Ecru"],
    rating: 4.4,
    reviewCount: 71,
    description:
      "A shortened trucker in rigid denim with a shrunken body and a sharp, squared hem.",
    specifications: {
      Material: "100% cotton denim, 11oz",
      Fit: "Cropped",
      Closure: "Six-button placket",
      Care: "Machine wash cold, inside out",
      Origin: "Made in India",
    },
    inStock: true,
    addedOn: "2026-05-05",
    popularity: 64,
    tags: [],
    reviews: genericReviews("denim jacket"),
  },
  {
    id: "lx-015",
    name: "Ribbed Knit Midi Dress",
    category: "Women",
    type: "Dresses",
    price: 9400,
    originalPrice: 11200,
    images: [p15, catWomen, lookbook],
    sizes: APPAREL_SIZES,
    colors: ["Taupe", "Black", "Cream"],
    rating: 4.7,
    reviewCount: 129,
    description:
      "A fine rib knitted in the round with no side seams, so it follows the body without pulling.",
    specifications: {
      Material: "Viscose-wool rib",
      Fit: "Body-skimming, midi",
      Detail: "Seamless construction",
      Care: "Hand wash cold, dry flat",
      Origin: "Made in Portugal",
    },
    inStock: true,
    addedOn: "2026-08-18",
    popularity: 87,
    tags: ["new", "trending"],
    reviews: genericReviews("knit dress"),
  },
  {
    id: "lx-016",
    name: "Structured Leather Tote",
    category: "Accessories",
    type: "Bags",
    price: 21500,
    originalPrice: 25400,
    images: [p16, catAccessories, lookbook],
    sizes: ONE_SIZE,
    colors: ["Taupe", "Black", "Tan"],
    rating: 4.7,
    reviewCount: 143,
    description:
      "Full-grain pebbled calf leather over a rigid frame, with a suede-lined interior and a removable pouch.",
    specifications: {
      Material: "Full-grain calf leather",
      Lining: "Suede",
      Dimensions: "34 × 28 × 14 cm",
      Care: "Wipe with a dry cloth",
      Origin: "Made in Italy",
    },
    inStock: true,
    addedOn: "2026-07-26",
    popularity: 92,
    tags: ["bestseller", "trending"],
    reviews: genericReviews("tote"),
  },
  {
    id: "lx-017",
    name: "Brushed Steel Automatic Watch",
    category: "Accessories",
    type: "Watches",
    price: 32900,
    images: [p17, catAccessories, lookbook],
    sizes: ONE_SIZE,
    colors: ["Steel"],
    rating: 4.9,
    reviewCount: 88,
    description:
      "A 38mm automatic with a lacquered white dial, sapphire crystal and a 41-hour power reserve.",
    specifications: {
      Movement: "Automatic, 41h reserve",
      Case: "38mm brushed stainless steel",
      Crystal: "Sapphire, anti-reflective",
      "Water resistance": "100m",
      Origin: "Assembled in Switzerland",
    },
    inStock: true,
    addedOn: "2026-08-04",
    popularity: 85,
    tags: ["new"],
    reviews: genericReviews("watch"),
  },
  {
    id: "lx-018",
    name: "Acetate Square Sunglasses",
    category: "Accessories",
    type: "Sunglasses",
    price: 8900,
    originalPrice: 10900,
    images: [p18, catAccessories, lookbook],
    sizes: ONE_SIZE,
    colors: ["Tortoise", "Black"],
    rating: 4.6,
    reviewCount: 104,
    description:
      "Hand-polished Mazzucchelli acetate with mineral glass lenses and a keyhole bridge.",
    specifications: {
      Frame: "Mazzucchelli acetate",
      Lenses: "Mineral glass, UV400",
      Fit: "Medium, 50-22-145",
      Included: "Leather case and cloth",
      Origin: "Made in Italy",
    },
    inStock: true,
    addedOn: "2026-06-30",
    popularity: 74,
    tags: [],
    reviews: genericReviews("pair of sunglasses"),
  },
  {
    id: "lx-019",
    name: "Leather Crossbody Bag",
    category: "Accessories",
    type: "Bags",
    price: 14900,
    images: [p19, catAccessories, lookbook],
    sizes: ONE_SIZE,
    colors: ["Black", "Tan"],
    rating: 4.8,
    reviewCount: 97,
    description:
      "A compact saddle silhouette with a brass turn-lock and an adjustable strap that shortens to a shoulder bag.",
    specifications: {
      Material: "Pebbled calf leather",
      Hardware: "Solid brass",
      Dimensions: "22 × 17 × 7 cm",
      Care: "Store in dust bag",
      Origin: "Made in Italy",
    },
    inStock: true,
    addedOn: "2026-08-15",
    popularity: 83,
    tags: ["new"],
    reviews: genericReviews("crossbody bag"),
  },
  {
    id: "lx-020",
    name: "Leather Low-Top Sneakers",
    category: "Accessories",
    type: "Sneakers",
    price: 11900,
    originalPrice: 13900,
    images: [p20, catAccessories, lookbook],
    sizes: SHOE_SIZES,
    colors: ["White", "Off-White"],
    rating: 4.7,
    reviewCount: 168,
    description:
      "A stripped-back court shoe in full-grain leather on a blake-stitched rubber cup sole.",
    specifications: {
      Upper: "Full-grain leather",
      Sole: "Vulcanised rubber cup",
      Lining: "Vegetable-tanned leather",
      Care: "Brush and condition monthly",
      Origin: "Made in Portugal",
    },
    inStock: true,
    addedOn: "2026-07-08",
    popularity: 94,
    tags: ["bestseller", "trending"],
    reviews: genericReviews("pair of sneakers"),
  },
  {
    id: "lx-021",
    name: "Suede Chelsea Boots",
    category: "Accessories",
    type: "Boots",
    price: 17400,
    images: [p21, catAccessories, lookbook],
    sizes: SHOE_SIZES,
    colors: ["Chocolate", "Sand"],
    rating: 4.8,
    reviewCount: 76,
    description:
      "Goodyear-welted chelseas in Italian calf suede, with twin elastic gores and a leather-stacked heel.",
    specifications: {
      Upper: "Italian calf suede",
      Construction: "Goodyear welted",
      Sole: "Leather with rubber insert",
      Care: "Brush and protect before wear",
      Origin: "Made in Spain",
    },
    inStock: true,
    addedOn: "2026-06-02",
    popularity: 72,
    tags: [],
    reviews: genericReviews("pair of boots"),
  },
  {
    id: "lx-022",
    name: "Lambswool Fringed Scarf",
    category: "Accessories",
    type: "Scarves",
    price: 4600,
    originalPrice: 5800,
    images: [p22, catAccessories, lookbook],
    sizes: ONE_SIZE,
    colors: ["Grey", "Camel", "Ink"],
    rating: 4.5,
    reviewCount: 62,
    description:
      "Woven on Scottish looms from soft lambswool, finished with a hand-knotted fringe.",
    specifications: {
      Material: "100% lambswool",
      Dimensions: "180 × 32 cm",
      Finish: "Hand-knotted fringe",
      Care: "Dry clean only",
      Origin: "Woven in Scotland",
    },
    inStock: true,
    addedOn: "2026-05-19",
    popularity: 58,
    tags: [],
    reviews: genericReviews("scarf"),
  },
];

export const categories: Array<{
  name: Category;
  blurb: string;
  image: string;
  count: number;
}> = [
  {
    name: "Men",
    blurb: "Tailoring, knitwear and denim",
    image: catMen,
    count: products.filter((p) => p.category === "Men").length,
  },
  {
    name: "Women",
    blurb: "Silk, wool and clean lines",
    image: catWomen,
    count: products.filter((p) => p.category === "Women").length,
  },
  {
    name: "Accessories",
    blurb: "Leather, steel and acetate",
    image: catAccessories,
    count: products.filter((p) => p.category === "Accessories").length,
  },
];

export const allSizes = Array.from(new Set(products.flatMap((p) => p.sizes)));
export const allColors = Array.from(new Set(products.flatMap((p) => p.colors))).sort();
export const priceBounds: [number, number] = [
  0,
  Math.ceil(Math.max(...products.map((p) => p.price)) / 1000) * 1000,
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export const newArrivals = [...products]
  .sort((a, b) => b.addedOn.localeCompare(a.addedOn))
  .slice(0, 4);

export const bestSellers = products.filter((p) => p.tags.includes("bestseller")).slice(0, 4);

export const trending = products.filter((p) => p.tags.includes("trending")).slice(0, 4);

export const testimonials = [
  {
    quote:
      "The overcoat has outlasted three winters and still looks like the day it arrived. Nothing else in my wardrobe comes close.",
    author: "Ishita Bhardwaj",
    role: "Architect, Mumbai",
  },
  {
    quote:
      "I ordered the slip dress for a wedding and ended up wearing it every other week. The silk is genuinely exceptional.",
    author: "Rhea Menon",
    role: "Editor, Bengaluru",
  },
  {
    quote:
      "Sizing was accurate, delivery took three days, and returns were painless. This is how a store should work.",
    author: "Karan Deshmukh",
    role: "Photographer, Delhi",
  },
];

export const coupons: Record<string, { type: "percent" | "flat"; value: number; label: string }> = {
  LUXORA10: { type: "percent", value: 10, label: "10% off your order" },
  WELCOME500: { type: "flat", value: 500, label: "₹500 off" },
  ATELIER20: { type: "percent", value: 20, label: "20% off your order" },
};
