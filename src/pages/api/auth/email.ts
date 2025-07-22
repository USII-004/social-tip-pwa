import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { emailRateLimiter } from '@/lib/auth/rate-limiter-config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Apply enhanced rate limiting
  try {
    const identifier = (
      req.headers['x-forwarded-for'] || 
      req.socket.remoteAddress ||
      'unknown'
    ).toString()
    
    const { email } = req.body
    if (!email) throw new Error('Email required')
    
    await emailRateLimiter.check(
      res, 
      identifier, 
      email.toLowerCase().trim()
    )
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Rate limit exceeded'
    return res.status(429).json({
      error: 'Too many attempts. Please wait 1 minute before trying again.',
      details: errorMessage
    })
  }

  // 2. Method validation
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ 
      error: `Method ${req.method} not allowed`,
      allowed: ['POST']
    })
  }

  // 3. Input validation
  const { email } = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Valid email is required',
      example: 'user@example.com'
    })
  }

  // 4. Main authentication flow
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        shouldCreateUser: true // Explicitly set creation policy
      },
    })

    if (error) {
      throw new Error(error.message || 'Failed to send magic link')
    }

    return res.status(200).json({ 
      success: true,
      message: 'Magic link sent successfully' 
    })
  } catch (error) {
    // Proper error type handling
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'An unexpected error occurred'
    
    return res.status(400).json({ 
      error: errorMessage,
      code: 'AUTH_ERROR'
    })
  }
}