import { products } from "@/utils/mock-data";
import { Product } from "@/utils/types";

type BundleOffer = {
  product: Product;
  reason: string;
  tag: string;
};

function uniqueProducts(items: BundleOffer[]) {
  return items.filter((item, index, all) => all.findIndex((candidate) => candidate.product.id === item.product.id) === index);
}

export function getBundleOffers(cartProductIds: string[]) {
  const cartProducts = products.filter((product) => cartProductIds.includes(product.id));
  const cartCategories = new Set(cartProducts.map((product) => product.category));

  const offers: BundleOffer[] = [];

  if (cartCategories.has("Workspace")) {
    const ringLight = products.find((product) => product.id === "prd-9");
    const laptopTable = products.find((product) => product.id === "prd-7");
    if (ringLight && !cartProductIds.includes(ringLight.id)) {
      offers.push({
        product: ringLight,
        tag: "Creator add-on",
        reason: "Pairs well with desk and charging products to lift average order value."
      });
    }
    if (laptopTable && !cartProductIds.includes(laptopTable.id)) {
      offers.push({
        product: laptopTable,
        tag: "Bundle booster",
        reason: "Turns a single desk gadget purchase into a fuller workspace setup."
      });
    }
  }

  if (cartCategories.has("Smart Home")) {
    const ledStrip = products.find((product) => product.id === "prd-6");
    const nightLight = products.find((product) => product.id === "prd-1");
    if (ledStrip && !cartProductIds.includes(ledStrip.id)) {
      offers.push({
        product: ledStrip,
        tag: "Room upgrade",
        reason: "A low-friction add-on that fits the same lighting use case."
      });
    }
    if (nightLight && !cartProductIds.includes(nightLight.id)) {
      offers.push({
        product: nightLight,
        tag: "Impulse winner",
        reason: "A low-ticket utility upsell that converts well with home SKUs."
      });
    }
  }

  if (cartCategories.has("Car Essentials")) {
    const phoneHolder = products.find((product) => product.id === "prd-4");
    const carVacuum = products.find((product) => product.id === "prd-3");
    if (phoneHolder && !cartProductIds.includes(phoneHolder.id)) {
      offers.push({
        product: phoneHolder,
        tag: "Quick upsell",
        reason: "Adds a low-price companion item to a practical car purchase."
      });
    }
    if (carVacuum && !cartProductIds.includes(carVacuum.id)) {
      offers.push({
        product: carVacuum,
        tag: "Core bundle",
        reason: "Complements car utility orders with a stronger problem-solving bundle."
      });
    }
  }

  if (cartCategories.has("Lifestyle Tech")) {
    const blender = products.find((product) => product.id === "prd-10");
    const bottle = products.find((product) => product.id === "prd-8");
    if (blender && !cartProductIds.includes(blender.id)) {
      offers.push({
        product: blender,
        tag: "Lifestyle pair",
        reason: "Adds a higher-AOV utility item to a wellness or travel-oriented order."
      });
    }
    if (bottle && !cartProductIds.includes(bottle.id)) {
      offers.push({
        product: bottle,
        tag: "Easy add-on",
        reason: "A compact checkout bump that still feels useful and giftable."
      });
    }
  }

  if (!offers.length) {
    return products
      .filter((product) => !cartProductIds.includes(product.id))
      .slice(0, 3)
      .map((product) => ({
        product,
        tag: "Best seller",
        reason: "High-utility SKU picked to keep the basket value moving upward."
      }));
  }

  return uniqueProducts(offers).slice(0, 3);
}
