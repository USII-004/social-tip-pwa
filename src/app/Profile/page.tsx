import Sidebar from "@/components/Sidebar"
import { Copy } from "lucide-react"


export default function Profile() {
  return (
    <div className="p-4 flex max-w-6xl mx-auto h-screen md:h-[650px] rounded-b-md mt-10">
       {/* Sidebar */}
      <Sidebar />

       {/* main component */}
      <div className="flex-1 max-w-lg p-6 rounded-2xl shadow-lg mx-auto">
        <div className="font-bold text-2xl pb-2">Profile</div>
        <div className="h-1 bg-[#151515] w-full rounded-b-md mb-6"></div>

        <div className="bg-[#1f1f1f] rounded-md p-6">
          <div className="py-4">
            <div className="text-sm font-bold py-2">Username</div>
            <div className="flex justify-between">
              <div className="text-2xl">TestUser001</div>
              <div className="cursor-pointer hover:bg-black p-2 rounded-md"><Copy size={16} /></div>
            </div>
          </div>

          <div className="py-4">
            <div className="text-sm font-bold py-2">Email</div>
            <div className="flex justify-between">
              <div className="text-xl">testuser001@mail.com</div>
              <div className="cursor-pointer hover:bg-black p-2 rounded-md"><Copy size={16} /></div>
            </div>
          </div>

          <div className="py-4">
            <div className="text-sm font-bold py-2">Wallet Address</div>
            <div className="flex justify-between">
              <div className="text-md">xion1234311924i3i1023nmfjbasjfajkf</div>
              <div className="cursor-pointer hover:bg-black p-2 rounded-md"><Copy size={16} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}