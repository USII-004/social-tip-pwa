import Sidebar from "@/components/Sidebar"
import { Eye, EyeClosed, Send } from "lucide-react"
import { useState } from "react";

export default function Dashboard() {

  const [showWalletBalance, setShowWalletBalance] = useState(true);

  function truncateAddress(address: string) {
    return address.length > 8
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : address;
  }
  
  return (
    <div className="px-4 flex max-w-6xl mx-auto h-screen md:h-[650px] rounded-b-md mt-10">
      <Sidebar />
      <main className="flex-1 px-4 md:p-10 ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <div className="text-2xl font-bold py-4">
            <h1>Dashboard</h1>
          </div>

          {/* Username and wallet address */}
          <div>
            <div className="font-bold text-sm md:py-2">TestUser001</div>
            <div>{truncateAddress("xionWalletAddress")}</div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="bg-[#151515] p-4 rounded-md">
            <div className="p-6 text-center">
              <div className="flex justify-center items-center">
                <div className="text-xs">WALLET BALANCE</div>
                <div className="pl-2 pt-1">
                  <button
                    onClick={() => setShowWalletBalance((prev) => !prev)}
                  >
                    {showWalletBalance ? <Eye size={14}/> : <EyeClosed size={14} />}
                  </button>
                </div>
              </div>
              <div className="font-bold text-3xl p-2">{`${showWalletBalance ? "1.00032" : "*****"}`}</div>
            </div>
            <div className="bg-green-700 hover:bg-green-900 w-16 h-16 rounded-full mx-auto p-2 flex justify-center items-center">
              <Send size={32}/>
            </div>
          </div>
          <div className="bg-[#151515] p-4 rounded">Total Orders</div>
          <div className="bg-[#151515] p-4 rounded">Visitors</div>
          <div className="bg-[#151515] p-4 rounded">Refunded</div>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="bg-[#151515] p-4 rounded">Revenue Chart</div>
          <div className="bg-[#151515] p-4 rounded">Traffic Channel</div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#151515] p-4 rounded mt-4">Recent Activity</div>
      </main>
    </div>
  )
}
