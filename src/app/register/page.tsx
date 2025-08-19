"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation"
import { useWallet } from "../context/WalletContext"
import { useState } from "react" 

// From validation schema
const formSchema = z.object({
  username: z.string()
    .min(3, "Username must be atleast 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscore are allowed"),
  email: z.email("Please enter a valid email address")
})

export default function Register() {
  const router = useRouter();

  const {
    address,
    client,
    executeContract,
  } = useWallet();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (FormData: z.infer<typeof formSchema>) => {
    if (!address) {
      toast.error("Please connect wallet first")
      router.push("/signup")
      return
    }

    setIsLoading(true)
    try {
      // usename registration on-chain
      const registerMsg = {
        register: {
          identifier: FormData.username
        }
      }
      await executeContract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        registerMsg
      )
      // make provision to store email onchain in later version of contract

      toast.success("Registration successful!")
      router.push("/dashboard")
    } catch (error) {
      toast.error("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-black/50 backdrop-blur-md border border-gray-800 rounded-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Social Tip</CardTitle>
          <CardDescription className="text-gray-400">
            Register username and Email
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 py-2">
              <Input
                {...register("username")}
                placeholder="Choose a username"
                className="bg-[#252525] border-gray-700 text-white !p-4 !h-12"
              />
              {errors.username && (
                <p className="text-red-400 text-sm">{errors.username.message}</p>
              )}
            </div>
            
            {/* <div className="space-y-2 py-2">
              <Input
                {...register("email")}
                type="email"
                placeholder="Your email address"
                className="bg-[#252525] border-gray-700 text-white !p-4 !h-12"
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div> */}
            
            <Button 
              type="submit"
              className="w-full !bg-green-700 !hover:bg-green-900 text-white !font-bold !p-6 !mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Toaster position="top-center" richColors />
    </div>
  )
}