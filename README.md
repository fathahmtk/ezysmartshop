# EZY Smart Shop

Headless ecommerce monorepo for `https://ezysmartshop.com`, designed for India-focused smart gadgets and home utility sales.

## Stack

- Frontend: Next.js 14, React, TypeScript, TailwindCSS, Framer Motion
- Backend: Node.js, Express, TypeScript
- Data: PostgreSQL schema included, Firebase-ready auth/storage adapters
- Cache: Redis adapter hooks
- Payments: Razorpay, Stripe, Cash on Delivery
- Search: Firestore/Elasticsearch-ready abstraction with local fallback
- AI: Gemini-powered recommendations with deterministic fallback

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

The project is set up to run in preview mode with seeded data even if PostgreSQL, Redis, Stripe, Razorpay, or Firebase are not configured yet.

For a production deployment baseline:

- Set `NODE_ENV=production`
- Set `DEMO_MODE=false` and `NEXT_PUBLIC_DEMO_MODE=false`
- Replace seeded/bootstrap accounts before go-live
- Set a long unique `JWT_SECRET`
- Configure real Stripe and/or Razorpay credentials before enabling those payment methods
- Run `npm run ci` before every release

## Bootstrap admin credentials

- Email: `admin@ezysmartshop.com`
- Password: `Admin@123`

These are for preview environments only. The backend now rejects bootstrap credentials in production.

## Additional docs

- Deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Frontend notes: [frontend/README.md](./frontend/README.md)
- Backend notes: [backend/README.md](./backend/README.md)
- API reference: [backend/src/docs/api.md](./backend/src/docs/api.md)
