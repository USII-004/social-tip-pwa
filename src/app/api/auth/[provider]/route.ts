import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string }> } // params is a Promise
) {
  const { provider } = await params // Await params to resolve the provider

  if (!['google', 'twitter'].includes(provider)) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    )
  }

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'twitter',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (error) {
      throw error
    }

    return NextResponse.json({ url: data.url })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 400 }
    )
  }
}