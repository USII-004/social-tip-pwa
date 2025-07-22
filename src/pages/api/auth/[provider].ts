import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { provider } = req.query

  if (!['google', 'twitter'].includes(provider as string)) {
    return res.status(400).json({ error: 'Invalid provider' })
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

    return res.status(200).json({ url: data.url })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}