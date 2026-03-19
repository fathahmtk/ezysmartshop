// Shopify Storefront API integration
// Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
// to enable Shopify as the data source for products, categories, and cart.

import { Category, CartLine, CartState, Product } from "@/utils/types";

// ─── Configuration ───────────────────────────────────────────────────────────

const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const SHOPIFY_API_VERSION = "2024-01";

export function isShopifyConfigured(): boolean {
  return !!(SHOPIFY_STORE_DOMAIN && SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

function getShopifyApiUrl(): string {
  return `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
}

// ─── Internal GraphQL Types ──────────────────────────────────────────────────

type ShopifyMoneyV2 = {
  amount: string;
  currencyCode: string;
};

type ShopifyImage = {
  url: string;
  altText: string | null;
};

type ShopifyProductVariant = {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
};

type ShopifyMetafield = {
  key: string;
  value: string | null;
} | null;

type ShopifyProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  vendor: string;
  availableForSale: boolean;
  tags: string[];
  priceRange: { minVariantPrice: ShopifyMoneyV2 };
  compareAtPriceRange: { minVariantPrice: ShopifyMoneyV2 };
  images: { edges: Array<{ node: ShopifyImage }> };
  variants: { edges: Array<{ node: ShopifyProductVariant }> };
  metafields: ShopifyMetafield[];
  collections: { edges: Array<{ node: { title: string } }> };
};

type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
};

type ShopifyCartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: ShopifyMoneyV2;
    product: {
      id: string;
      handle: string;
      title: string;
      vendor: string;
      images: { edges: Array<{ node: ShopifyImage }> };
      collections: { edges: Array<{ node: { title: string } }> };
    };
  };
};

type ShopifyCart = {
  id: string;
  checkoutUrl: string;
  lines: { edges: Array<{ node: ShopifyCartLine }> };
  cost: {
    subtotalAmount: ShopifyMoneyV2;
    totalAmount: ShopifyMoneyV2;
  };
};

type ShopifyGraphQLResponse<T> = {
  data: T;
  errors?: Array<{ message: string }>;
};

// ─── Core GraphQL Client ─────────────────────────────────────────────────────

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  options: RequestInit = {}
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new Error("Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.");
  }

  const response = await fetch(getShopifyApiUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      Accept: "application/json"
    },
    body: JSON.stringify({ query, variables }),
    ...options
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join(", ")}`);
  }

  return json.data;
}

// ─── Data Mapping ────────────────────────────────────────────────────────────

export function mapShopifyProduct(node: ShopifyProduct): Product {
  const firstVariant = node.variants.edges[0]?.node;
  const images = node.images.edges.map((e) => e.node.url);
  const category = node.collections.edges[0]?.node.title || node.vendor;

  const badgeMetafield = node.metafields.find((m) => m?.key === "badge");
  const specificationsMetafield = node.metafields.find((m) => m?.key === "specifications");
  const shippingMetafield = node.metafields.find((m) => m?.key === "shipping_details");

  const badge =
    badgeMetafield?.value ||
    node.tags.find((t) => t.startsWith("badge:"))?.replace("badge:", "");

  let specifications: string[] = [];
  if (specificationsMetafield?.value) {
    try {
      specifications = JSON.parse(specificationsMetafield.value) as string[];
    } catch {
      specifications = [specificationsMetafield.value];
    }
  }

  let shippingDetails: string[] = [];
  if (shippingMetafield?.value) {
    try {
      shippingDetails = JSON.parse(shippingMetafield.value) as string[];
    } catch {
      shippingDetails = [shippingMetafield.value];
    }
  }

  const price = parseFloat(
    firstVariant?.price.amount || node.priceRange.minVariantPrice.amount
  );
  const compareAtRaw =
    firstVariant?.compareAtPrice?.amount ||
    node.compareAtPriceRange.minVariantPrice.amount;
  const comparePrice = parseFloat(compareAtRaw) || price;

  return {
    id: firstVariant?.id || node.id,
    slug: node.handle,
    title: node.title,
    description: node.description,
    price,
    comparePrice,
    stock: firstVariant?.quantityAvailable ?? 100,
    category,
    images: images.length ? images : ["/placeholder.jpg"],
    rating: 4.5,
    vendor: node.vendor,
    badge,
    specifications,
    shippingDetails
  };
}

export function mapShopifyCollection(node: ShopifyCollection): Category {
  return {
    id: node.id,
    name: node.title,
    slug: node.handle,
    description: node.description
  };
}

export function mapShopifyCart(shopifyCart: ShopifyCart): CartState {
  const items: CartLine[] = shopifyCart.lines.edges.map(({ node }) => {
    const { merchandise } = node;
    const productNode = merchandise.product;
    const images = productNode.images.edges.map((e) => e.node.url);
    const category = productNode.collections.edges[0]?.node.title || "";
    const price = parseFloat(merchandise.price.amount);

    return {
      id: node.id,
      cartId: shopifyCart.id,
      productId: merchandise.id,
      quantity: node.quantity,
      product: {
        id: merchandise.id,
        slug: productNode.handle,
        title: productNode.title,
        description: "",
        price,
        comparePrice: price,
        stock: 100,
        category,
        images: images.length ? images : ["/placeholder.jpg"],
        rating: 4.5,
        vendor: productNode.vendor || "",
        specifications: [],
        shippingDetails: []
      }
    };
  });

  return {
    id: shopifyCart.id,
    userId: "",
    items,
    checkoutUrl: shopifyCart.checkoutUrl
  };
}

// ─── GraphQL Fragments ───────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    vendor
    availableForSale
    tags
    priceRange { minVariantPrice { amount currencyCode } }
    compareAtPriceRange { minVariantPrice { amount currencyCode } }
    images(first: 5) { edges { node { url altText } } }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price { amount currencyCode }
          compareAtPrice { amount currencyCode }
          availableForSale
          quantityAvailable
        }
      }
    }
    metafields(identifiers: [
      { namespace: "custom", key: "badge" }
      { namespace: "custom", key: "specifications" }
      { namespace: "custom", key: "shipping_details" }
    ]) { key value }
    collections(first: 1) { edges { node { title } } }
  }
`;

const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    checkoutUrl
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price { amount currencyCode }
              product {
                id
                handle
                title
                vendor
                images(first: 1) { edges { node { url altText } } }
                collections(first: 1) { edges { node { title } } }
              }
            }
          }
        }
      }
    }
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
  }
`;

// ─── Product Queries ─────────────────────────────────────────────────────────

export async function getShopifyProducts(): Promise<Product[]> {
  const data = await shopifyFetch<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(
    `
    ${PRODUCT_FRAGMENT}
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges { node { ...ProductFields } }
      }
    }
    `,
    { first: 50 },
    { next: { revalidate: 120 } }
  );
  return data.products.edges.map(({ node }) => mapShopifyProduct(node));
}

export async function getShopifyProductByHandle(handle: string): Promise<Product | undefined> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    `
    ${PRODUCT_FRAGMENT}
    query GetProduct($handle: String!) {
      product(handle: $handle) { ...ProductFields }
    }
    `,
    { handle },
    { next: { revalidate: 120 } }
  );
  return data.product ? mapShopifyProduct(data.product) : undefined;
}

export async function getShopifyCollections(): Promise<Category[]> {
  const data = await shopifyFetch<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>(
    `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges { node { id handle title description } }
      }
    }
    `,
    { first: 50 },
    { next: { revalidate: 120 } }
  );
  return data.collections.edges.map(({ node }) => mapShopifyCollection(node));
}

// ─── Cart Mutations ──────────────────────────────────────────────────────────

export async function createShopifyCart(
  lines: Array<{ merchandiseId: string; quantity: number }> = []
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartCreate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
  }>(
    `
    ${CART_FRAGMENT}
    mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    `,
    { input: { lines } }
  );

  if (data.cartCreate.userErrors.length) {
    throw new Error(data.cartCreate.userErrors.map((e) => e.message).join(", "));
  }

  return data.cartCreate.cart;
}

export async function addShopifyCartLines(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
  }>(
    `
    ${CART_FRAGMENT}
    mutation AddCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    `,
    { cartId, lines }
  );

  if (data.cartLinesAdd.userErrors.length) {
    throw new Error(data.cartLinesAdd.userErrors.map((e) => e.message).join(", "));
  }

  return data.cartLinesAdd.cart;
}

export async function updateShopifyCartLines(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
  }>(
    `
    ${CART_FRAGMENT}
    mutation UpdateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    `,
    { cartId, lines }
  );

  if (data.cartLinesUpdate.userErrors.length) {
    throw new Error(data.cartLinesUpdate.userErrors.map((e) => e.message).join(", "));
  }

  return data.cartLinesUpdate.cart;
}

export async function removeShopifyCartLines(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: ShopifyCart; userErrors: Array<{ message: string }> };
  }>(
    `
    ${CART_FRAGMENT}
    mutation RemoveCartLines($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartFields }
        userErrors { field message }
      }
    }
    `,
    { cartId, lineIds }
  );

  if (data.cartLinesRemove.userErrors.length) {
    throw new Error(data.cartLinesRemove.userErrors.map((e) => e.message).join(", "));
  }

  return data.cartLinesRemove.cart;
}

export async function fetchShopifyCart(cartId: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<{ cart: ShopifyCart | null }>(
    `
    ${CART_FRAGMENT}
    query GetCart($cartId: ID!) {
      cart(id: $cartId) { ...CartFields }
    }
    `,
    { cartId }
  );
  return data.cart;
}
