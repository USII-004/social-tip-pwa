"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const [isAuthenticating, setIsAuthenticating] = useState(true)
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [username, setUsername] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for error query parameters (e.g., from OAuth)
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')
    if (error) {
      console.error('Auth callback query error:', { error, errorDescription })
      toast.error("Authentication Error", {
        description: errorDescription || 'Failed to authenticate. Please try again.',
      })
      router.push('/signup')
      return
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', { event, userId: session?.user?.id, email: session?.user?.email })

      if (session?.user) {
        try {
          // Validate session data
          if (!session.user.id || !session.user.email) {
            throw new Error('Invalid session: Missing user ID or email')
          }

          const requestBody = {
            id: session.user.id,
            email: session.user.email,
          }
          console.log('Sending to /api/user:', requestBody)

          const res = await fetch('/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })

          const userData = await res.json()
          console.log('Response from /api/user:', { status: res.status, userData })

          if (res.ok && !userData.username) {
            setShowUsernameForm(true)
          } else if (res.ok) {
            toast.success("Success", {
              description: "Authenticated successfully",
            })
            router.push('/dashboard')
          } else {
            throw new Error(userData.error || 'Failed to verify user')
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Authentication failed'
          console.error('Auth callback error:', error)
          toast.error("Error", {
            description: errorMessage === 'Failed to connect to database' 
              ? 'Database connection error. Please try again later.'
              : errorMessage,
          })
          router.push('/signup?error=Authentication failed')
        } finally {
          setIsAuthenticating(false)
        }
      } else {
        console.error('No session or user found')
        toast.error("Error", {
          description: 'No authenticated user found',
        })
        router.push('/signup?error=No authenticated user')
        setIsAuthenticating(false)
      }
    })

    return () => {
      console.log('Unsubscribing from auth state change')
      subscription.unsubscribe()
    }
  }, [router, searchParams])

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Client-side username validation
    const isValidUsername = /^[a-zA-Z0-9_]{3,20}$/.test(username)
    if (!isValidUsername) {
      toast.error("Error", {
        description: "Username must be 3-20 characters long and contain only letters, numbers, or underscores",
      })
      setIsSubmitting(false)
      return
    }

    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        throw new Error(userError?.message || 'No authenticated user found')
      }

      const requestBody = {
        id: user.id,
        email: user.email,
        username,
      }
      console.log('Submitting username to /api/user:', requestBody)

      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      console.log('Username submission response:', { status: response.status, data })

      if (!response.ok) {
        throw new Error(data.error || 'Failed to set username')
      }

      toast.success("Success", {
        description: "Username set successfully!",
      })
      router.push('/dashboard')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set username'
      console.error('Username submission error:', error)
      toast.error("Error", {
        description: errorMessage === 'Failed to connect to database' 
          ? 'Database connection error. Please try again later.'
          : errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Toaster />
      <Card className="w-full max-w-lg bg-black/50 backdrop-blur-md border border-gray-800 rounded-4xl">
        <CardHeader className="text-center">
          {isAuthenticating ? (
            <>
              <CardTitle className="text-2xl text-white">Authenticating</CardTitle>
              <CardDescription className="text-gray-400">
                Please wait while we verify your credentials
              </CardDescription>
            </>
          ) : showUsernameForm ? (
            <>
              <CardTitle className="text-2xl text-white">Choose a Username</CardTitle>
              <CardDescription className="text-gray-400">
                Pick a unique username for your account
              </CardDescription>
            </>
          ) : null}
        </CardHeader>

        <CardContent className="flex justify-center items-center">
          {isAuthenticating ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-white animate-spin" />
              <p className="text-gray-400">Processing authentication...</p>
            </div>
          ) : showUsernameForm ? (
            <form onSubmit={handleUsernameSubmit} className="w-full space-y-5">
              <div className="relative my-3">
                <label
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    isFocused || username
                      ? "text-xs -top-5 text-gray-400"
                      : "text-sm top-2 text-gray-500"
                  }`}
                  onClick={() => inputRef.current?.focus()}
                >
                  Username
                </label>
                <Input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="border-0 border-b border-b-gray-800 text-white p-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                  required
                />
              </div>
              <Button
                type="submit"
                variant="outline"
                className="bg-gray-50 hover:bg-gray-300 text-black w-full h-12 text-base"
                disabled={isSubmitting || !username.trim() || !/^[a-zA-Z0-9_]{3,20}$/.test(username)}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Set Username"
                )}
              </Button>
            </form>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}