export const DEFAULT_JWT_SECRET = "replace-this-secret";
const MIN_JWT_SECRET_LENGTH = 32;

export function assertValidJwtSecret(nodeEnv: string, jwtSecret: string, demoMode = false) {
  if (nodeEnv !== "production") {
    return;
  }

  if (demoMode) {
    throw new Error("DEMO_MODE must be disabled in production");
  }

  if (jwtSecret === DEFAULT_JWT_SECRET) {
    throw new Error("JWT_SECRET must be set to a strong value in production");
  }

  if (jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }
}
