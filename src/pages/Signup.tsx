import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { FaXTwitter } from "react-icons/fa6"
import { useState, useRef } from "react"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"  // Updated import
import { useRouter } from "next/navigation"

const Signup = () => {
  const [isFocused, setIsFocused] = useState(false)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a minute.')
      }

      const data = await response.json()
      
      if (!response.ok) throw new Error(data.error || 'Authentication failed')
      
      toast.success("Success", {
        description: "Please check your email for the magic link",
      })
    } catch (error) {
      let errorMessage = "Authentication Failed"

      if (error instanceof Error) {
        errorMessage = error.message
      }else if (typeof error === 'string') {
        errorMessage = error
      }
      toast.error("Error", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'twitter') => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/auth/${provider}`)
      const data = await response.json()
      
      if (response.ok && data.url) {
        router.push(data.url)
      } else {
        throw new Error(data.error || 'Authentication failed')
      }
    } catch (error) {
      let errorMessage = "Authentication Failed"

      if (error instanceof Error) {
        errorMessage = error.message
      }else if (typeof error === 'string') {
        errorMessage = error
      }
      toast.error("Error", {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }
   return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-black/50 backdrop-blur-md border border-gray-800 rounded-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Welcome</CardTitle>
          <CardDescription className="text-gray-400">
            Login or Signup with email to start tipping
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          <form onSubmit={handleEmailAuth}>
            <div className="flex flex-col">
              {/* Floating Label Input */}
              <div className="relative my-3">
                <label
                  className={`absolute left-0 transition-all duration-200 pointer-events-none ${
                    isFocused || email
                      ? "text-xs -top-5 text-gray-400"
                      : "text-sm top-2 text-gray-500"
                  }`}
                  onClick={() => inputRef.current?.focus()}
                >
                  Email
                </label>
                <Input 
                  ref={inputRef}
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className="border-0 border-b border-b-gray-800 text-white p-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
                />
              </div>
              
              <Button 
                type="submit"
                variant="outline" 
                className="bg-gray-50 hover:bg-gray-300 text-black my-3 h-12 text-base"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "LOG IN / SIGN UP"}
              </Button>
            </div>
          </form>
          
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-800"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-800"></div>
          </div>
          
          <div className="flex flex-col space-y-3">
            <Button 
              variant="outline" 
              className="bg-black/50 hover:bg-gray-900 border-gray-800 h-12 text-base text-white"
              onClick={() => handleSocialAuth('google')}
              disabled={isLoading}
            >
              <FcGoogle className="mr-3 h-12 w-12" />
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="bg-black/50 hover:bg-gray-900 border-gray-800 h-12 p-0 text-base text-white"
              onClick={() => handleSocialAuth('twitter')}
              disabled={isLoading}
            >
              <FaXTwitter className="mr-3 h-12 w-12 text-white" />
              X
            </Button>
          </div>
        </CardContent>
      </Card>
      <Toaster position="top-center" richColors />
   </div>
  )
}

export default Signup