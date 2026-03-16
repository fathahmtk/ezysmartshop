# Deployment Guide

## Frontend

- Deploy the `frontend` workspace to Vercel.
- Set `NEXT_PUBLIC_SITE_URL` to `https://ezysmartshop.com`.
- Set `NEXT_PUBLIC_API_URL` to the deployed backend base URL plus `/api`.
- Add Razorpay, Stripe, and Firebase public keys in Vercel project settings.

## Backend

- Provision an AWS EC2 instance with Node.js 20, PM2 or systemd, Nginx, and Docker if preferred.
- Copy the repository or build artifacts to the server.
- Set the backend environment variables from `.env.example`.
- Start the API with `npm run build --workspace backend` and `npm run start --workspace backend`.
- Reverse proxy `/api` traffic through Nginx to port `4000`.

## Data and infrastructure

- PostgreSQL stores core commerce data using [schema.sql](/C:/Users/abdul/OneDrive/Documents/Playground/backend/db/schema.sql).
- Redis is optional in preview mode and recommended in production for response caching and session acceleration.
- Firebase Authentication handles email/password and Google OAuth.
- Firebase Storage or AWS S3 stores product media and customer assets.
- Cloudflare fronts the domain for CDN, SSL, and caching.

## CI/CD

- GitHub Actions runs the monorepo build through [.github/workflows/deploy.yml](/C:/Users/abdul/OneDrive/Documents/Playground/.github/workflows/deploy.yml).
- Vercel should be connected directly to the repository for frontend auto-deployments.
- EC2 deployment can be handled through SSH-based GitHub Actions or a pull-based PM2 workflow.

