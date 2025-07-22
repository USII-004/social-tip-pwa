import rateLimit from './rate-limiter'
import { NextApiRequest, NextApiResponse } from 'next'

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000, // Max 1000 unique combinations per interval
})

export const emailRateLimiter = {
  check: (res: NextApiResponse, ip: string, email: string) => 
    limiter.check(res, 5, `${ip}-${email}`), // 5 requests per minute per IP-email combo
}