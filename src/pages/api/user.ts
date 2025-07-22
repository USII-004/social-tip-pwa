import { NextApiRequest, NextApiResponse } from 'next'

// Initialize Prisma correctly (solution for first error)
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ 
      error: 'Method not allowed',
      allowed: ['POST']
    })
  }

  const { id, email } = req.body

  // Input validation
  if (!id || !email) {
    return res.status(400).json({ 
      error: 'Both id and email are required',
      example: {
        id: 'user_123',
        email: 'user@example.com'
      }
    })
  }

  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: { email },
      create: { id, email },
    })

    return res.status(200).json(user)
  } catch (error) {
    // Proper error type handling (solution for second error)
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to create/update user'
    
    return res.status(400).json({ 
      error: errorMessage,
      code: 'USER_UPSERT_ERROR'
    })
  }
}