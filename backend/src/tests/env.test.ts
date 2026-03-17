import test from "node:test";
import assert from "node:assert/strict";
import { assertValidJwtSecret } from "../config/jwt-secret";
import { env } from "../config/env";
import { InMemoryUserRepository } from "../infrastructure/persistence/in-memory/repositories";
import { InMemoryStore } from "../infrastructure/persistence/in-memory/store";
import { AuthService } from "../services/auth.service";

test("does not enforce JWT_SECRET rules outside production", () => {
  assert.doesNotThrow(() => {
    assertValidJwtSecret("development", "replace-this-secret", true);
    assertValidJwtSecret("test", "short", false);
  });
});

test("rejects demo mode in production", () => {
  assert.throws(() => assertValidJwtSecret("production", "12345678901234567890123456789012", true), {
    message: "DEMO_MODE must be disabled in production"
  });
});

test("rejects default JWT secret in production", () => {
  assert.throws(() => assertValidJwtSecret("production", "replace-this-secret"), {
    message: "JWT_SECRET must be set to a strong value in production"
  });
});

test("rejects short JWT secret in production", () => {
  assert.throws(() => assertValidJwtSecret("production", "1234567890123456789012345678901"), {
    message: "JWT_SECRET must be at least 32 characters in production"
  });
});

test("accepts sufficiently long JWT secret in production", () => {
  assert.doesNotThrow(() => assertValidJwtSecret("production", "12345678901234567890123456789012"));
});

test("bootstrap credentials are rejected in production", async () => {
  const originalNodeEnv = env.nodeEnv;

  Object.defineProperty(env, "nodeEnv", {
    configurable: true,
    value: "production"
  });

  try {
    const authService = new AuthService({
      userRepository: new InMemoryUserRepository(new InMemoryStore())
    });

    await assert.rejects(() => authService.login("admin@ezysmartshop.com", "Admin@123"), {
      message: "Bootstrap credentials are disabled in production. Rotate seeded accounts before go-live."
    });
  } finally {
    Object.defineProperty(env, "nodeEnv", {
      configurable: true,
      value: originalNodeEnv
    });
  }
});
