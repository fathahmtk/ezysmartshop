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

test("readiness endpoint responds", async () => {
  const response = await request(app).get("/ready");
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

test("cart can be cleared and order can be fetched and cancelled", async () => {
  const agent = request.agent(app);
  const csrfResponse = await agent.get("/api/csrf-token");
  const csrfToken = csrfResponse.body.csrfToken as string;

  await agent.post("/api/login").send({ email: "priya@example.com", password: "Customer@123" });

  const clearCartResponse = await agent.delete("/api/cart").set("x-csrf-token", csrfToken);
  assert.equal(clearCartResponse.status, 200);
  assert.equal(clearCartResponse.body.items.length, 0);

  await agent
    .post("/api/cart/items")
    .set("x-csrf-token", csrfToken)
    .send({ productId: "prd-1", quantity: 1 });

  const createOrderResponse = await agent
    .post("/api/orders")
    .set("x-csrf-token", csrfToken)
    .send({
      shippingAddress: "HSR Layout, Bengaluru, Karnataka 560102",
      paymentMethod: "cod",
      items: [{ productId: "prd-1", quantity: 1 }]
    });

  assert.equal(createOrderResponse.status, 201);

  const orderResponse = await agent.get(`/api/orders/${createOrderResponse.body.id}`);
  assert.equal(orderResponse.status, 200);
  assert.equal(orderResponse.body.id, createOrderResponse.body.id);

  const cancelResponse = await agent
    .patch(`/api/orders/${createOrderResponse.body.id}/cancel`)
    .set("x-csrf-token", csrfToken)
    .send({});

  assert.equal(cancelResponse.status, 200);
  assert.equal(cancelResponse.body.paymentStatus, "failed");
});

test("validation rejects unexpected payload fields", async () => {
  const { agent, csrfToken } = await loginAsAdmin();
  const response = await agent
    .post("/api/orders/quote")
    .set("x-csrf-token", csrfToken)
    .send({
      items: [{ productId: "prd-2", quantity: 1, injected: true }],
      couponCode: "WELCOME10"
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.message, "Validation failed");
});
