import { Redis } from "@upstash/redis"

const isRealRedis = process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_URL.includes("your-upstash-instance");

const rawRedis = isRealRedis ? Redis.fromEnv() : null;

// Safe wrapper that never crashes if Redis is offline or unconfigured
export const redis = {
  get: async (key: string) => {
    if (!rawRedis) return null;
    try {
      return await rawRedis.get(key);
    } catch {
      return null;
    }
  },
  set: async (key: string, value: any, opts?: any) => {
    if (!rawRedis) return "OK";
    try {
      return await rawRedis.set(key, value, opts);
    } catch {
      return "OK";
    }
  },
  del: async (key: string) => {
    if (!rawRedis) return 1;
    try {
      return await rawRedis.del(key);
    } catch {
      return 1;
    }
  }
} as any
