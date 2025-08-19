"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import { useWallet } from "../context/WalletContext"

const Signup = () => {

  const {address, connectWallet} = useWallet();
  
  const router = useRouter()

  // Handle successful connection and redirect
  useEffect(() => {
    if (address) {
      toast.success("Wallet connected successfully!");
      router.push("/register");
    }
  }, [address, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-black/50 backdrop-blur-md border border-gray-800 rounded-4xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Social Tip</CardTitle>
          <CardDescription className="text-gray-400">
            Send token to users conveniently
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-5">
          <div className="flex flex-col">
            <Button 
              onClick={connectWallet}
              type="button"
              variant="outline" 
              className="bg-gray-50 hover:bg-gray-300 text-black my-3 h-12 text-base"
            >
              {address ? "Connecting..." : "LOG IN / SIGN UP"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default Signup