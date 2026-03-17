import test from "node:test";
import assert from "node:assert/strict";
import { assertValidJwtSecret } from "../config/jwt-secret";

test("does not enforce JWT_SECRET rules outside production", () => {
  assert.doesNotThrow(() => {
    assertValidJwtSecret("development", "replace-this-secret");
    assertValidJwtSecret("test", "short");
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
