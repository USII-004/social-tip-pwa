import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing')

  // 1. Test DB connection
  try {
    await prisma.$connect()
    console.log('Prisma connected to database successfully')
  } catch (error) {
    console.error('Prisma connection error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to database', code: 'DATABASE_CONNECTION_ERROR' },
      { status: 500 }
    )
  }

  // 2. Parse and validate JSON body
  let body: any
  try {
    body = await req.json()
  } catch (error) {
    console.error('Error parsing request body:', error)
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'INVALID_JSON' },
      { status: 400 }
    )
  }

  const { id, email, username } = body

  console.log('Received request body:', { id, email, username })

  // 3. Strong input validation
  if (typeof id !== 'string' || typeof email !== 'string') {
    return NextResponse.json(
      {
        error: 'Both id and email must be non-empty strings',
        example: {
          id: 'user_123',
          email: 'user@example.com',
          username: 'optional_username'
        }
      },
      { status: 400 }
    )
  }

  if (username && typeof username !== 'string') {
    return NextResponse.json(
      {
        error: 'Username must be a string if provided'
      },
      { status: 400 }
    )
  }

  // Normalize input
  const normalizedId = id.trim()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username?.trim().toLowerCase() || null

  try {
    // 4. Check if username already exists (for another user)
    if (normalizedUsername) {
      const existingUser = await prisma.user.findUnique({
        where: { username: normalizedUsername },
        select: { id: true }
      })

      console.log('Username check:', { normalizedUsername, existingUser })

      if (existingUser && existingUser.id !== normalizedId) {
        return NextResponse.json(
          { error: 'Username is already taken', code: 'USERNAME_TAKEN' },
          { status: 400 }
        )
      }
    }

    // 5. Safe upsert
    const user = await prisma.user.upsert({
      where: { id: normalizedId },
      update: {
        email: normalizedEmail,
        ...(normalizedUsername && { username: normalizedUsername })
      },
      create: {
        id: normalizedId,
        email: normalizedEmail,
        ...(normalizedUsername && { username: normalizedUsername })
      }
    })

    console.log('User upsert successful:', user)
    return NextResponse.json(user, { status: 200 })

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create/update user'

    console.error('User upsert error:', errorMessage, error)
    return NextResponse.json(
      { error: errorMessage, code: 'USER_UPSERT_ERROR' },
      { status: 400 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
