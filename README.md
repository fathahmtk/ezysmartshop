# EZY Smart Shop

Headless ecommerce monorepo for `https://ezysmartshop.com`, built from the ground up as a live online store—not a portfolio—designed for India-focused smart gadgets and high-velocity home utility sales.

## Stack

- Frontend: Next.js 14, React, TypeScript, TailwindCSS, Framer Motion
- Backend: Node.js, Express, TypeScript
- Data: PostgreSQL schema included, Firebase-ready auth/storage adapters
- Cache: Redis adapter hooks
- Payments: Razorpay, Stripe, Cash on Delivery
- Search: Firestore/Elasticsearch-ready abstraction with local fallback
- AI: Gemini-powered recommendations with deterministic fallback
- **Shopify**: optional Storefront API integration (products, cart, native checkout)

## Structure

```text
frontend/   Next.js storefront + admin panel
backend/    Express API, services, schema, seed data
```

## Quick start

1. Copy `.env.example` to `.env` and fill the required keys.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run backend:
   ```bash
   npm run dev:backend
   ```
4. Run frontend:
   ```bash
   npm run dev:frontend
   ```

The project is set up to run in preview mode with seeded data even if PostgreSQL, Redis, Stripe, Razorpay, or Firebase are not configured yet; however, every screen is modeled as a transactional shopping experience (cart, checkout, order reviews) rather than a showcase portfolio.

For a production deployment baseline:

- Set `NODE_ENV=production`
- Set `DEMO_MODE=false` and `NEXT_PUBLIC_DEMO_MODE=false`
- Replace seeded/bootstrap accounts before go-live
- Set a long unique `JWT_SECRET`
- Configure real Stripe and/or Razorpay credentials before enabling those payment methods
- Run `npm run ci` before every release

## Shopify integration

Set the two variables below in your `.env` to connect the storefront to your Shopify store via the [Storefront API](https://shopify.dev/docs/api/storefront):

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

When both variables are present the storefront will:

| Feature | Behaviour |
|---------|-----------|
| Product listing & search | Fetched live from Shopify via GraphQL |
| Product detail pages | Fetched by handle from Shopify |
| Collections / categories | Fetched from Shopify collections |
| Cart (add / update / remove) | Managed via Shopify Storefront Cart API; cart ID stored in `localStorage` |
| Checkout | Redirects to Shopify's hosted checkout URL |

If the variables are **not** set the storefront falls back to the built-in Express backend (or demo/mock data), exactly as before. No other code changes are required to switch between modes.

### How to get the Storefront Access Token

1. Open your Shopify admin → **Apps** → **Develop apps**.
2. Create (or open) a private app.
3. Under **API credentials** → **Storefront API access scopes** enable at minimum:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_write_checkouts`
   - `unauthenticated_read_checkouts`
4. Copy the **Storefront API access token** into `.env`.

### Optional: Shopify product metafields

The integration reads the following metafields (namespace `custom`) to enrich product pages:

| Key | Type | Description |
|-----|------|-------------|
| `badge` | single_line_text_field | Badge label shown on product card (e.g. "Flash Deal") |
| `specifications` | json | JSON array of specification strings |
| `shipping_details` | json | JSON array of shipping detail strings |

These are all optional; sensible defaults are used when they are absent.

## Bootstrap admin credentials

- Email: `admin@ezysmartshop.com`
- Password: `Admin@123`

These are for preview environments only. The backend now rejects bootstrap credentials in production.

## Additional docs

- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Frontend notes: [frontend/README.md](./frontend/README.md)
- Backend notes: [backend/README.md](./backend/README.md)
- API reference: [backend/src/docs/api.md](./backend/src/docs/api.md)
