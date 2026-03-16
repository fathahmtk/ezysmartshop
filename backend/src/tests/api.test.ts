import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../app";

const app = createApp();

async function loginAsAdmin() {
  const agent = request.agent(app);
  const csrfResponse = await agent.get("/api/csrf-token");
  const csrfToken = csrfResponse.body.csrfToken as string;

  const loginResponse = await agent
    .post("/api/login")
    .send({ email: "admin@ezysmartshop.com", password: "Admin@123" });

  assert.equal(loginResponse.status, 200);
  return { agent, csrfToken };
}

test("health endpoint responds", async () => {
  const response = await request(app).get("/health");
  assert.equal(response.status, 200);
  assert.equal(response.body.status, "ok");
});

test("catalog endpoints respond", async () => {
  const productsResponse = await request(app).get("/api/products");
  const categoriesResponse = await request(app).get("/api/categories");

  assert.equal(productsResponse.status, 200);
  assert.ok(Array.isArray(productsResponse.body));
  assert.equal(categoriesResponse.status, 200);
  assert.ok(Array.isArray(categoriesResponse.body));
});

test("order quote computes totals with coupon", async () => {
  const { agent, csrfToken } = await loginAsAdmin();
  const response = await agent
    .post("/api/orders/quote")
    .set("x-csrf-token", csrfToken)
    .send({
      items: [{ productId: "prd-2", quantity: 1 }],
      couponCode: "WELCOME10"
    });

  assert.equal(response.status, 200);
  assert.equal(response.body.subtotal, 2499);
  assert.equal(response.body.discount, 250);
  assert.equal(response.body.total, 2249);
});

test("payment intent derives amount from server-side quote", async () => {
  const { agent, csrfToken } = await loginAsAdmin();
  const response = await agent
    .post("/api/payments/intent")
    .set("x-csrf-token", csrfToken)
    .send({
      method: "cod",
      items: [{ productId: "prd-1", quantity: 2 }]
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.amount, 1598);
});
