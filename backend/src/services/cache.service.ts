import { createClient } from "redis";
import { env } from "../config/env";

let client: ReturnType<typeof createClient> | null = null;
const memoryCache = new Map<string, { value: string; expiresAt: number }>();

export async function getRedisClient() {
  if (!env.redisUrl) return null;
  if (!client) {
    client = createClient({ url: env.redisUrl });
    client.on("error", () => undefined);
    await client.connect();
  }
  return client;
}

export async function getCacheValue<T>(key: string): Promise<T | null> {
  const redis = await getRedisClient();
  if (redis) {
    const value = await redis.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  const cached = memoryCache.get(key);
  if (!cached || cached.expiresAt < Date.now()) {
    memoryCache.delete(key);
    return null;
  }

  return JSON.parse(cached.value) as T;
}

export async function setCacheValue<T>(key: string, value: T, ttlSeconds: number) {
  const serialized = JSON.stringify(value);
  const redis = await getRedisClient();
  if (redis) {
    await redis.set(key, serialized, { EX: ttlSeconds });
    return;
  }

  memoryCache.set(key, {
    value: serialized,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
}
