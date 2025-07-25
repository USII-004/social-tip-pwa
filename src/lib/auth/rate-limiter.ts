import { LRUCache } from 'lru-cache'  // Changed from default import to named import
import { NextApiRequest, NextApiResponse } from 'next'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({  // Updated to use LRUCache
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  })

  return {
    check: (res: NextApiResponse, limit: number, token: string) => 
      new Promise<void>((resolve, reject) => {
        const tokenCount = tokenCache.get(token) || [0]
        
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount)
        }
        
        tokenCount[0] += 1

        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit
        
        res.setHeader('X-RateLimit-Limit', limit)
        res.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage
        )

        return isRateLimited ? reject() : resolve()
      }),
  }
}