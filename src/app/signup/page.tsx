"use client"
import { Abstraxion, useAbstraxionAccount, useModal } from '@burnt-labs/abstraxion';
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

const Signup = () => {
  // Abstraxion hooks
  const { data: { bech32Address }, isConnected, isConnecting } = useAbstraxionAccount();
  
  // Use the useModal hook correctly
  const [showModal, setShowModal] = useModal();
  
  const router = useRouter()

  // Handle successful connection and redirect
  useEffect(() => {
    if (isConnected && bech32Address) {
      toast.success("Wallet connected successfully!");
      router.push("/register");
    }
  }, [isConnected, bech32Address, router]);

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
              onClick={() => setShowModal(true)}
              type="button"
              variant="outline" 
              className="bg-gray-50 hover:bg-gray-300 text-black my-3 h-12 text-base"
              disabled={isConnecting}
            >
              {isConnecting ? "Connecting..." : "LOG IN / SIGN UP"}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Correct Abstraxion modal usage */}
      <Abstraxion onClose={() => setShowModal(false)} />
      
      <Toaster position="top-center" richColors />
    </div>
  )
}

export default Signup