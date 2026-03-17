# Backend

Express REST API for EZY Smart Shop.

## Services

- Auth service
- Product service
- Cart service
- Order service
- Payment service
- Inventory and admin analytics service
- Recommendation service

## Security

- JWT session handling
- HTTP-only cookie support
- Rate limiting
- Helmet headers
- Zod validation

## Preview mode

The API is backed by seeded in-memory data by default so it runs without PostgreSQL, Redis, Firebase, Stripe, or Razorpay configured. Production adapters can replace the seed-backed services incrementally.

## Architecture

- `application/`: composition root and dependency container
- `domain/`: repository contracts
- `infrastructure/`: concrete persistence adapters
- `services/`: business logic over interfaces
- `controllers/` and `routes/`: HTTP delivery layer

Set `DEMO_MODE=false` to disable demo-password login shortcuts outside preview environments.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run seed
```

## Admin credentials

- Email: `admin@ezysmartshop.com`
- Password: `Admin@123`

