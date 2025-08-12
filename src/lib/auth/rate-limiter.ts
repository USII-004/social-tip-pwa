// lib/auth/rate-limiter.ts
import { LRUCache } from 'lru-cache'

type RateLimiterOptions = {
  uniqueTokensPerInterval?: number
  interval?: number
}

export function createRateLimiter(options?: RateLimiterOptions) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokensPerInterval || 500,
    ttl: options?.interval || 60_000, // 1 minute
  })

  return {
    check: (identifier: string, token: string, limit: number) => {
      const key = `${identifier}:${token}`
      const tokenCount = tokenCache.get(key) || [0]
      
      tokenCount[0] += 1
      tokenCache.set(key, tokenCount)

      const currentUsage = tokenCount[0]
      const isRateLimited = currentUsage > limit

      return {
        limited: isRateLimited,
        headers: new Headers({
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': Math.max(0, limit - currentUsage).toString(),
          'X-RateLimit-Reset': (Date.now() + (options?.interval || 60_000)).toString()
        }),
        currentUsage,
        limit
      }
    }
  }
}

// Pre-configured email rate limiter
export const emailRateLimiter = createRateLimiter({
  uniqueTokensPerInterval: 1000, // 1000 unique emails per interval
  interval: 60_000 // 1 minute
})