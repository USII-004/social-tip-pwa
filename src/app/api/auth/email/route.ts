// app/api/auth/email/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { emailRateLimiter } from '@/lib/auth/rate-limiter'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    // 1. Extract request data
    const identifier = request.headers.get('x-forwarded-for') || 'unknown'
    const { email } = await request.json()
    const cleanEmail = email?.toLowerCase().trim()

    // 2. Validate input
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // 3. Apply rate limiting (5 attempts per minute)
    const { limited, headers } = emailRateLimiter.check(identifier, cleanEmail, 5)
    if (limited) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 1 minute.' },
        { status: 429, headers }
      )
    }

    // 4. Send magic link
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
        shouldCreateUser: true
      },
    })

    if (error) throw error

    // 5. Return success
    return NextResponse.json(
      { success: true, message: 'Magic link sent' },
      { status: 200, headers }
    )

  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Authentication failed',
        code: 'AUTH_ERROR'
      },
      { status: 400 }
    )
  }
}