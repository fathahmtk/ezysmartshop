# Frontend

Next.js 14 storefront and admin application for EZY Smart Shop.

## Features

- Server-rendered landing, shop, PDP, cart, checkout, account, and admin pages
- TailwindCSS design system with premium gadget-store aesthetic
- Framer Motion transitions on key merchandising components
- SEO metadata, Open Graph support, JSON-LD, and dynamic sitemap
- API fallback strategy for local preview mode

## Commands

```bash
npm run dev
npm run build
npm run start
```

## Environment

The frontend reads:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Firebase public variables

## Deployment

Deploy to Vercel with the `frontend` directory as the project root. Configure all `NEXT_PUBLIC_*` environment variables in Vercel. Point `NEXT_PUBLIC_API_URL` at the deployed backend API.
