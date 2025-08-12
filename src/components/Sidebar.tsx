import { Home, Users, Send, Settings, HelpCircle, ChevronsRight, ChevronsLeft } from "lucide-react"
import { useState, useEffect, useRef } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: Home },
    { name: "Profile", icon: Users },
    {name: "Send", icon: Send},
  ]

  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setIsSidebarOpen(false);
      }
    }
    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSidebarOpen]);

  // Swipe gesture for mobile
  useEffect(() => {
    let startX: number | null = null;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (startX !== null) {
        const diff = e.touches[0].clientX - startX;
        if (diff < -50) {
          setIsSidebarOpen(false);
          startX = null;
        }
      }
    };
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return ( 
    <div>
      {/* mobile button */}
      <div className={`bg-[#1f1f1f] rounded-br-md rounded-tr-md fixed top-4 ${isSidebarOpen ? "left-64" : "left-1"} z-50 w-6 h-10 flex md:hidden`}>
        <button
          className=" text-white"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          {isSidebarOpen ? <ChevronsLeft size={24} /> : <ChevronsRight size={24} />}
        </button>
      </div>

      {/* sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed md:static top-0 left-0 w-64 h-screen md:h-full bg-[#151515] rounded-md p-4 z-40 flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "opacity-100 translate-x-0 pointer-events-auto" : "opacity-0 -translate-x-full pointer-events-none"}
          md:opacity-100 md:translate-x-0 md:pointer-events-auto`}>
        <div className="text-2xl font-bold mb-6">Social Tip</div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded hover:bg-[#1f1f1f] cursor-pointer">
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </div>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <div className="flex items-center gap-3 p-2 hover:bg-[#1f1f1f] rounded">
            <HelpCircle className="w-5 h-5" />
            <span>Help Center</span>
          </div>
        </div>
      </aside>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
    </div>
  )
}
