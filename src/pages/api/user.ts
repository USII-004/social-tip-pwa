import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'


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

  const { id, email, username } = req.body

  // Input validation
  if (!id || !email) {
    return res.status(400).json({ 
      error: 'Both id and email are required',
      example: {
        id: 'user_123',
        email: 'user@example.com',
        username: 'optional_username'
      }
    })
  }

  try {
    // If username is provided, check if it already exists for another user
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
        select: { id: true }
      })

      // Check if username is taken by another user
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({
          error: 'Username is already taken',
          code: 'USERNAME_TAKEN'
        })
      }
    }

    // Upsert user with username if provided
    const user = await prisma.user.upsert({
      where: { id },
      update: {
        email,
        ...(username && { username }) // Only update username if provided
      },
      create: {
        id,
        email,
        ...(username && { username }) // Only include username if provided
      }
    })

    return res.status(200).json(user)
  } catch (error) {
    // Proper error type handling
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to create/update user'
    
    return res.status(400).json({ 
      error: errorMessage,
      code: 'USER_UPSERT_ERROR'
    })
  } finally {
    await prisma.$disconnect()
  }
}