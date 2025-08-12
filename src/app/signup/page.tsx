import Sidebar from "@/components/Sidebar"

export default function Dashboard() {

  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button className="bg-[#1f1f1f] px-4 py-2 rounded">Filter</button>
            <button className="bg-[#1f1f1f] px-4 py-2 rounded">Export</button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-[#151515] p-4 rounded">Total Sales</div>
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