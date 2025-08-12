import { emailRateLimiter as limiter } from './rate-limiter'

export const emailRateLimiter = {
  check: async (ip: string, email: string, limit = 5) => {
    const token = `${ip}-${email}`
    const result = limiter.check('email', token, limit)

    if (result.limited) {
      const resetTime = new Date(Number(result.headers.get('X-RateLimit-Reset')))
      throw new Error(`Rate limit exceeded. Try again after ${resetTime.toLocaleTimeString()}.`)
    }

    return result
  },
}
