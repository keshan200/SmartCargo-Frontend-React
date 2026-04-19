import { Bell, Search, Settings, AlertTriangle, Info, CheckCircle, Package } from "lucide-react";

const alerts = [
  { id: 1, title: "Shipment #SC-4821 delayed", sub: "Route 7 — Colombo → Kandy", time: "2m ago", type: "warn" },
  { id: 2, title: "New cargo request received", sub: "Client: Hemas Holdings", time: "15m ago", type: "info" },
  { id: 3, title: "Driver check-in confirmed", sub: "Vehicle LK-2934 on Route 3", time: "1h ago", type: "ok" },
  { id: 4, title: "Overweight cargo flagged", sub: "Shipment #SC-4799 — 2.3t over limit", time: "2h ago", type: "warn" },
];

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white ">
      <div className="flex items-center justify-end px-6 h-14">

        {/* ── Right: Search + Bell + Settings ── */}
        <div className="flex items-center gap-2">

          {/* Search — white */}
          <div className="relative">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
              strokeWidth={2.5}
            />
            <input
              type="text"
              placeholder="Search shipments, routes…"
              className="pl-8 pr-4 h-9 w-56 text-xs bg-white border border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
              style={{ fontWeight: 400 }}
            />
          </div>

          {/* Bell */}
          <div className="relative group">
            <button className="relative flex items-center justify-center w-9 h-9 rounded-lg border bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all">
              <Bell className="w-4 h-4 text-gray-500" strokeWidth={2.2} />
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-orange-500 text-white text-[9px] font-black rounded-full border-2 border-white">
                {alerts.length}
              </span>
            </button>

            {/* Notification Dropdown */}
            <div className="absolute right-0 top-[calc(100%+8px)] w-80 bg-white border border-orange-100 rounded-2xl shadow-xl shadow-orange-100/60 z-50 overflow-hidden hidden group-focus-within:block">
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-orange-50 border-b border-orange-100">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3 h-3 text-orange-500" strokeWidth={2.5} />
                  <span className="text-[11px] font-black text-gray-800 tracking-wider">ALERTS</span>
                  <span className="px-1.5 py-px text-[9px] font-black text-white bg-orange-500 rounded-full">
                    {alerts.length} NEW
                  </span>
                </div>
                <button className="text-[10.5px] font-bold text-orange-500 hover:text-orange-600 transition-colors">
                  Mark all read
                </button>
              </div>

              <div className="px-3.5 py-2 bg-orange-50 border-t border-orange-100 text-center">
                <button className="text-[10.5px] font-black text-orange-500 tracking-wider hover:text-orange-600 transition-colors">
                  VIEW ALL ALERTS →
                </button>
              </div>
            </div>
          </div>

          {/* Settings */}
          <button className="flex items-center justify-center w-9 h-9 rounded-lg border bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-300 transition-all">
            <Settings className="w-4 h-4 text-gray-500" strokeWidth={2.2} />
          </button>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;