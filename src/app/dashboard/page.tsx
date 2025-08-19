import Sidebar from "@/components/Sidebar"
import { Eye, EyeClosed, Send } from "lucide-react"
import { useEffect, useState } from "react";
import { useWallet } from "../context/WalletContext";
import { useRouter } from "next/navigation";
import { contractService } from "@/lib/contractService";

export default function Dashboard() {

  const router = useRouter();
  const [showWalletBalance, setShowWalletBalance] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const {
    address,
    balance,
    toDisplayXion,
    client,
    queryClient,
  } = useWallet();

  // Initialize contract service
  const [service, setService] = useState<contractService | null>(null);

  useEffect(() => {
    if (address && client && queryClient) {
      const contractAddr = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
      setService(new contractService(client, contractAddr, address));

      //fetch registered username
      fetchUsername(address);
    }
  }, [address, client, queryClient]);

  const fetchUsername = async (address: string) => {
    if (!service) return;
    try {
      const response  = await service.getAccount(address);
      if (response.address) {
        setUsername(response.address || "Unregistered");
      }
    } catch (error) {
      console.error("Error fetching username:", error);
      setUsername("Error");
    }
  };

  const handleSendClick = () => {
    router.push("/send");
  }

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
            <div className="font-bold text-sm md:py-2">{username || "Loading..."}</div>
            <div>{address ? truncateAddress(address) : "Not connected"}</div>
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
              <div className="font-bold text-3xl p-2">{`${showWalletBalance ? balance ? toDisplayXion(balance) : "0 XION" : "*****"}`}</div>
            </div>
            <div
            onClick={handleSendClick} 
            className="bg-green-700 hover:bg-green-900 w-16 h-16 rounded-full mx-auto p-2 flex justify-center items-center"
            >
              <Send size={32}/>
            </div>
          </div>

          {/* other dashboard cards */}
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
