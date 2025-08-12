import Sidebar from "@/components/Sidebar";
import { SendIcon } from "lucide-react";

export default function Send() {
  return (
    <div className="p-4 flex max-w-6xl mx-auto h-screen md:h-[650px] rounded-b-md mt-10">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 max-w-lg p-6 rounded-2xl shadow-lg mx-auto">
        <div className="font-bold text-2xl text-white mb-2">Tip Xion Token</div>
        <div className="h-1 bg-[#151515] w-full rounded-b-md mb-6"></div>

        {/* Username / Email */}
        <label className="block text-gray-300 mb-1 text-sm font-bold pb-2">Username or Email</label>
        <input
          className="!p-4 w-full h-12 rounded-md bg-[#252525] text-white
            focus:outline-none"
          type="text"
          placeholder="Enter username or email"
        />

        {/* Amount */}
        <label className="block text-gray-300 mb-1 pt-6 text-sm font-bold">Amount (XION)</label>
        <input
          className="w-full h-12 !p-4 rounded-md bg-[#252525] text-white focus:outline-none focus:ring-2 focus:ring-[#00E0A1] mb-6"
          type="number"
          step="0.0001"
          min="0"
          placeholder="0.0000"
        />

        {/* Send Button */}
        <div className="cursor-pointer w-full h-16 mt-10 flex justify-center items-center bg-green-700 hover:bg-green-900 focus:bg-green-900 rounded-md">
          <SendIcon size={24} />
        </div>
      </div>
    </div>
  );
}
