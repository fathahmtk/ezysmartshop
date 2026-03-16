import { Category, Coupon, Order, Product, User } from "../models/types";
import { catalogImages } from "./catalog-assets";

export const users: User[] = [
  {
    id: "usr-admin",
    name: "EZY Admin",
    email: "admin@ezysmartshop.com",
    password: "$2a$10$uQmM2xvB7IveZLh0Tn6PteWgsVYBoNvKcJsteVEh9UpAJZciV06Pq",
    role: "admin",
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "usr-customer",
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "$2a$10$uQmM2xvB7IveZLh0Tn6PteWgsVYBoNvKcJsteVEh9UpAJZciV06Pq",
    role: "customer",
    createdAt: "2026-03-16T00:00:00.000Z"
  }
];

export const categories: Category[] = [
  { id: "cat-1", name: "Smart Home", slug: "smart-home" },
  { id: "cat-2", name: "Car Essentials", slug: "car-essentials" },
  { id: "cat-3", name: "Workspace", slug: "workspace" },
  { id: "cat-4", name: "Lifestyle Tech", slug: "lifestyle-tech" }
];

export const products: Product[] = [
  {
    id: "prd-1",
    slug: "motion-sensor-led-night-light",
    title: "Motion Sensor LED Night Light",
    description: "Auto-illuminates hallways and wardrobes with warm light and low power draw.",
    price: 799,
    comparePrice: 1299,
    stock: 120,
    category: "Smart Home",
    images: [catalogImages.nightLight],
    rating: 4.7,
    vendor: "EZY Smart Shop",
    specifications: ["Motion + light sensor", "USB rechargeable", "Magnetic mount"],
    shippingDetails: ["Ships in 24 hours", "Free delivery above Rs 999", "7-day replacement"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-2",
    slug: "3-in-1-wireless-charging-station",
    title: "3-in-1 Wireless Charging Station",
    description: "Declutters desks by charging phone, watch, and earbuds in one premium dock.",
    price: 2499,
    comparePrice: 3499,
    stock: 60,
    category: "Workspace",
    images: [catalogImages.chargingStation],
    rating: 4.8,
    vendor: "EZY Smart Shop",
    specifications: ["15W fast charging", "Foldable stand", "Qi compatible"],
    shippingDetails: ["Ships in 24 hours", "COD available", "1-year warranty"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-3",
    slug: "portable-car-vacuum-cleaner",
    title: "Portable Car Vacuum Cleaner",
    description: "Compact high-suction vacuum for seats, dashboards, and tight corners.",
    price: 1599,
    comparePrice: 2299,
    stock: 85,
    category: "Car Essentials",
    images: [catalogImages.carVacuum],
    rating: 4.5,
    vendor: "EZY Smart Shop",
    specifications: ["120W motor", "HEPA filter", "3 nozzle attachments"],
    shippingDetails: ["Ships in 48 hours", "Free delivery", "7-day replacement"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-4",
    slug: "magnetic-car-phone-holder",
    title: "Magnetic Car Phone Holder",
    description: "Stable one-hand mount with 360-degree rotation for navigation and calls.",
    price: 699,
    comparePrice: 999,
    stock: 200,
    category: "Car Essentials",
    images: [catalogImages.phoneHolder],
    rating: 4.4,
    vendor: "EZY Smart Shop",
    specifications: ["N52 magnet", "Dashboard mount", "360-degree swivel"],
    shippingDetails: ["Same-day dispatch", "COD available", "Easy returns"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-5",
    slug: "electric-lint-remover",
    title: "Electric Lint Remover",
    description: "Refreshes sweaters, sofas, and blankets with fabric-safe trimming blades.",
    price: 999,
    comparePrice: 1499,
    stock: 140,
    category: "Lifestyle Tech",
    images: [catalogImages.lintRemover],
    rating: 4.6,
    vendor: "EZY Smart Shop",
    specifications: ["USB charging", "Detachable lint box", "Steel blades"],
    shippingDetails: ["Ships in 24 hours", "Free exchange", "7-day support"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-6",
    slug: "rgb-led-light-strip",
    title: "RGB LED Light Strip",
    description: "App-controlled ambient lighting for bedrooms, desks, and entertainment corners.",
    price: 1299,
    comparePrice: 1899,
    stock: 110,
    category: "Smart Home",
    images: [catalogImages.ledStrip],
    rating: 4.7,
    vendor: "EZY Smart Shop",
    specifications: ["16 million colors", "Music sync", "5 meter strip"],
    shippingDetails: ["Ships in 24 hours", "COD available", "1-year warranty"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-7",
    slug: "foldable-laptop-table",
    title: "Foldable Laptop Table",
    description: "Portable lap desk for work, study, and breakfast-in-bed convenience.",
    price: 1799,
    comparePrice: 2599,
    stock: 50,
    category: "Workspace",
    images: [catalogImages.laptopTable],
    rating: 4.3,
    vendor: "EZY Smart Shop",
    specifications: ["Foldable legs", "Cup slot", "Tablet groove"],
    shippingDetails: ["Ships in 48 hours", "Free delivery", "No-cost replacement"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-8",
    slug: "smart-temperature-water-bottle",
    title: "Smart Temperature Water Bottle",
    description: "Displays real-time drink temperature and keeps beverages hot or cold for hours.",
    price: 1199,
    comparePrice: 1699,
    stock: 95,
    category: "Lifestyle Tech",
    images: [catalogImages.bottle],
    rating: 4.6,
    vendor: "EZY Smart Shop",
    specifications: ["LED touch display", "500ml steel bottle", "12-hour insulation"],
    shippingDetails: ["Ships in 24 hours", "COD available", "Easy return"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-9",
    slug: "selfie-ring-light-with-tripod",
    title: "Selfie Ring Light with Tripod",
    description: "Portable creator kit with adjustable brightness and extendable tripod stand.",
    price: 1499,
    comparePrice: 2199,
    stock: 75,
    category: "Lifestyle Tech",
    images: [catalogImages.ringLight],
    rating: 4.5,
    vendor: "EZY Smart Shop",
    specifications: ["3 light modes", "Bluetooth remote", "Adjustable height"],
    shippingDetails: ["Ships in 24 hours", "Free delivery", "7-day replacement"],
    createdAt: "2026-03-16T00:00:00.000Z"
  },
  {
    id: "prd-10",
    slug: "mini-portable-blender",
    title: "Mini Portable Blender",
    description: "USB rechargeable blender for protein shakes, smoothies, and travel mixing.",
    price: 1899,
    comparePrice: 2699,
    stock: 70,
    category: "Lifestyle Tech",
    images: [catalogImages.blender],
    rating: 4.4,
    vendor: "EZY Smart Shop",
    specifications: ["6 stainless blades", "USB-C charging", "Leakproof lid"],
    shippingDetails: ["Ships in 48 hours", "COD available", "Warranty support"],
    createdAt: "2026-03-16T00:00:00.000Z"
  }
];

export const coupons: Coupon[] = [
  {
    id: "cpn-1",
    code: "WELCOME10",
    discount: 10,
    type: "percentage",
    expiry: "2026-12-31T00:00:00.000Z"
  },
  {
    id: "cpn-2",
    code: "SAVE200",
    discount: 200,
    type: "fixed",
    expiry: "2026-12-31T00:00:00.000Z"
  }
];

export const orders: Order[] = [
  {
    id: "ORD-1024",
    userId: "usr-customer",
    subtotal: 4097,
    discount: 0,
    total: 4097,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    orderStatus: "packed",
    shippingAddress: "HSR Layout, Bengaluru, Karnataka 560102",
    items: [
      { id: "itm-1", productId: "prd-2", quantity: 1, price: 2499 },
      { id: "itm-2", productId: "prd-1", quantity: 2, price: 799 }
    ],
    createdAt: "2026-03-16T00:00:00.000Z"
  }
];
